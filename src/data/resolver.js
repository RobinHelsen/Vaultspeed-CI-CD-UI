/**
 * Resolves the best-matching guideline(s) from config based on the user's selections.
 *
 * Matching rules:
 *  1. Build the lookup key as "dataPlatform|cicdTool|orchestrationTool".
 *  2. A guideline's key segment "*" matches any value.
 *  3. If the user selected problems, guidelines that address at least one of those
 *     problems are preferred. A guideline with `problems: []` is a catch-all.
 *  4. Level must match exactly, or the guideline's level must be "*".
 *  5. More specific matches (fewer wildcards, more problem overlap) are ranked higher.
 *
 * Returns an array of matched guidelines, sorted best-match-first.
 */

import { guidelines } from '../data/config'

function segmentMatch(guidelineSegment, userSegment) {
  return guidelineSegment === '*' || guidelineSegment === userSegment
}

function keyMatch(guidelineKey, dataPlatform, cicdTool, orchestrationTool) {
  const [gData, gCicd, gOrch] = guidelineKey.split('|')
  return (
    segmentMatch(gData, dataPlatform) &&
    segmentMatch(gCicd, cicdTool) &&
    segmentMatch(gOrch, orchestrationTool)
  )
}

function problemOverlap(guidelineProblems, selectedProblems) {
  if (guidelineProblems.length === 0) return 0 // catch-all
  return guidelineProblems.filter((p) => selectedProblems.includes(p)).length
}

function wildcardCount(key) {
  return key.split('|').filter((s) => s === '*').length
}

export function resolveGuidelines({ dataPlatform, cicdTool, orchestrationTool, problems, level }) {
  if (!dataPlatform || !cicdTool || !orchestrationTool || !level) {
    return []
  }

  const matched = guidelines
    .filter((g) => {
      // Key must match
      if (!keyMatch(g.key, dataPlatform, cicdTool, orchestrationTool)) return false
      // Level must match
      if (g.level !== '*' && g.level !== level) return false
      // If guideline targets specific problems, at least one must be selected
      if (g.problems.length > 0 && problemOverlap(g.problems, problems) === 0) return false
      return true
    })
    .map((g) => ({
      ...g,
      _wildcards: wildcardCount(g.key),
      _problemOverlap: problemOverlap(g.problems, problems),
      _isCatchAll: g.problems.length === 0,
    }))
    .sort((a, b) => {
      // Fewer wildcards = more specific = better
      if (a._wildcards !== b._wildcards) return a._wildcards - b._wildcards
      // More problem overlap = better
      if (b._problemOverlap !== a._problemOverlap) return b._problemOverlap - a._problemOverlap
      // Problem-specific before catch-all
      if (a._isCatchAll !== b._isCatchAll) return a._isCatchAll ? 1 : -1
      return 0
    })

  return matched
}
