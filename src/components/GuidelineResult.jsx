export default function GuidelineResult({ guidelines }) {
  if (guidelines.length === 0) {
    return (
      <div className="result-panel empty">
        <p>Select your stack, problems, and experience level above to generate a CI/CD setup guideline.</p>
      </div>
    )
  }

  return (
    <div className="result-panel">
      {guidelines.map((g, idx) => (
        <div key={idx} className="guideline-card">
          <h3>{g.title}</h3>
          <ol>
            {g.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          {g.notes && (
            <div className="guideline-notes">
              <strong>Notes:</strong> {g.notes}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
