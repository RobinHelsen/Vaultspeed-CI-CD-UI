import { useState, useRef, useEffect } from 'react'

export default function MultiSelectDropdown({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggle(id) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  const summary =
    selected.length === 0
      ? 'Select problems…'
      : selected.length === 1
        ? options.find((o) => o.id === selected[0])?.label
        : `${selected.length} problems selected`

  return (
    <div className="dropdown multi-dropdown" ref={ref}>
      <label className="dropdown-label">{label}</label>
      <button
        className="dropdown-button"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span>{summary}</span>
        <span className="dropdown-arrow">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <ul className="dropdown-menu checkbox-menu">
          {options.map((opt) => (
            <li key={opt.id} className="dropdown-item checkbox-item" onClick={() => toggle(opt.id)}>
              <input
                type="checkbox"
                checked={selected.includes(opt.id)}
                onChange={() => toggle(opt.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <span>{opt.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
