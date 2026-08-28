function ConceptCard({ term, definition, link }) {
  return (
    <article className="concept-card">
      <h3 className="concept-card__term">{term}</h3>
      <p className="concept-card__definition">{definition}</p>
      {link ? (
        <a className="concept-card__link" href={link.url} target="_blank" rel="noreferrer">
          {link.label} →
        </a>
      ) : null}
    </article>
  )
}

export default ConceptCard
