import { Outlet } from 'react-router-dom'
import Header from './Header'
import PhaseBar from './PhaseBar'

function Layout() {
  return (
    <div className="app-shell">
      <div className="app-shell__grid" aria-hidden="true" />
      <Header />
      <PhaseBar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
