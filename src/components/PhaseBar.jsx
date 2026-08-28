import { NavLink } from 'react-router-dom'
import { phases } from '../data/navigation'

function PhaseBar() {
  return (
    <nav className="phase-bar" aria-label="Módulos del curso">
      <div className="phase-bar__track">
        <div className="phase-bar__flow" aria-hidden="true" />
        {phases.map((phase, index) => (
          <NavLink
            key={phase.path}
            to={phase.path}
            className={({ isActive }) =>
              `phase-bar__segment${isActive ? ' phase-bar__segment--active' : ''}`
            }
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
