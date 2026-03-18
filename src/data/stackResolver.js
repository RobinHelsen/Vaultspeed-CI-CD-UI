/**
 * Resolves ranked stack combinations based on selected problems.
 *
 * For each stack in stackRankings:
 *   - Sum the scores for each selected problem.
 *   - Divide by number of selected problems to get an average score.
 *   - Sort descending (best fit first).
 *
 * Returns an array of { stack, totalScore, avgScore, breakdown }.
 */

import { stackRankings, dataPlatforms, cicdTools, orchestrationTools, enforcedStack, stackContextKeys } from './config'

function getLabel(options, value) {
  return options.find((o) => o.value === value)?.label ?? value
}

const aliasMap = {
  dataPlatform: {
    bigquery: 'google_bigquery',
    redshift: 'amazon_redshift',
    synapse: 'azure_synapse',
    postgres: 'microsoft_sql_server',
  },
  orchestrationTool: {
    adf: 'azure_data_factory',
  },
}

function normalizeValue(part, value) {
  return aliasMap[part]?.[value] ?? value
}

function normalizeStackParts(stack) {
  return {
    ...stack,
    dataPlatform: normalizeValue('dataPlatform', stack.dataPlatform),
    cicdTool: normalizeValue('cicdTool', stack.cicdTool),
    orchestrationTool: normalizeValue('orchestrationTool', stack.orchestrationTool),
  }
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
    const [dataPlatform, cicdTool, orchestrationTool] = key.split('__')
    const combo = { dataPlatform, cicdTool, orchestrationTool }
    return rules.every((rule) => combo[rule.part] === rule.value)
  })
}

export function getEnforcedFeasibilityError(enforcedIds = []) {
  if (!enforcedIds || enforcedIds.length === 0) return ''
  if (hasFeasibleEnforcedCombination(enforcedIds)) return ''

  const selected = getEnforcedRules(enforcedIds).map((rule) => `${rule.part}=${rule.value}`).join(', ')
  return `No feasible stack context file exists for this enforced combination (${selected}). Please adjust enforced stack parts.`
}

export function resolveStackRankings(selectedProblems, enforced = []) {
  const problems = selectedProblems || []
  const hasAnyFilter = (enforced && enforced.length > 0) || problems.length > 0
  if (!hasAnyFilter) return []
  if (!hasFeasibleEnforcedCombination(enforced)) return []

  const rankingByKey = new Map(
    stackRankings
      .map((stack) => {
        const normalized = normalizeStackParts(stack)
        return [stackKey(normalized), stack.problemScores || {}]
      })
  )

  const scored = stackContextKeys
    .map(parseStackKey)
    .filter((stack) => matchesEnforcedParts(stack, enforced))
    .map((stack) => {
      const key = stackKey(stack)
      const problemScores = rankingByKey.get(key) || {}
      let totalScore = 0
      const breakdown = {}

      for (const problemId of problems) {
        const score = problemScores[problemId] ?? 0
        totalScore += score
        breakdown[problemId] = score
      }

      const avgScore = problems.length > 0 ? totalScore / problems.length : 0

      return {
        dataPlatform: stack.dataPlatform,
        cicdTool: stack.cicdTool,
        orchestrationTool: stack.orchestrationTool,
        dataPlatformLabel: getLabel(dataPlatforms, stack.dataPlatform),
        cicdToolLabel: getLabel(cicdTools, stack.cicdTool),
        orchestrationToolLabel: getLabel(orchestrationTools, stack.orchestrationTool),
        totalScore,
        avgScore: Math.round(avgScore * 10) / 10,
        breakdown,
      }
    })
    .sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore
      return stackKey(a).localeCompare(stackKey(b))
    })

  return scored
}
