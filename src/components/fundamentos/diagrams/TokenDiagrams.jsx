import ArrowDefs from './ArrowDefs'

export function TokenUnitDiagram() {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 420 120"
      role="img"
      aria-label="Texto dividido en tokens"
    >
      <ArrowDefs id="token-unit-arrow" />
      <rect x="28" y="34" width="88" height="48" rx="8" className="diagram-box" />
      <text x="72" y="63" textAnchor="middle" className="diagram-label diagram-label--title">
        Texto
      </text>
      <line
        x1="116"
        y1="58"
        x2="148"
        y2="58"
        className="diagram-arrow diagram-arrow--animated"
        markerEnd="url(#token-unit-arrow)"
      />
      {['Hola', ',', 'mundo'].map((t, i) => (
        <g key={t}>
          <rect
            x={160 + i * 76}
            y="34"
            width="64"
            height="48"
            rx="8"
            className="diagram-box diagram-box--accent diagram-pulse"
            style={{ '--pulse-delay': `${i * 0.3}s` }}
          />
          <text x={192 + i * 76} y="63" textAnchor="middle" className="diagram-label">
            {t}
          </text>
        </g>
      ))}
    </svg>
  )
}

export function CacheDiagram() {
  return (
    <svg className="diagram-svg" viewBox="0 0 420 150" role="img" aria-label="Caché de prompt">
      <ArrowDefs id="cache-arrow" />
      <rect x="24" y="28" width="160" height="52" rx="8" className="diagram-box diagram-box--accent" />
      <text x="104" y="59" textAnchor="middle" className="diagram-label diagram-label--title">
        Instrucciones fijas
      </text>
      <line
        x1="184"
        y1="54"
        x2="228"
        y2="54"
        className="diagram-arrow"
        markerEnd="url(#cache-arrow)"
      />
      <rect x="236" y="28" width="160" height="52" rx="8" className="diagram-box" />
      <text x="316" y="59" textAnchor="middle" className="diagram-label diagram-label--title">
        Pregunta nueva
      </text>
      <text x="210" y="118" textAnchor="middle" className="diagram-label diagram-label--accent">
        Se procesa 1 vez → más barato
      </text>
    </svg>
  )
}

export function ContextWindowDiagram() {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 420 130"
      role="img"
      aria-label="Ventana de contexto llena"
    >
      <rect x="36" y="28" width="348" height="36" rx="6" className="diagram-box" />
      <rect
        x="42"
        y="34"
        width="250"
        height="24"
        rx="3"
        fill="rgba(0,229,204,0.4)"
        className="context-fill context-fill--ok"
      />
      <rect
        x="294"
        y="34"
        width="84"
        height="24"
        rx="3"
        fill="rgba(245,166,35,0.5)"
        className="context-fill context-fill--warn"
      />
      <text x="210" y="98" textAnchor="middle" className="diagram-label">
        Llena → pierde detalle o se degrada
      </text>
    </svg>
  )
}

export function SeparateChatsDiagram() {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 420 130"
      role="img"
      aria-label="Chats separados por tarea"
    >
      {['SQL', 'CV', 'Informe'].map((label, i) => (
        <g key={label}>
          <rect
            x={40 + i * 124}
            y="24"
            width="100"
            height="52"
            rx="8"
            className="diagram-box diagram-box--accent diagram-pulse"
            style={{ '--pulse-delay': `${i * 0.5}s` }}
          />
          <text x={90 + i * 124} y="55" textAnchor="middle" className="diagram-label diagram-label--title">
            Chat {label}
          </text>
        </g>
      ))}
      <text x="210" y="108" textAnchor="middle" className="diagram-label diagram-label--accent">
        Un chat por tema
      </text>
    </svg>
  )
}
