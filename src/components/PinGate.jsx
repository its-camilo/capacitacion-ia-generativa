import { useEffect, useState } from 'react'

const PIN_HASH = 'c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646'
const STORAGE_KEY = 'capacitacion-pin-ok'

async function sha256(text) {
  const data = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export default function PinGate({ children }) {
  const [ok, setOk] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === PIN_HASH } catch { return false }
  })
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { window.scrollTo(0, 0) }, [ok])

  if (ok) return children

  const onSubmit = async (e) => {
    e.preventDefault()
    const h = await sha256(pin.trim())
    if (h === PIN_HASH) {
      try { localStorage.setItem(STORAGE_KEY, h) } catch { /* sin almacenamiento */ }
      setOk(true)
    } else {
      setError('PIN incorrecto. Intente de nuevo.')
      setPin('')
    }
  }

  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '2rem 1rem' }}>
      <form
        onSubmit={onSubmit}
        style={{ width: '100%', maxWidth: 360, display: 'grid', gap: '0.9rem', padding: '2rem', borderRadius: 16, border: '1px solid rgba(127,127,127,0.3)', textAlign: 'center' }}
      >
        <div style={{ fontSize: '2rem' }} aria-hidden="true">🔒</div>
        <h1 style={{ margin: 0, fontSize: '1.96rem' }}>Contenido protegido</h1>
        <p style={{ margin: 0, opacity: 0.8, fontSize: '2rem' }}>Ingrese el PIN que le dieron en la capacitación.</p>
        <input
          type="password"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          value={pin}
          onChange={(e) => { setPin(e.target.value); setError('') }}
          placeholder="PIN"
          aria-label="PIN"
          style={{ padding: '0.75rem 1rem', fontSize: '2.2rem', borderRadius: 10, border: '1px solid rgba(127,127,127,0.5)', textAlign: 'center', letterSpacing: '0.2em', background: 'transparent', color: 'inherit' }}
        />
        {error && <p role="alert" style={{ margin: 0, color: '#d33', fontSize: '2rem' }}>{error}</p>}
        <button type="submit" style={{ padding: '0.75rem 1rem', fontSize: '2rem', borderRadius: 10, border: 'none', cursor: 'pointer', background: '#2563eb', color: '#fff', fontWeight: 600 }}>
          Entrar
        </button>
      </form>
    </div>
  )
}
