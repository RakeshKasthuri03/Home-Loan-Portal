import { useState, useRef, useEffect } from "react";
import "./CustomSelect.css";

/**
 * Reusable custom select dropdown.
 * Props:
 *   value        – current value
 *   onChange     – called with the new value string
 *   options      – [{ value, label }]
 *   className    – optional extra class on the wrapper
 *   placeholder  – shown when no value selected
 */
export default function CustomSelect({ value, onChange, options = [], className = "", placeholder = "Select..." }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div className={`csel-wrap ${className}`} ref={ref}>
      <button
        type="button"
        className={`csel-trigger ${open ? "csel-trigger--open" : ""}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="csel-label">{selected ? selected.label : placeholder}</span>
        <span className="csel-arrow">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <ul className="csel-list" role="listbox">
          {options.map(opt => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`csel-option ${opt.value === value ? "csel-option--active" : ""}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
