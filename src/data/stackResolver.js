/**
 * Resolves ranked stack combinations based on CSV matrix data.
 *
 * Problem matrix values: 0 = no issue, 1 = worst issue.
 *   → Inverted for scoring: score = (1 - value), so 0 problems → 1 (best), 1 problem → 0 (worst).
 *
 * Performance matrix values: 1 = good, 0 = lacking.
 *   → Used directly: higher = better.
 *
 * Both dimensions are summed per stack and normalized to a 0–10 scale
 * relative to the best stack in the result set.
 *
 * Returns an array of { stack info, totalScore, avgScore, breakdown }.
 */

import { dataPlatforms, cicdTools, orchestrationTools, enforcedStack, stackContextKeys } from './config'

function getLabel(options, value) {
  return options.find((o) => o.value === value)?.label ?? value
}

function stackKey(stack) {
  return `${stack.dataPlatform}__${stack.cicdTool}__${stack.orchestrationTool}`
}

function parseStackKey(key) {
  const [dataPlatform, cicdTool, orchestrationTool] = key.split('__')
  return { dataPlatform, cicdTool, orchestrationTool }
}

function getEnforcedRules(enforcedIds) {
  return enforcedIds
    .map((id) => enforcedStack.find((o) => o.id === id))
    .filter(Boolean)
}

function matchesEnforcedParts(stack, enforcedIds) {
  if (!enforcedIds || enforcedIds.length === 0) return true
  const rules = getEnforcedRules(enforcedIds)
  return rules.every((rule) => stack[rule.part] === rule.value)
}

function hasFeasibleEnforcedCombination(enforcedIds) {
  if (!enforcedIds || enforcedIds.length === 0) return true
  const rules = getEnforcedRules(enforcedIds)
  return stackContextKeys.some((key) => {
    const combo = parseStackKey(key)
    return rules.every((rule) => combo[rule.part] === rule.value)
  })
}

export function getEnforcedFeasibilityError(enforcedIds = []) {
  if (!enforcedIds || enforcedIds.length === 0) return ''
  if (hasFeasibleEnforcedCombination(enforcedIds)) return ''

  const selected = getEnforcedRules(enforcedIds).map((rule) => `${rule.part}=${rule.value}`).join(', ')
  return `No feasible stack context file exists for this enforced combination (${selected}). Please adjust enforced stack parts.`
}

/**
 * Main resolver.
 *
 * @param {string[]} selectedProblems - IDs of checked problem checkboxes (LCI + EC + DC)
 * @param {string[]} enforced - IDs of enforced stack part checkboxes
 * @param {string[]} performanceNeeds - IDs of checked performance priority checkboxes
 * @param {{ problemMatrix, performanceMatrix }} matrixData - Parsed CSV data from csvLoader
 */
export function resolveStackRankings(selectedProblems, enforced = [], performanceNeeds = [], matrixData = {}) {
  const problems = selectedProblems || []
  const hasAnyFilter =
    (enforced && enforced.length > 0) ||
    problems.length > 0 ||
    (performanceNeeds && performanceNeeds.length > 0)
  if (!hasAnyFilter) return []
  if (!hasFeasibleEnforcedCombination(enforced)) return []

  const { problemMatrix = {}, performanceMatrix = {} } = matrixData

  // Score each stack
  const candidates = stackContextKeys
    .map(parseStackKey)
    .filter((stack) => matchesEnforcedParts(stack, enforced))
    .map((stack) => {
      const key = stackKey(stack)
      const problemValues = problemMatrix[key] || {}
      const performanceValues = performanceMatrix[key] || {}

      // --- Problem dimension ---
      // For each checked problem, the CSV value (0-1) represents how bad the stack is.
      // Invert: score contribution = (1 - csvValue). Sum all checked problems.
      let problemScore = 0
      const breakdown = {}
      for (const problemId of problems) {
        const csvVal = problemValues[problemId] ?? 0
        const inverted = 1 - csvVal  // 0 csv = 1 (best), 1 csv = 0 (worst)
        problemScore += inverted
        breakdown[problemId] = inverted
      }

      // --- Performance dimension ---
      // For each checked performance priority, CSV value (0-1) is how good the stack is.
      // Sum directly.
      let performanceScore = 0
      for (const perfId of performanceNeeds) {
        const csvVal = performanceValues[perfId] ?? 1
        performanceScore += csvVal
      }

      return {
        dataPlatform: stack.dataPlatform,
        cicdTool: stack.cicdTool,
        orchestrationTool: stack.orchestrationTool,
        dataPlatformLabel: getLabel(dataPlatforms, stack.dataPlatform),
        cicdToolLabel: getLabel(cicdTools, stack.cicdTool),
        orchestrationToolLabel: getLabel(orchestrationTools, stack.orchestrationTool),
        rawProblemScore: problemScore,
        rawPerformanceScore: performanceScore,
        breakdown,
      }
    })

  if (candidates.length === 0) return []

  // --- Normalize each dimension to 0–10 ---
  const maxProblem = Math.max(...candidates.map((c) => c.rawProblemScore), 0.001)
  const maxPerformance = Math.max(...candidates.map((c) => c.rawPerformanceScore), 0.001)

  const hasProblems = problems.length > 0
  const hasPerformance = performanceNeeds.length > 0

  const scored = candidates.map((c) => {
    const normProblem = hasProblems ? (c.rawProblemScore / maxProblem) * 10 : 0
    const normPerformance = hasPerformance ? (c.rawPerformanceScore / maxPerformance) * 10 : 0

    // Combine: average of active dimensions
    const activeDimensions = (hasProblems ? 1 : 0) + (hasPerformance ? 1 : 0)
    const totalScore = activeDimensions > 0
      ? (normProblem + normPerformance) / activeDimensions
      : 0

    // Normalize per-problem breakdown values to 0-10 scale
    const normalizedBreakdown = {}
    for (const problemId of problems) {
      const rawVal = c.breakdown[problemId] ?? 0
      // Scale: 1 (no issue) → 10, 0 (worst) → 0
      normalizedBreakdown[problemId] = Math.round(rawVal * 10 * 10) / 10
    }

    return {
      dataPlatform: c.dataPlatform,
      cicdTool: c.cicdTool,
      orchestrationTool: c.orchestrationTool,
      dataPlatformLabel: c.dataPlatformLabel,
      cicdToolLabel: c.cicdToolLabel,
      orchestrationToolLabel: c.orchestrationToolLabel,
      totalScore: Math.round(totalScore * 10) / 10,
      avgScore: Math.round(totalScore * 10) / 10,
      breakdown: normalizedBreakdown,
    }
  })

  scored.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore
    return stackKey(a).localeCompare(stackKey(b))
  })

  return scored
}
