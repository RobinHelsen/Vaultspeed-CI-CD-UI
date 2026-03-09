export default function ModeSelector({ mode, onChange }) {
  return (
    <div className="mode-selector">
      <button
        className={`mode-button ${mode === 'known' ? 'active' : ''}`}
        onClick={() => onChange('known')}
      >
        <span className="mode-icon">•</span>
        <span className="mode-text">
          <strong>I know my stack</strong>
          <small>Pick your tools and get a setup guide</small>
        </span>
      </button>
      <button
        className={`mode-button ${mode === 'search' ? 'active' : ''}`}
        onClick={() => onChange('search')}
      >
        <span className="mode-icon">•</span>
        <span className="mode-text">
          <strong>Find the best stack</strong>
          <small>Describe your problems, get ranked recommendations</small>
        </span>
      </button>
    </div>
  )
}
