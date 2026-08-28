function DiagramCard({ caption, children, delay = 0 }) {
  return (
    <figure
      className="diagram-card diagram-animate"
      style={{ '--anim-delay': `${delay}ms` }}
    >
      <div className="diagram-card__canvas">{children}</div>
      {caption && <figcaption className="diagram-card__caption">{caption}</figcaption>}
    </figure>
  )
}

export default DiagramCard
