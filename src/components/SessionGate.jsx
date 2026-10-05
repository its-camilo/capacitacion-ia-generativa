import { useState } from 'react'

const SESSION_PIN = '839174620581493726405817'

function SessionGate({ children }) {
  const [pin, setPin] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState('')

  if (unlocked) return children

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
        <input type="password" inputMode="numeric" autoComplete="off" autoFocus value={pin} onChange={(event) => setPin(event.target.value)} placeholder="PIN" aria-label="PIN de acceso" style={{ width: '100%', boxSizing: 'border-box', marginBottom: '1rem' }} />
        <button type="submit">Acceder</button>
        {error && <p role="alert">{error}</p>}
      </form>
    </div>
  )
}

export default SessionGate
