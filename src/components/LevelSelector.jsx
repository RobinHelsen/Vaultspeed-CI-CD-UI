export default function LevelSelector({ levels, value, onChange }) {
  return (
    <div className="level-selector">
      <label className="dropdown-label">Experience Level</label>
      <div className="level-options">
        {levels.map((lvl) => (
          <label key={lvl.value} className={`level-option ${value === lvl.value ? 'active' : ''}`}>
            <input
              type="radio"
              name="experience-level"
              value={lvl.value}
              checked={value === lvl.value}
              onChange={() => onChange(lvl.value)}
            />
            <span>{lvl.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
