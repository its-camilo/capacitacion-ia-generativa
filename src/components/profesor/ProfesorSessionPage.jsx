import { Link } from 'react-router-dom'
import { profesorSessions } from '../../data/profesorSessions'
import SectionBlock from '../fundamentos/SectionBlock'
import ProfesorBlocks from './ProfesorBlocks'
import '../../styles/fundamentos.css'
import '../../styles/practica-mcp.css'
import '../../styles/profesor.css'

function ProfesorSessionPage({ sessionId }) {
  const session = profesorSessions[sessionId]

  if (!session) return null

  return (
    <div className="practica-mcp prof-page">
      <div className="practica-mcp__content">
        <header className="fundamentos__hero">
          <p className="fundamentos__hero-session">Sesión {session.session} · Profesores</p>
          <h1 className="fundamentos__hero-title">{session.title}</h1>
          <p className="fundamentos__hero-lead">{session.lead}</p>
          <dl className="prof-meta">
            {session.meta.map(({ label, value }) => (
              <div className="prof-meta__item" key={label}>
                <dt className="prof-meta__label">{label}</dt>
                <dd className="prof-meta__value">{value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <div className="prof-intro">
          <section className="prof-panel" aria-labelledby="prof-agenda-title">
            <p className="prof-panel__eyebrow">En dos horas</p>
            <h2 className="prof-panel__title" id="prof-agenda-title">Cómo se reparte el tiempo</h2>
            <ol className="prof-agenda">
              {session.agenda.map(({ time, label, detail }) => (
                <li className="prof-agenda__row" key={`${time}-${label}`}>
                  <span className="prof-agenda__time">{time}</span>
                  <span className="prof-agenda__body">
                    <strong>{label}</strong>
                    <span>{detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="prof-panel" aria-labelledby="prof-goals-title">
            <p className="prof-panel__eyebrow">Al terminar</p>
            <h2 className="prof-panel__title" id="prof-goals-title">Qué va a poder hacer</h2>
            <ul className="prof-goals">
              {session.goals.map((goal) => (
                <li key={goal}>{goal}</li>
              ))}
            </ul>
          </section>
        </div>

        <nav className="practica-mcp__steps-nav" aria-label={`Contenido de la sesión ${session.session}`}>
          <ol className="practica-mcp__steps-list">
            {session.sections.map(({ id, eyebrow }, index) => (
              <li key={id}>
                <a className="practica-mcp__steps-link" href={`#${id}`}>
                  <span className="practica-mcp__steps-num">{index + 1}</span>
                  {eyebrow}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {session.sections.map(({ id, eyebrow, title, blocks }) => (
          <SectionBlock id={id} eyebrow={eyebrow} title={title} key={id}>
            <ProfesorBlocks blocks={blocks} />
          </SectionBlock>
        ))}

        <nav className="prof-next" aria-label="Siguiente sesión">
          {session.next.slug ? (
            <Link className="prof-next__link" to={`/profesores/${session.next.slug}`}>
              {session.next.label}
            </Link>
          ) : (
            <Link className="prof-next__link" to="/profesores">
              {session.next.label}
            </Link>
          )}
        </nav>
      </div>
    </div>
  )
}

export default ProfesorSessionPage
