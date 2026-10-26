import { useLocation, useNavigate } from 'react-router-dom'
import { phases, professorPhases } from '../data/navigation'
import '../styles/audience-toggle.css'

function AudienceToggle() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isProfessorRoute = pathname.startsWith('/profesores')
  const currentPath = pathname.replace(/^\/(estudiantes|profesores)/, '')
  const currentPhases = isProfessorRoute ? professorPhases : phases
  const currentPhase = currentPhases.find((phase) => phase.path === currentPath)

  const selectAudience = (audience) => {
    const targetPhases = audience === 'profesores' ? professorPhases : phases
    const targetPhase = targetPhases.find((phase) => phase.key === currentPhase?.key)
    navigate(`/${audience}${targetPhase?.path || '/fundamentos'}`)
  }

  return (
    <div className="audience-toggle" role="group" aria-label="Tipo de capacitación">
      <button
        className={`audience-toggle__option${!isProfessorRoute ? ' audience-toggle__option--active' : ''}`}
        type="button"
        aria-pressed={!isProfessorRoute}
        onClick={() => selectAudience('estudiantes')}
      >
        Estudiantes
      </button>
      <button
        className={`audience-toggle__option${isProfessorRoute ? ' audience-toggle__option--active' : ''}`}
        type="button"
        aria-pressed={isProfessorRoute}
        onClick={() => selectAudience('profesores')}
      >
        Profesores
      </button>
    </div>
  )
}

export default AudienceToggle
