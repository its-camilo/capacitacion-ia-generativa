import ArrowDefs from './ArrowDefs'

export function GpuParallelDiagram() {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 420 170"
      role="img"
      aria-label="Paralelismo en GPUs"
    >
      <ArrowDefs id="gpu-arrow" />
      <rect x="150" y="16" width="120" height="44" rx="8" className="diagram-box diagram-box--accent" />
      <text x="210" y="43" textAnchor="middle" className="diagram-label diagram-label--title">
        Transformer
      </text>
      {[0, 1, 2].map((i) => {
        const x = 36 + i * 128
        return (
          <g key={i}>
            <line
              x1="210"
              y1="60"
              x2={x + 50}
              y2="88"
              className="diagram-arrow diagram-arrow--animated"
              markerEnd="url(#gpu-arrow)"
            />
            <rect
              x={x}
              y="96"
              width="100"
              height="40"
              rx="8"
              className="diagram-box diagram-pulse"
              style={{ '--pulse-delay': `${i * 0.35}s` }}
            />
            <text x={x + 50} y="121" textAnchor="middle" className="diagram-label">
              GPU {i + 1}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function TranslationDiagram() {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 420 150"
      role="img"
      aria-label="Traducción inglés alemán"
    >
      <ArrowDefs id="trans-arrow" />
      <text x="210" y="28" textAnchor="middle" className="diagram-label diagram-label--accent">
        Primer uso del paper
      </text>
      <rect x="48" y="52" width="130" height="52" rx="8" className="diagram-box" />
      <text x="113" y="83" textAnchor="middle" className="diagram-label diagram-label--title">
        English
      </text>
      <line
        x1="178"
        y1="78"
        x2="228"
        y2="78"
        className="diagram-arrow diagram-arrow--animated"
        markerEnd="url(#trans-arrow)"
      />
      <rect x="240" y="52" width="130" height="52" rx="8" className="diagram-box diagram-box--accent" />
      <text x="305" y="83" textAnchor="middle" className="diagram-label diagram-label--title">
        Deutsch
      </text>
    </svg>
  )
}

export function GenerationEvolutionDiagram() {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 420 120"
      role="img"
      aria-label="De traducir a generar"
    >
      <ArrowDefs id="evo-arrow" />
      {[
        { x: 24, label: 'Traducir', accent: false },
        { x: 156, label: 'Completar', accent: false },
        { x: 288, label: 'Crear', accent: true },
      ].map((node, i) => (
        <g key={node.label}>
          <rect
            x={node.x}
            y="34"
            width="108"
            height="48"
            rx="8"
            className={`diagram-box${node.accent ? ' diagram-box--accent' : ''}`}
          />
          <text
            x={node.x + 54}
            y="63"
            textAnchor="middle"
            className="diagram-label diagram-label--title"
          >
            {node.label}
          </text>
          {i < 2 && (
            <line
              x1={node.x + 108}
              y1="58"
              x2={node.x + 132}
              y2="58"
              className="diagram-arrow diagram-arrow--animated"
              markerEnd="url(#evo-arrow)"
            />
          )}
        </g>
      ))}
    </svg>
  )
}

export function MatrixSearchDiagram() {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 420 170"
      role="img"
      aria-label="Matrices como búsqueda"
    >
      <ArrowDefs id="matrix-arrow" />
      <rect x="48" y="24" width="130" height="64" rx="8" className="diagram-box diagram-box--accent" />
      <text x="113" y="50" textAnchor="middle" className="diagram-label diagram-label--title">
        Clave
      </text>
      <text x="113" y="68" textAnchor="middle" className="diagram-label">
        × matrices
      </text>
      <line
        x1="178"
        y1="56"
        x2="226"
        y2="56"
        className="diagram-arrow diagram-arrow--animated"
        markerEnd="url(#matrix-arrow)"
      />
      <rect x="240" y="24" width="130" height="64" rx="8" className="diagram-box" />
      <text x="305" y="60" textAnchor="middle" className="diagram-label diagram-label--title">
        Valor
      </text>
      <text x="210" y="118" textAnchor="middle" className="diagram-label">
        Como buscar en un diccionario
      </text>
      <text x="210" y="144" textAnchor="middle" className="diagram-label diagram-label--accent">
        Traducir = emparejar palabras aprendidas
      </text>
    </svg>
  )
}

export function PromptSpecificityDiagram() {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 420 150"
      role="img"
      aria-label="Prompt específico mejora precisión"
    >
      <rect x="24" y="24" width="168" height="64" rx="8" className="diagram-box" />
      <text x="108" y="50" textAnchor="middle" className="diagram-label diagram-label--title">
        Prompt vago
      </text>
      <text x="108" y="70" textAnchor="middle" className="diagram-label">
        muchas rutas
      </text>
      <rect x="228" y="24" width="168" height="64" rx="8" className="diagram-box diagram-box--accent" />
      <text x="312" y="50" textAnchor="middle" className="diagram-label diagram-label--title">
        Prompt preciso
      </text>
      <text x="312" y="70" textAnchor="middle" className="diagram-label diagram-label--accent">
        una ruta
      </text>
      <text x="210" y="124" textAnchor="middle" className="diagram-label">
        Búsqueda más dirigida = más exactitud
      </text>
    </svg>
  )
}

export function AttentionOverviewDiagram() {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 420 140"
      role="img"
      aria-label="Atención entre tokens"
    >
      {['A', 'B', 'C', 'D'].map((t, i) => (
        <g key={t}>
          <rect
            x={40 + i * 92}
            y="36"
            width="68"
            height="48"
            rx="8"
            className="diagram-box diagram-pulse"
            style={{ '--pulse-delay': `${i * 0.25}s` }}
          />
          <text x={74 + i * 92} y="65" textAnchor="middle" className="diagram-label diagram-label--title">
            {t}
          </text>
        </g>
      ))}
      <path
        d="M 74 36 C 120 8, 210 8, 348 36"
        fill="none"
        stroke="rgba(0,229,204,0.35)"
        strokeWidth="1.5"
      />
      <text x="210" y="118" textAnchor="middle" className="diagram-label diagram-label--accent">
        Cada token mira a los demás a la vez
      </text>
    </svg>
  )
}
