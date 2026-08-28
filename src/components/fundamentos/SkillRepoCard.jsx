function SkillRepoCard({ provider, title, description, url }) {
  return (
    <a
      className="skill-repo-card"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      <p className="skill-repo-card__provider">{provider}</p>
      <h3 className="skill-repo-card__title">{title}</h3>
      <p className="skill-repo-card__description">{description}</p>
      <span className="skill-repo-card__link">Ver en GitHub →</span>
    </a>
  )
}

export default SkillRepoCard
