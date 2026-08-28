import ConceptCard from './ConceptCard'

function ConceptRow({ term, definition, link, diagram }) {
  return (
    <div className="concept-row">
      <ConceptCard term={term} definition={definition} link={link} />
      <div className="concept-row__diagram">{diagram}</div>
    </div>
  )
}

export default ConceptRow
