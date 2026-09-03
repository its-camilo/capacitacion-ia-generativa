import { useEffect, useState } from 'react'

function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <button
      className="theme-toggle"
      onClick={() => setIsDark(d => !d)}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      <span className="theme-toggle__icon">{isDark ? '☀' : '◑'}</span>
      <span className="theme-toggle__label">{isDark ? 'LIGHT' : 'DARK'}</span>
    </button>
  )
}

export default ThemeToggle
