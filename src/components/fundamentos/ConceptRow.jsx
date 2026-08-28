import ConceptCard from './ConceptCard'

function ConceptRow({ term, definition, diagram }) {
  return (
    <div className="concept-row">
      <ConceptCard term={term} definition={definition} />
      <div className="concept-row__diagram">{diagram}</div>
    </div>
  )
}

export default ConceptRow
