import { useState } from 'react'
import { NavLink } from 'react-router-dom'

function PhaseBar({ basePath, phases }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="phase-bar" aria-label="Módulos del curso">
      <button
        className="phase-bar__menu"
        type="button"
        aria-expanded={isOpen}
        aria-controls="phase-bar-track"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="phase-bar__menu-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        Sesiones del curso
      </button>
      <div
        className={`phase-bar__track${isOpen ? ' phase-bar__track--open' : ''}`}
        id="phase-bar-track"
      >
        <div className="phase-bar__flow" aria-hidden="true" />
        {phases.map((phase, index) => (
          <NavLink
            key={phase.path}
            to={`${basePath}${phase.path}`}
            className={({ isActive }) =>
              `phase-bar__segment${isActive ? ' phase-bar__segment--active' : ''}`
            }
            onClick={() => setIsOpen(false)}
          >
            <span className="phase-bar__session">Sesión {phase.session}</span>
            <span className="phase-bar__label">{phase.label}</span>
            <span className="phase-bar__tag">{phase.tag}</span>
            {index < phases.length - 1 && (
              <span className="phase-bar__connector" aria-hidden="true" />
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default PhaseBar
