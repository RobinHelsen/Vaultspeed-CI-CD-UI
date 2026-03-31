package com.vaultspeed.docservice.mcp;

import io.modelcontextprotocol.client.McpClient;
import io.modelcontextprotocol.client.McpSyncClient;
import io.modelcontextprotocol.client.transport.ServerParameters;
import io.modelcontextprotocol.client.transport.StdioClientTransport;
import io.modelcontextprotocol.json.McpJsonDefaults;
import io.modelcontextprotocol.spec.McpSchema;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Manages MCP server processes. Spawns each server on first use via stdio transport
 * and keeps them alive for the application lifetime.
 */
@Component
public class McpClientManager {

    private static final Logger log = LoggerFactory.getLogger(McpClientManager.class);

    private final Map<String, McpSyncClient> clients = new ConcurrentHashMap<>();

    @Value("${mcp.context7.command}")
    private String context7Command;

    @Value("${mcp.context7.args}")
    private String context7Args;

    @Value("${mcp.microsoft-learn.command}")
    private String msLearnCommand;

    @Value("${mcp.microsoft-learn.args}")
    private String msLearnArgs;

    public McpSyncClient getClient(String provider) {
        return clients.computeIfAbsent(provider, this::createClient);
    }

    private McpSyncClient createClient(String provider) {
        String command;
        List<String> args;

        switch (provider) {
            case "context7" -> {
                command = context7Command;
                args = List.of(context7Args.split(","));
            }
            case "microsoft_learn" -> {
                command = msLearnCommand;
                args = List.of(msLearnArgs.split(","));
            }
            default -> throw new IllegalArgumentException("Unknown MCP provider: " + provider);
        }

        log.info("Starting MCP server for provider '{}': {} {}", provider, command, args);

        ServerParameters params = ServerParameters.builder(command)
                .args(args)
                .build();

        var transport = new StdioClientTransport(params, McpJsonDefaults.getMapper());

        var client = McpClient.sync(transport)
                .clientInfo(new McpSchema.Implementation("vaultspeed-doc-service", "1.0.0"))
                .build();

        client.initialize();
        log.info("MCP server '{}' initialized successfully", provider);

        // Log available tools and their schemas
        try {
            var toolsList = client.listTools();
            if (toolsList != null && toolsList.tools() != null) {
                for (var tool : toolsList.tools()) {
                    log.info("MCP server '{}' tool: {} — schema: {}", provider, tool.name(), tool.inputSchema());
                }
            }
        } catch (Exception e) {
            log.warn("Failed to list tools for '{}': {}", provider, e.getMessage());
        }

        return client;
    }

    @PreDestroy
    public void shutdown() {
        clients.forEach((provider, client) -> {
            try {
                log.info("Shutting down MCP server '{}'", provider);
                client.close();
            } catch (Exception e) {
                log.warn("Error shutting down MCP server '{}': {}", provider, e.getMessage());
            }
        });
        clients.clear();
    }
}
