function ConceptCard({ term, definition }) {
  return (
    <article className="concept-card">
      <h3 className="concept-card__term">{term}</h3>
      <p className="concept-card__definition">{definition}</p>
    </article>
  )
}

export default ConceptCard
