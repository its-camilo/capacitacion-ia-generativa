import { officialSkillRepos } from '../../../data/fundamentosContent'
import SectionBlock from '../SectionBlock'
import SkillRepoCard from '../SkillRepoCard'

function Skills() {
  return (
    <SectionBlock
      id="skills"
      eyebrow="Extensibilidad"
      title="Skills"
    >
      <p>
        Las skills empaquetan instrucciones, scripts y recursos para que un agente
        repita flujos de trabajo de forma confiable. Anthropic y OpenAI publican
        repositorios oficiales con ejemplos y catálogos que puedes instalar o usar
        como referencia.
      </p>
      <div className="skill-repos">
        {officialSkillRepos.map((repo) => (
          <SkillRepoCard key={repo.id} {...repo} />
        ))}
      </div>
    </SectionBlock>
  )
}

export default Skills
