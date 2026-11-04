import AudienceToggle from './AudienceToggle'

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__brand">
        <span className="site-header__eyebrow">2026-2S · UIFCE · UNAL</span>
        <h1 className="site-header__title">Capacitación IA Generativa</h1>
      </div>
      <AudienceToggle />
    </header>
  )
}

export default Header
