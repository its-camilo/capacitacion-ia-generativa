import ArrowDefs from './ArrowDefs'

export function AgenteDiagram() {
  return (
    <svg className="diagram-svg" viewBox="0 0 280 150" role="img" aria-label="Ciclo de un agente">
      <ArrowDefs id="agente-arrow" />
      <text x="140" y="22" textAnchor="middle" className="diagram-label diagram-label--accent">
        Bucle del agente
      </text>
      {[
        { x: 12, label: 'Planear' },
        { x: 104, label: 'Actuar' },
        { x: 196, label: 'Observar' },
      ].map((node, i) => (
        <g key={node.label}>
          <rect
            x={node.x}
            y="40"
            width="72"
            height="44"
            rx="8"
            className="diagram-box diagram-box--accent"
          />
          <text
            x={node.x + 36}
            y="67"
            textAnchor="middle"
            className="diagram-label diagram-label--title"
          >
            {node.label}
          </text>
          {i < 2 && (
            <line
              x1={node.x + 72}
              y1="62"
              x2={node.x + 92}
              y2="62"
              className="diagram-arrow diagram-arrow--animated"
              markerEnd="url(#agente-arrow)"
            />
          )}
        </g>
      ))}
      <path
        d="M 232 84 Q 140 128 48 84"
        className="diagram-arrow diagram-arrow--animated"
        markerEnd="url(#agente-arrow)"
      />
    </svg>
  )
}

export function ApiKeyDiagram() {
  return (
    <svg className="diagram-svg" viewBox="0 0 280 150" role="img" aria-label="Plan vs prepago">
      <text x="70" y="22" textAnchor="middle" className="diagram-label diagram-label--title">
        Plan
      </text>
      <rect x="16" y="32" width="108" height="56" rx="8" className="diagram-box diagram-box--accent" />
      <rect x="28" y="48" width="84" height="10" rx="2" fill="rgba(0,229,204,0.45)" />
      <text x="70" y="76" textAnchor="middle" className="diagram-label">
        Predecible
      </text>

      <text x="210" y="22" textAnchor="middle" className="diagram-label diagram-label--title">
        Prepago
      </text>
      <rect x="156" y="32" width="108" height="56" rx="8" className="diagram-box" />
      <rect x="168" y="48" width="36" height="10" rx="2" fill="rgba(245,166,35,0.5)" />
      <rect x="208" y="48" width="22" height="10" rx="2" fill="rgba(245,166,35,0.3)" />
      <text x="210" y="76" textAnchor="middle" className="diagram-label">
        Se agota
      </text>

      <text x="140" y="124" textAnchor="middle" className="diagram-label diagram-label--accent">
        En IA: tokens, no minutos
      </text>
    </svg>
  )
}

export function ProveedorDiagram() {
  return (
    <svg className="diagram-svg" viewBox="0 0 280 140" role="img" aria-label="Proveedor de IA">
      <ArrowDefs id="prov-arrow" />
      <text x="36" y="42" className="diagram-label">
        Tú
      </text>
      <line
        x1="56"
        y1="38"
        x2="88"
        y2="38"
        className="diagram-arrow"
        markerEnd="url(#prov-arrow)"
      />
      <rect x="96" y="16" width="120" height="44" rx="8" className="diagram-box diagram-box--accent" />
      <text x="156" y="43" textAnchor="middle" className="diagram-label diagram-label--title">
        Proveedor
      </text>
      <line
        x1="156"
        y1="60"
        x2="156"
        y2="80"
        className="diagram-arrow"
        markerEnd="url(#prov-arrow)"
      />
      <rect x="70" y="86" width="172" height="40" rx="8" className="diagram-box" />
      <text x="156" y="111" textAnchor="middle" className="diagram-label">
        Modelo vía API
      </text>
    </svg>
  )
}

export function OpenSourceDiagram() {
  return (
    <svg className="diagram-svg" viewBox="0 0 280 140" role="img" aria-label="Modelo open source">
      <ArrowDefs id="oss-arrow" />
      <rect x="16" y="24" width="112" height="48" rx="8" className="diagram-box diagram-box--accent" />
      <text x="72" y="53" textAnchor="middle" className="diagram-label diagram-label--title">
        Modelo público
      </text>
      <line
        x1="128"
        y1="48"
        x2="152"
        y2="48"
        className="diagram-arrow"
        markerEnd="url(#oss-arrow)"
      />
      <rect x="160" y="24" width="104" height="48" rx="8" className="diagram-box" />
      <text x="212" y="53" textAnchor="middle" className="diagram-label">
        Tu servidor
      </text>
      <text x="140" y="112" textAnchor="middle" className="diagram-label diagram-label--accent">
        Libre el modelo, no el cómputo
      </text>
    </svg>
  )
}

export function HarnessDiagram() {
  return (
    <svg className="diagram-svg" viewBox="0 0 280 150" role="img" aria-label="Harness envolviendo al modelo">
      <rect x="24" y="16" width="232" height="118" rx="12" className="diagram-box" />
      <text x="140" y="40" textAnchor="middle" className="diagram-label diagram-label--accent">
        Harness
      </text>
      <rect x="68" y="52" width="144" height="44" rx="8" className="diagram-box diagram-box--accent" />
      <text x="140" y="79" textAnchor="middle" className="diagram-label diagram-label--title">
        Modelo
      </text>
      <text x="72" y="118" className="diagram-label">
        Herramientas
      </text>
      <text x="176" y="118" className="diagram-label">
        Reglas
      </text>
    </svg>
  )
}

const conceptDiagrams = {
  agente: AgenteDiagram,
  'api-key': ApiKeyDiagram,
  proveedor: ProveedorDiagram,
  'open-source': OpenSourceDiagram,
  harness: HarnessDiagram,
}

export function ConceptDiagram({ id }) {
  const Diagram = conceptDiagrams[id]
  return Diagram ? <Diagram /> : null
}
