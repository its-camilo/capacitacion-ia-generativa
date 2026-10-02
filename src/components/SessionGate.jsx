import { useState } from 'react'
import { useLocation } from 'react-router-dom'

const SESSION_PIN = '124578'

function SessionGate({ children }) {
  const location = useLocation()
  const [pin, setPin] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState('')

  if (location.pathname === '/fundamentos' || unlocked) return children

  const handleSubmit = (event) => {
    event.preventDefault()
    if (pin === SESSION_PIN) {
      setUnlocked(true)
      setError('')
    } else {
      setError('PIN incorrecto')
      setPin('')
    }
  }

  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <form onSubmit={handleSubmit} style={{ width: 'min(100%, 420px)', padding: '2rem', textAlign: 'center' }}>
        <h2>Sesión protegida</h2>
        <p>Ingresa el PIN para acceder a esta sesión.</p>
        <input type="password" inputMode="numeric" autoFocus value={pin} onChange={(event) => setPin(event.target.value)} placeholder="PIN" aria-label="PIN de acceso" style={{ width: '100%', boxSizing: 'border-box', marginBottom: '1rem' }} />
        <button type="submit">Acceder</button>
        {error && <p role="alert">{error}</p>}
      </form>
    </div>
  )
}

export default SessionGate
