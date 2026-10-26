import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import PhaseBar from './PhaseBar'
import ThemeToggle from './ThemeToggle'
import { phases, professorPhases } from '../data/navigation'

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
      <ThemeToggle />
    </div>
  )
}

export default Layout
