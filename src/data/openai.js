/**
 * ======================================================================
 * Anthropic API Service
 * ======================================================================
 *
 * Assembles one big prompt by concatenating:
 *   1. public/prompts/context.txt  — baseline VaultSpeed product context
 *   2. public/prompts/rules.txt    — generation rules
 *   3. Stack selection             — from UI dropdowns
 *   4. Checked items               — enterprise constraints + delivery complications
 *   5. Additional context          — free-text field from the user
 *
 * The two .txt files are fetched at runtime so they can be edited
 * without touching application code.
 */

// ─── Fetch and cache the two prompt files ────────────────────────────
let cachedContext = null
let cachedRules = null

async function loadPromptFiles() {
  if (cachedContext && cachedRules) {
    return { context: cachedContext, rules: cachedRules }
  }

  const [ctxRes, rulesRes] = await Promise.all([
    fetch('/prompts/general/context_vaultspeed_basics.txt'),
    fetch('/prompts/general/context_vaultspeed_cicd_generator.txt'),
  ])

  if (!ctxRes.ok) throw new Error('Failed to load prompts/general/context_vaultspeed_basics.txt')
  if (!rulesRes.ok) throw new Error('Failed to load prompts/general/context_vaultspeed_cicd_generator.txt')

  cachedContext = await ctxRes.text()
  cachedRules = await rulesRes.text()

  return { context: cachedContext, rules: cachedRules }
}

// ─── Build the single assembled prompt ───────────────────────────────
function buildPrompt({ context, rules, dataPlatform, cicdTool, orchestrationTool, constraints, complications, enforced, largeScale, extraInfo }) {
  const parts = []

  parts.push('Context file 1:')
  parts.push(context)
  parts.push('')
  parts.push('Context file 2:')
  parts.push(rules)
  parts.push('')

  parts.push('Selected stack:')
  parts.push(`- Data platform: ${dataPlatform}`)
  parts.push(`- CI/CD: ${cicdTool}`)
  parts.push(`- Orchestration: ${orchestrationTool}`)
  parts.push('')

  if (enforced && enforced.length > 0) {
    parts.push('Enforced stack requirements:')
    enforced.forEach((c) => parts.push(`- ${c}`))
    parts.push('')
  }

  if (largeScale && largeScale.length > 0) {
    parts.push('Large-scale issues:')
    largeScale.forEach((c) => parts.push(`- ${c}`))
    parts.push('')
  }

  if (constraints && constraints.length > 0) {
    parts.push('Selected enterprise constraints:')
    constraints.forEach((c) => parts.push(`- ${c}`))
    parts.push('')
  }

  if (complications && complications.length > 0) {
    parts.push('Selected delivery complications:')
    complications.forEach((c) => parts.push(`- ${c}`))
    parts.push('')
  }

  if (extraInfo && extraInfo.trim()) {
    parts.push('Additional context:')
    parts.push(extraInfo.trim())
    parts.push('')
  }

  parts.push('Generate:')
  parts.push('- deployment code')
  parts.push('- setup instructions')
  parts.push('- implementation documentation')

  return parts.join('\n')
}

// ─── Main API call ───────────────────────────────────────────────────
/**
 * @param {Object}   params
 * @param {string}   params.dataPlatform      — e.g. "Snowflake"
 * @param {string}   params.cicdTool          — e.g. "GitHub Actions"
 * @param {string}   params.orchestrationTool — e.g. "Apache Airflow"
 * @param {string[]} params.enforced         — selected enforced stack labels
 * @param {string[]} params.largeScale        — selected large-scale issue labels
 * @param {string[]} params.constraints       — selected enterprise constraint labels
 * @param {string[]} params.complications     — selected delivery complication labels
 * @param {string}   params.extraInfo         — free-text extra context
 * @returns {Promise<string>}                 — the generated guide (markdown string)
 */
export async function generateGuide({ dataPlatform, cicdTool, orchestrationTool, constraints, complications, enforced, largeScale, extraInfo }) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey || apiKey === 'your-api-key-here') {
    throw new Error('Please set your Anthropic API key in the .env file (VITE_ANTHROPIC_API_KEY).')
  }

  const { context, rules } = await loadPromptFiles()

  const prompt = buildPrompt({
    context, rules,
    dataPlatform, cicdTool, orchestrationTool,
    constraints, complications, enforced, largeScale, extraInfo,
  })

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [
        { role: 'user', content: prompt },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Anthropic API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.content?.[0]?.text || 'No response generated.'
}
