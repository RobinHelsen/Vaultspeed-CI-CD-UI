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

import { stackRankings, dataPlatforms, cicdTools, orchestrationTools } from './config'

function getLabel(options, value) {
  return options.find((o) => o.value === value)?.label ?? value
}

export function resolveStackRankings(selectedProblems) {
  if (!selectedProblems || selectedProblems.length === 0) return []

  const scored = stackRankings
    .map((stack) => {
      let totalScore = 0
      const breakdown = {}

      for (const problemId of selectedProblems) {
        const score = stack.problemScores[problemId] ?? 0
        totalScore += score
        breakdown[problemId] = score
      }

      const avgScore = totalScore / selectedProblems.length

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
    .sort((a, b) => b.totalScore - a.totalScore)

  return scored
}
