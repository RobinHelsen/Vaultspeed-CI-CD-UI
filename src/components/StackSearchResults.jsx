import { enterpriseConstraints, deliveryComplications, largeScaleIssues } from '../data/config'

export default function StackSearchResults({ results, selectedProblems, emptyMessage }) {
  if (results.length === 0) {
    const defaultMessage = 'No ranked stacks match the current filters. Try relaxing your enforced stack parts.'

    return (
      <div className="result-panel empty">
        <p>{emptyMessage || defaultMessage}</p>
      </div>
    )
  }

  const maxScore = results[0].totalScore
  const allOptions = [...largeScaleIssues, ...enterpriseConstraints, ...deliveryComplications]
  const problemLabels = {}
  for (const p of allOptions) {
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
