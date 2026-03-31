/**
 * ======================================================================
 * Documentation Fetcher — calls the Spring Boot backend which manages
 * MCP server communication (Microsoft Learn, Context7).
 * ======================================================================
 *
 * The frontend sends a single request with the stack combination.
 * The backend resolves which MCP provider to use for each element,
 * fetches the docs, and returns the results.
 */

// ─── Provider labels (for display / prompt formatting) ───────────────
export const PROVIDERS = {
  MICROSOFT_LEARN: 'microsoft_learn',
  CONTEXT7: 'context7',
}

function providerLabel(provider) {
  switch (provider) {
    case PROVIDERS.MICROSOFT_LEARN: return 'Microsoft Learn'
    case PROVIDERS.CONTEXT7:        return 'Context7'
    default:                        return provider
  }
}

// ─── Documentation results cache ─────────────────────────────────────
const docsCache = new Map()

function cacheKey(dataPlatform, cicdTool, orchestrationTool) {
  return `${dataPlatform}__${cicdTool}__${orchestrationTool}`
}

// ─── Main entry point ────────────────────────────────────────────────

/**
 * Fetches external documentation for the given stack combination
 * by calling the Spring Boot backend.
 *
 * @param {Object} params
 * @param {string} params.dataPlatform      — e.g. "snowflake", "azure_synapse"
 * @param {string} params.cicdTool          — e.g. "github", "azure_devops"
 * @param {string} params.orchestrationTool — e.g. "airflow", "azure_data_factory"
 * @returns {Promise<{ platform: Object|null, cicd: Object|null, orchestration: Object|null }>}
 */
export async function fetchStackDocumentation({ dataPlatform, cicdTool, orchestrationTool }) {
  console.log('[docFetcher] fetchStackDocumentation called:', { dataPlatform, cicdTool, orchestrationTool })
  const key = cacheKey(dataPlatform, cicdTool, orchestrationTool)

  if (docsCache.has(key)) {
    console.log('[docFetcher] Cache HIT for key:', key)
    return docsCache.get(key)
  }

  console.log('[docFetcher] Cache MISS — calling backend POST /api/docs/fetch')
  const res = await fetch('/api/docs/fetch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataPlatform, cicdTool, orchestrationTool }),
  })

  if (!res.ok) {
    console.warn('[docFetcher] Backend returned error status:', res.status)
    return { platform: null, cicd: null, orchestration: null }
  }

  const result = await res.json()
  console.log('[docFetcher] Backend response received:', {
    platform: result.platform ? `${result.platform.provider}: ${result.platform.topic}` : null,
    cicd: result.cicd ? `${result.cicd.provider}: ${result.cicd.topic}` : null,
    orchestration: result.orchestration ? `${result.orchestration.provider}: ${result.orchestration.topic}` : null,
  })
  docsCache.set(key, result)
  return result
}

/**
 * Formats fetched documentation into prompt-ready text sections.
 *
 * @param {{ platform: Object|null, cicd: Object|null, orchestration: Object|null }} docs
 * @returns {string} — formatted documentation text for prompt injection
 */
export function formatDocsForPrompt(docs) {
  const sections = []

  if (docs.platform?.content) {
    sections.push(`=== External Documentation: ${docs.platform.topic} (via ${providerLabel(docs.platform.provider)}) ===`)
    sections.push(docs.platform.content)
    sections.push('')
  }

  if (docs.cicd?.content) {
    sections.push(`=== External Documentation: ${docs.cicd.topic} (via ${providerLabel(docs.cicd.provider)}) ===`)
    sections.push(docs.cicd.content)
    sections.push('')
  }

  if (docs.orchestration?.content) {
    sections.push(`=== External Documentation: ${docs.orchestration.topic} (via ${providerLabel(docs.orchestration.provider)}) ===`)
    sections.push(docs.orchestration.content)
    sections.push('')
  }

  return sections.join('\n')
}

/**
 * Returns the provider mapping for a given stack combination (useful for UI display).
 * This is a local-only lookup — no backend call needed.
 */
export function getProviderMapping({ dataPlatform, cicdTool, orchestrationTool }) {
  const PLATFORM_PROVIDERS = {
    azure_synapse: { provider: PROVIDERS.MICROSOFT_LEARN, topic: 'Azure Synapse Analytics' },
    microsoft_sql_server: { provider: PROVIDERS.MICROSOFT_LEARN, topic: 'Microsoft SQL Server' },
    fabric: { provider: PROVIDERS.MICROSOFT_LEARN, topic: 'Microsoft Fabric' },
    snowflake: { provider: PROVIDERS.CONTEXT7, topic: 'Snowflake' },
    databricks: { provider: PROVIDERS.CONTEXT7, topic: 'Databricks' },
    google_bigquery: { provider: PROVIDERS.CONTEXT7, topic: 'Google BigQuery' },
    amazon_redshift: { provider: PROVIDERS.CONTEXT7, topic: 'Amazon Redshift' },
    oracle: { provider: PROVIDERS.CONTEXT7, topic: 'Oracle Database' },
    singlestore: { provider: PROVIDERS.CONTEXT7, topic: 'SingleStore' },
  }

  const CICD_PROVIDERS = {
    azure_devops: { provider: PROVIDERS.MICROSOFT_LEARN, topic: 'Azure DevOps Pipelines' },
    azure_devops_plus_schemachange: { provider: PROVIDERS.MICROSOFT_LEARN, topic: 'Azure DevOps + Schemachange' },
    github: { provider: PROVIDERS.CONTEXT7, topic: 'GitHub Actions' },
    gitlab: { provider: PROVIDERS.CONTEXT7, topic: 'GitLab CI/CD' },
    google_cloud_build: { provider: PROVIDERS.CONTEXT7, topic: 'Google Cloud Build' },
    dataops_live: { provider: PROVIDERS.CONTEXT7, topic: 'DataOps.live' },
    git: { provider: PROVIDERS.CONTEXT7, topic: 'Git' },
    odi: { provider: PROVIDERS.CONTEXT7, topic: 'Oracle Data Integrator' },
  }

  const ORCH_PROVIDERS = {
    azure_data_factory: { provider: PROVIDERS.MICROSOFT_LEARN, topic: 'Azure Data Factory' },
    adf_synapse_pipelines: { provider: PROVIDERS.MICROSOFT_LEARN, topic: 'ADF / Synapse Pipelines' },
    airflow: { provider: PROVIDERS.CONTEXT7, topic: 'Apache Airflow' },
    airflow_cloud_composer: { provider: PROVIDERS.CONTEXT7, topic: 'Cloud Composer (Airflow)' },
    native_databricks_plus_airflow: { provider: PROVIDERS.CONTEXT7, topic: 'Databricks + Airflow' },
    talend: { provider: PROVIDERS.CONTEXT7, topic: 'Talend' },
    generic_fmc_snowflake: { provider: PROVIDERS.CONTEXT7, topic: 'Snowflake FMC' },
    generic_fmc_dbt: { provider: PROVIDERS.CONTEXT7, topic: 'dbt' },
    odi: { provider: PROVIDERS.CONTEXT7, topic: 'Oracle Data Integrator' },
  }

  const enrich = (map, value) => {
    const entry = map[value]
    if (!entry) return null
    return { ...entry, label: providerLabel(entry.provider) }
  }

  return {
    platform:      enrich(PLATFORM_PROVIDERS, dataPlatform),
    cicd:          enrich(CICD_PROVIDERS, cicdTool),
    orchestration: enrich(ORCH_PROVIDERS, orchestrationTool),
  }
}

/** Clears the documentation cache (e.g., when user wants fresh docs). */
export function clearDocsCache() {
  docsCache.clear()
}
