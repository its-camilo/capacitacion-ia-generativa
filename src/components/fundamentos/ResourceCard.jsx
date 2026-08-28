function resolveAssetPath(path) {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

function ResourceCard({ title, subtitle, description, url, qrSrc }) {
  const qrUrl = resolveAssetPath(qrSrc)

  return (
    <aside className="resource-card">
      <div className="resource-card__qr">
        {qrUrl ? (
          <img src={qrUrl} alt={`Código QR: ${title}`} />
        ) : (
          <span>QR</span>
        )}
      </div>
      <div>
        <h3 className="resource-card__title">{title}</h3>
        <p className="resource-card__subtitle">{subtitle}</p>
        <p className="resource-card__description">{description}</p>
        {url ? (
          <a
            className="resource-card__link"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            {url}
          </a>
        ) : (
          <span className="resource-card__link resource-card__link--empty">
            Enlace pendiente
          </span>
        )}
      </div>
    </aside>
  )
}

export default ResourceCard
