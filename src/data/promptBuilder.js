/**
 * ======================================================================
 * Prompt Builder & Anthropic API Service
 * ======================================================================
 *
 * Assembles the prompt by fetching and concatenating text files from
 * the public/prompts/ directory based on the user's UI selections:
 *
 *   1. General context files       (1.general/)              — always included
 *   2. Stack context file          (2.stackContext/)          — matched by dropdown combo
 *   3. Large-scale issue files     (3.largeScaleIssues/)     — per selected issue
 *   4. Enterprise constraint files (4.enterpriseContraints/)  — per selected constraint
 *   5. Delivery complication files (5.deliveryComplications/) — per selected complication
 *   6. Free-text "Additional context" from the UI            — appended at the end
 */

import {
  generalPromptFiles,
  largeScaleIssues,
  enterpriseConstraints,
  deliveryComplications,
} from './config'

// ─── File-content cache (avoids re-fetching the same file) ───────────
const fileCache = new Map()

async function fetchPromptFile(path) {
  if (fileCache.has(path)) return fileCache.get(path)

  const res = await fetch(path)
  if (!res.ok) {
    console.warn(`Could not load prompt file: ${path} (${res.status})`)
    return ''
  }
  const text = await res.text()
  fileCache.set(path, text)
  return text
}

// ─── Resolve the stack context filename ──────────────────────────────
// Files follow the pattern: stack_{dataPlatform}__{cicd}__{orchestration}.txt
// We try exact match first, then fall back to unspecified variants.
function buildStackFileName(dataPlatform, cicdTool, orchestrationTool) {
  return `/prompts/2.stackContext/stack_${dataPlatform}__${cicdTool}__${orchestrationTool}.txt`
}

function buildStackFallbacks(dataPlatform, cicdTool, orchestrationTool) {
  return [
    buildStackFileName(dataPlatform, cicdTool, orchestrationTool),
    buildStackFileName(dataPlatform, cicdTool, 'unspecified'),
    buildStackFileName(dataPlatform, 'unspecified', orchestrationTool),
    buildStackFileName(dataPlatform, 'unspecified', 'unspecified'),
  ]
}

async function fetchStackContext(dataPlatform, cicdTool, orchestrationTool) {
  const candidates = buildStackFallbacks(dataPlatform, cicdTool, orchestrationTool)

  for (const path of candidates) {
    const content = await fetchPromptFile(path)
    if (content) return { path, content }
  }

  return { path: null, content: '' }
}

// ─── Lookup helpers ──────────────────────────────────────────────────
function findPromptFiles(ids, optionsList) {
  return ids
    .map((id) => optionsList.find((o) => o.id === id))
    .filter((o) => o?.promptFile)
    .map((o) => o.promptFile)
}

// ─── Build the assembled prompt ──────────────────────────────────────
async function buildPrompt({
  dataPlatform,
  cicdTool,
  orchestrationTool,
  constraintIds,
  complicationIds,
  largeScaleIds,
  extraInfo,
}) {
  const parts = []

  // 1. General context (always loaded)
  const generalTexts = await Promise.all(generalPromptFiles.map(fetchPromptFile))
  generalTexts.forEach((text, i) => {
    if (text) {
      parts.push(`=== General Context (file ${i + 1}) ===`)
      parts.push(text.trim())
      parts.push('')
    }
  })

  // 2. Stack context (matched by dropdown combination)
  const { path: stackPath, content: stackText } = await fetchStackContext(
    dataPlatform, cicdTool, orchestrationTool
  )
  if (stackText) {
    parts.push(`=== Stack Context${stackPath ? ` (${stackPath})` : ''} ===`)
    parts.push(stackText.trim())
    parts.push('')
  } else {
    parts.push('=== Stack Context ===')
    parts.push(`No specific stack context file found for: ${dataPlatform} / ${cicdTool} / ${orchestrationTool}`)
    parts.push('Please generate a best-effort guide based on the general context and the stack combination above.')
    parts.push('')
  }

  // 3. Large-scale issues
  const lsFiles = findPromptFiles(largeScaleIds, largeScaleIssues)
  if (lsFiles.length > 0) {
    const lsTexts = await Promise.all(lsFiles.map(fetchPromptFile))
    parts.push('=== Large-Scale Issues ===')
    lsTexts.forEach((text) => {
      if (text) {
        parts.push(text.trim())
        parts.push('---')
      }
    })
    parts.push('')
  }

  // 4. Enterprise constraints
  const ecFiles = findPromptFiles(constraintIds, enterpriseConstraints)
  if (ecFiles.length > 0) {
    const ecTexts = await Promise.all(ecFiles.map(fetchPromptFile))
    parts.push('=== Enterprise Constraints ===')
    ecTexts.forEach((text) => {
      if (text) {
        parts.push(text.trim())
        parts.push('---')
      }
    })
    parts.push('')
  }

  // 5. Delivery complications
  const dcFiles = findPromptFiles(complicationIds, deliveryComplications)
  if (dcFiles.length > 0) {
    const dcTexts = await Promise.all(dcFiles.map(fetchPromptFile))
    parts.push('=== Delivery Complications ===')
    dcTexts.forEach((text) => {
      if (text) {
        parts.push(text.trim())
        parts.push('---')
      }
    })
    parts.push('')
  }

  // 6. Extra info (free-text from user)
  if (extraInfo && extraInfo.trim()) {
    parts.push('=== Additional Context from User ===')
    parts.push(extraInfo.trim())
    parts.push('')
  }

  // Final instruction
  parts.push('=== Task ===')
  parts.push('Based on all the context above, generate a complete, tailored CI/CD setup guide including:')
  parts.push('- deployment code')
  parts.push('- setup instructions')
  parts.push('- implementation documentation')

  return parts.join('\n')
}

// ─── Main API call ───────────────────────────────────────────────────
/**
 * @param {Object}   params
 * @param {string}   params.dataPlatform      — dropdown value (e.g. "snowflake")
 * @param {string}   params.cicdTool          — dropdown value (e.g. "github")
 * @param {string}   params.orchestrationTool — dropdown value (e.g. "airflow")
 * @param {string[]} params.constraints       — selected enterprise constraint IDs
 * @param {string[]} params.complications     — selected delivery complication IDs
 * @param {string[]} params.largeScale        — selected large-scale issue IDs
 * @param {string}   params.extraInfo         — free-text extra context
 * @returns {Promise<string>}                 — the generated guide (markdown string)
 */
export async function generateGuide({
  dataPlatform,
  cicdTool,
  orchestrationTool,
  constraints,
  complications,
  largeScale,
  extraInfo,
}) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey || apiKey === 'your-api-key-here') {
    throw new Error('Please set your Anthropic API key in the .env file (VITE_ANTHROPIC_API_KEY).')
  }

  const prompt = await buildPrompt({
    dataPlatform,
    cicdTool,
    orchestrationTool,
    constraintIds: constraints,
    complicationIds: complications,
    largeScaleIds: largeScale,
    extraInfo,
  })

  const response = await fetch('/api/anthropic/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 16000,
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
  return { text: data.content?.[0]?.text || 'No response generated.', prompt }
}

// ─── Chat follow-up (reuses original context as system prompt) ───
/**
 * @param {Object}   params
 * @param {string}   params.systemPrompt      — the original assembled prompt used for guide generation
 * @param {string}   params.guideContent      — the generated guide (first assistant message)
 * @param {Array}    params.chatHistory        — array of { role: 'user'|'assistant', content: string }
 * @param {string}   params.userMessage        — the new follow-up question
 * @returns {Promise<string>}                  — assistant reply
 */
export async function sendChatMessage({ systemPrompt, guideContent, chatHistory, userMessage }) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey || apiKey === 'your-api-key-here') {
    throw new Error('Please set your Anthropic API key in the .env file (VITE_ANTHROPIC_API_KEY).')
  }

  // Build the messages array: original prompt→guide as first exchange, then chat history, then new question
  const messages = [
    { role: 'user', content: systemPrompt },
    { role: 'assistant', content: guideContent },
    ...chatHistory,
    { role: 'user', content: userMessage },
  ]

  const response = await fetch('/api/anthropic/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 16000,
      messages,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Anthropic API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.content?.[0]?.text || 'No response generated.'
}
