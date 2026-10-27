import { Link } from 'react-router-dom'
import {
  courseSnapshot,
  designChanges,
  entersAndLeaves,
  formatRules,
  pendingConfirmations,
  sessionSummaries,
} from '../data/profesorSessions'
import SectionBlock from '../components/fundamentos/SectionBlock'
import '../styles/fundamentos.css'
import '../styles/practica-mcp.css'
import '../styles/profesor.css'
function Profesores() {
  return (
    <div className="practica-mcp prof-page">
      <div className="practica-mcp__content">
        <header className="fundamentos__hero">
          <p className="fundamentos__hero-session">{courseSnapshot.eyebrow}</p>
          <h1 className="fundamentos__hero-title">{courseSnapshot.title}</h1>
          <p className="fundamentos__hero-lead">{courseSnapshot.lead}</p>
          <div className="prof-facts">
            {courseSnapshot.facts.map(({ value, label }) => (
              <div className="prof-fact" key={label}>
                <span className="prof-fact__value">{value}</span>
                <span className="prof-fact__label">{label}</span>
              </div>
            ))}
          </div>
          <Link className="prof-cta" to="/profesores/fundamentos">Empezar por la sesión 01</Link>
        </header>

        <SectionBlock id="cambios" eyebrow="Después de la revisión" title="Qué cambió frente a la primera propuesta">
          <ul className="prof-changes">
            {designChanges.map(({ title, description }) => (
              <li key={title}>
                <strong>{title}</strong>
                <span>{description}</span>
              </li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock id="sesiones" eyebrow="Las cuatro sesiones" title="Ruta de trabajo">
          <div className="prof-session-grid">
            {sessionSummaries.map((item) => (
              <Link className="prof-session-card" to={`/profesores/${item.slug}`} key={item.slug}>
                <span className="prof-session-card__session">Sesión {item.session}</span>
                <h3 className="prof-session-card__title">{item.title}</h3>
                <p className="prof-session-card__focus">{item.focus}</p>
                <p className="prof-session-card__line">
                  <span className="prof-session-card__label">Entregable</span>
                  {item.deliverable}
                </p>
                <p className="prof-session-card__tools">{item.tools}</p>
                <span className="prof-session-card__link">Ver sesión →</span>
              </Link>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock id="formato" eyebrow="Cómo funciona cada sesión" title="Reglas del formato">
          <ul className="prof-format">
            {formatRules.map(({ label, detail }) => (
              <li key={label}>
                <strong>{label}</strong>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock id="entra-sale" eyebrow="Frente a la versión de estudiantes" title="Qué entra y qué sale">
          <div className="prof-compare">
            <article className="prof-compare__col prof-compare__col--signal">
              <p className="prof-compare__tag">Entra</p>
              <h3 className="prof-compare__title">Nuevo para profesores</h3>
              <ul>
                {entersAndLeaves.entra.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
            <article className="prof-compare__col prof-compare__col--neutral">
              <p className="prof-compare__tag">Sale</p>
              <h3 className="prof-compare__title">Se retira del programa</h3>
              <ul>
                {entersAndLeaves.sale.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          </div>
        </SectionBlock>

        <SectionBlock id="pendientes" eyebrow="Antes de dictar" title="Por confirmar">
          <ul className="prof-pending">
            {pendingConfirmations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="practica-mcp__note">
            Esta página es la propuesta de trabajo: el contenido de cada sesión está pensado para
            probarse y ajustarse después de la primera cohorte. Los tiempos y las herramientas
            cambian con las licencias y con el ritmo del grupo.
          </p>
        </SectionBlock>
      </div>
    </div>
  )
}

export default Profesores
