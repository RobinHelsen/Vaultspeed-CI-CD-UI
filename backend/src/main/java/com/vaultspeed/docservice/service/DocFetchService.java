package com.vaultspeed.docservice.service;

import com.vaultspeed.docservice.config.StackMappings;
import com.vaultspeed.docservice.config.StackMappings.QueryInfo;
import com.vaultspeed.docservice.mcp.McpClientManager;
import com.vaultspeed.docservice.model.DocResponse;
import com.vaultspeed.docservice.model.DocSection;
import io.modelcontextprotocol.client.McpSyncClient;
import io.modelcontextprotocol.spec.McpSchema;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class DocFetchService {

    private static final Logger log = LoggerFactory.getLogger(DocFetchService.class);

    private final McpClientManager mcpClientManager;
    private final Map<String, DocResponse> cache = new ConcurrentHashMap<>();

    public DocFetchService(McpClientManager mcpClientManager) {
        this.mcpClientManager = mcpClientManager;
    }

    private static final long FETCH_TIMEOUT_SECONDS = 60;

    public DocResponse fetchDocs(String dataPlatform, String cicdTool, String orchestrationTool) {
        String cacheKey = dataPlatform + "__" + cicdTool + "__" + orchestrationTool;

        // Don't use computeIfAbsent — we don't want to cache empty/failed results
        DocResponse cached = cache.get(cacheKey);
        if (cached != null) {
            log.info("[fetchDocs] Cache HIT for {}", cacheKey);
            return cached;
        }

        log.info("[fetchDocs] Cache MISS for {} — fetching from MCP servers...", cacheKey);

        // Fetch all three in parallel with timeout
        var platformFuture = CompletableFuture.supplyAsync(() ->
                fetchForElement(StackMappings.PLATFORM, dataPlatform));
        var cicdFuture = CompletableFuture.supplyAsync(() ->
                fetchForElement(StackMappings.CICD, cicdTool));
        var orchFuture = CompletableFuture.supplyAsync(() ->
                fetchForElement(StackMappings.ORCHESTRATION, orchestrationTool));

        DocSection platform = joinWithTimeout(platformFuture, "platform");
        DocSection cicd = joinWithTimeout(cicdFuture, "cicd");
        DocSection orchestration = joinWithTimeout(orchFuture, "orchestration");

        DocResponse response = new DocResponse(platform, cicd, orchestration);

        // Only cache if at least one element succeeded
        if (platform != null || cicd != null || orchestration != null) {
            cache.put(cacheKey, response);
            log.info("[fetchDocs] Cached result for {}", cacheKey);
        } else {
            log.warn("[fetchDocs] All three elements returned null — NOT caching");
        }

        return response;
    }

    private DocSection joinWithTimeout(CompletableFuture<DocSection> future, String label) {
        try {
            DocSection result = future.get(FETCH_TIMEOUT_SECONDS, TimeUnit.SECONDS);
            log.info("[fetchDocs] {} => {}", label, result != null ? "GOT CONTENT" : "null");
            return result;
        } catch (java.util.concurrent.TimeoutException e) {
            log.error("[fetchDocs] {} => TIMEOUT after {}s", label, FETCH_TIMEOUT_SECONDS);
            future.cancel(true);
            return null;
        } catch (Exception e) {
            log.error("[fetchDocs] {} => EXCEPTION: {}", label, e.getMessage());
            return null;
        }
    }

    private DocSection fetchForElement(Map<String, QueryInfo> mapping, String elementValue) {
        log.info("[fetchForElement] Looking up '{}' in mapping (keys: {})", elementValue, mapping.keySet());
        QueryInfo info = mapping.get(elementValue);
        if (info == null) {
            log.warn("[fetchForElement] No mapping found for '{}'", elementValue);
            return null;
        }
        log.info("[fetchForElement] Mapped '{}' => provider={}, topic={}, query={}", elementValue, info.provider(), info.topic(), info.query());

        try {
            String content = switch (info.provider()) {
                case "microsoft_learn" -> fetchMicrosoftLearn(info);
                case "context7" -> fetchContext7(info);
                default -> {
                    log.warn("[fetchForElement] Unknown provider: {}", info.provider());
                    yield null;
                }
            };

            if (content == null || content.isBlank()) {
                log.warn("[fetchForElement] Got null/blank content for '{}' via {}", elementValue, info.provider());
                return null;
            }

            log.info("[fetchForElement] SUCCESS for '{}' via {} — content length: {}", elementValue, info.provider(), content.length());
            return new DocSection(info.provider(), info.topic(), content);
        } catch (Exception e) {
            log.error("[fetchForElement] EXCEPTION for '{}' via {}: {}", elementValue, info.provider(), e.getMessage(), e);
            return null;
        }
    }

    private String fetchMicrosoftLearn(QueryInfo info) {
        log.info("[fetchMicrosoftLearn] Getting client for 'microsoft_learn'...");
        McpSyncClient client = mcpClientManager.getClient("microsoft_learn");
        log.info("[fetchMicrosoftLearn] Client obtained. Calling 'search' with query='{}'", info.query());

        var result = client.callTool(new McpSchema.CallToolRequest(
                "search",
                Map.of("query", info.query())
        ));

        String text = extractTextContent(result);
        log.info("[fetchMicrosoftLearn] Result: {}", text != null ? text.length() + " chars" : "null");
        return text;
    }

    private String fetchContext7(QueryInfo info) {
        log.info("[fetchContext7] Getting client for 'context7'...");
        McpSyncClient client = mcpClientManager.getClient("context7");
        log.info("[fetchContext7] Client obtained. Step 1: resolve-library-id for '{}'", info.topic());

        // Step 1: Resolve library ID
        Map<String, Object> resolveArgs = new java.util.HashMap<>();
        resolveArgs.put("libraryName", info.topic());
        resolveArgs.put("query", info.query());
        log.info("[fetchContext7] Calling resolve-library-id with args: {}", resolveArgs);
        var resolveResult = client.callTool(new McpSchema.CallToolRequest("resolve-library-id", resolveArgs));

        String resolveText = extractTextContent(resolveResult);
        log.info("[fetchContext7] Resolve result: {}", resolveText != null ? resolveText.substring(0, Math.min(200, resolveText.length())) : "null");
        if (resolveText == null) {
            log.warn("[fetchContext7] No resolve result for '{}'", info.topic());
            return null;
        }

        // Extract the first library ID (pattern: /org/repo)
        var matcher = java.util.regex.Pattern.compile("/[\\w.-]+/[\\w.-]+").matcher(resolveText);
        if (!matcher.find()) {
            log.warn("[fetchContext7] No library ID found in resolve response for '{}'", info.topic());
            return null;
        }
        String libraryId = matcher.group();
        log.info("[fetchContext7] Step 2: query-docs for libraryId='{}', query='{}'", libraryId, info.query());

        // Step 2: Fetch documentation using query-docs tool
        Map<String, Object> docsArgs = new java.util.HashMap<>();
        docsArgs.put("libraryId", libraryId);
        docsArgs.put("query", info.query());
        var docsResult = client.callTool(new McpSchema.CallToolRequest("query-docs", docsArgs));

        String text = extractTextContent(docsResult);
        log.info("[fetchContext7] Docs result: {}", text != null ? text.length() + " chars" : "null");
        return text;
    }

    private String extractTextContent(McpSchema.CallToolResult result) {
        if (result == null || result.content() == null) {
            return null;
        }

        String text = result.content().stream()
                .filter(c -> c instanceof McpSchema.TextContent)
                .map(c -> ((McpSchema.TextContent) c).text())
                .filter(t -> t != null && !t.isBlank())
                .collect(Collectors.joining("\n\n"));

        return text.isBlank() ? null : text;
    }
}
