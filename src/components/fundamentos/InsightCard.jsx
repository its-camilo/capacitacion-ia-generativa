function InsightCard({ eyebrow, title, description, steps }) {
  return (
    <aside className="insight-card">
      {eyebrow ? <p className="insight-card__eyebrow">{eyebrow}</p> : null}
      <h3 className="insight-card__title">{title}</h3>
      {description ? <p className="insight-card__description">{description}</p> : null}
      {steps?.length ? (
        <ol className="insight-card__steps">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}
    </aside>
  )
}

export default InsightCard
