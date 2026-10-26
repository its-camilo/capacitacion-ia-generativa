import { useLocation, useNavigate } from 'react-router-dom'
import '../styles/audience-toggle.css'

function AudienceToggle() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isProfessorRoute = pathname.startsWith('/profesores')
  const sessionPath = pathname.replace(/^\/(estudiantes|profesores)/, '')
  const destination = sessionPath || '/fundamentos'

  const selectAudience = (audience) => {
    navigate(`/${audience}${destination}`)
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
