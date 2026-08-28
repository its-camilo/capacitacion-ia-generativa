function ToolCallingCard({ title, description, links }) {
  return (
    <aside className="tool-calling-card">
      <h3 className="tool-calling-card__title">{title}</h3>
      <p className="tool-calling-card__description">{description}</p>
      <ul className="tool-calling-card__links">
        {links.map(({ id, provider, label, url }) => (
          <li key={id}>
            <a href={url} target="_blank" rel="noreferrer">
              <span className="tool-calling-card__provider">{provider}</span>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default ToolCallingCard
