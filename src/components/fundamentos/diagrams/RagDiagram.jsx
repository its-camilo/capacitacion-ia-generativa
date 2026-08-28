import ArrowDefs from './ArrowDefs'

function RagDiagram() {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 520 250"
      role="img"
      aria-label="Flujo de Retrieval Augmented Generation"
    >
      <ArrowDefs id="rag-arrow" />

      <rect x="24" y="24" width="120" height="52" rx="8" className="diagram-box" />
      <text x="84" y="55" textAnchor="middle" className="diagram-label diagram-label--title">
        Muchos PDFs
      </text>
      <line x1="144" y1="50" x2="172" y2="50" className="diagram-arrow" markerEnd="url(#rag-arrow)" />
      <rect x="180" y="24" width="128" height="52" rx="8" className="diagram-box" />
      <text x="244" y="46" textAnchor="middle" className="diagram-label">
        Fragmentación
      </text>
      <text x="244" y="62" textAnchor="middle" className="diagram-label">
        + embeddings
      </text>
      <line x1="308" y1="50" x2="336" y2="50" className="diagram-arrow" markerEnd="url(#rag-arrow)" />
      <rect x="344" y="24" width="112" height="52" rx="8" className="diagram-box diagram-box--accent" />
      <text x="400" y="55" textAnchor="middle" className="diagram-label diagram-label--title">
        Base vectorial
      </text>

      <rect x="24" y="128" width="112" height="52" rx="8" className="diagram-box" />
      <text x="80" y="159" textAnchor="middle" className="diagram-label diagram-label--title">
        Tu consulta
      </text>
      <line x1="136" y1="154" x2="164" y2="154" className="diagram-arrow" markerEnd="url(#rag-arrow)" />
      <rect x="172" y="128" width="128" height="52" rx="8" className="diagram-box diagram-box--accent" />
      <text x="236" y="150" textAnchor="middle" className="diagram-label">
        Recupera trozos
      </text>
      <text x="236" y="166" textAnchor="middle" className="diagram-label">
        relevantes
      </text>
      <line x1="300" y1="154" x2="328" y2="154" className="diagram-arrow" markerEnd="url(#rag-arrow)" />
      <rect x="336" y="128" width="56" height="52" rx="8" className="diagram-box" />
      <text x="364" y="159" textAnchor="middle" className="diagram-label diagram-label--title">
        LLM
      </text>
      <line x1="392" y1="154" x2="412" y2="154" className="diagram-arrow" markerEnd="url(#rag-arrow)" />
      <rect x="420" y="128" width="80" height="52" rx="8" className="diagram-box diagram-box--accent" />
      <text x="460" y="159" textAnchor="middle" className="diagram-label diagram-label--title">
        Respuesta
      </text>

      <text x="260" y="222" textAnchor="middle" className="diagram-label diagram-label--accent">
        Solo entra al contexto lo relevante
      </text>
    </svg>
  )
}

export default RagDiagram
