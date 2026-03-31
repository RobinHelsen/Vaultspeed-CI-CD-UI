import { useState, useRef, useEffect } from 'react'

export default function Dropdown({ label, options, value, onChange, placeholder = 'Select…' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div className="dropdown" ref={ref}>
      <label className="dropdown-label">{label}</label>
      <button
        className="dropdown-button"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span className="dropdown-arrow">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <ul className="dropdown-menu">
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`dropdown-item ${opt.value === value ? 'active' : ''}`}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
