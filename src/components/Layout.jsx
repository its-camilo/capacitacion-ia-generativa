import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import PhaseBar from './PhaseBar'
import { phases, professorPhases } from '../data/navigation'
import escudoUnal from '../assets/escudoUnal.svg'

function Layout() {
  const { pathname } = useLocation()
  const isProfessorRoute = pathname.startsWith('/profesores')

  return (
    <div className="app-shell">
      <div className="app-shell__grid" aria-hidden="true" />
      <Header />
      <PhaseBar
        basePath={isProfessorRoute ? '/profesores' : '/estudiantes'}
        phases={isProfessorRoute ? professorPhases : phases}
      />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="site-footer__institution">
          <span>Facultad de Ciencias Económicas</span>
          <span>Unidad de Informática</span>
          <span>Sede Bogotá</span>
        </div>
        <div className="site-footer__wordmark">
          <img
            className="site-footer__escudo"
            src={escudoUnal}
            alt="Universidad Nacional de Colombia"
          />
        </div>
      </footer>
    </div>
  )
}

export default Layout
