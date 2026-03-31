export default function ExtraInfoInput({ value, onChange }) {
  return (
    <div className="extra-info-input">
      <label className="dropdown-label">Extra Information</label>
      <textarea
        className="extra-info-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Any additional context, constraints, or requirements you want the guide to address..."
        rows={3}
      />
    </div>
  )
}
