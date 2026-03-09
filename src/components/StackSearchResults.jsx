import { enterpriseProblems } from '../data/config'

export default function StackSearchResults({ results, selectedProblems }) {
  if (results.length === 0) {
    return (
      <div className="result-panel empty">
        <p>Select at least one enterprise problem above to see ranked stack recommendations.</p>
      </div>
    )
  }

  const maxScore = results[0].totalScore
  const problemLabels = {}
  for (const p of enterpriseProblems) {
    problemLabels[p.id] = p.label
  }

  return (
    <div className="result-panel stack-results">
      {results.map((r, idx) => {
        const rank = idx + 1
        const barWidth = maxScore > 0 ? (r.totalScore / maxScore) * 100 : 0
        const medal = `#${rank}`

        return (
          <div key={idx} className={`stack-card ${rank <= 3 ? 'top-rank' : ''}`}>
            <div className="stack-card-header">
              <span className="stack-rank">{medal}</span>
              <div className="stack-name">
                <span className="stack-chip data">{r.dataPlatformLabel}</span>
                <span className="stack-separator">+</span>
                <span className="stack-chip cicd">{r.cicdToolLabel}</span>
                <span className="stack-separator">+</span>
                <span className="stack-chip orch">{r.orchestrationToolLabel}</span>
              </div>
              <span className="stack-score">{r.avgScore}<small>/10</small></span>
            </div>

            <div className="stack-bar-container">
              <div className="stack-bar" style={{ width: `${barWidth}%` }} />
            </div>

            <div className="stack-breakdown">
              {selectedProblems.map((pId) => (
                <div key={pId} className="breakdown-item">
                  <span className="breakdown-label">{problemLabels[pId]?.split('(')[0]?.trim() || pId}</span>
                  <span className="breakdown-score">{r.breakdown[pId] ?? 0}/10</span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
