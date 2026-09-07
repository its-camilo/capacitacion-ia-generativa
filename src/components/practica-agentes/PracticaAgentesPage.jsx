import {
  alternatives,
  canvaConnectorNote,
  data360McpFields,
  data360Repo,
  deliverables,
  manusApps,
  openrouterConnectorNote,
  prerequisites,
  sectionNav,
  taskPromptExample,
} from '../../data/practicaAgentesContent'
import SectionBlock from '../fundamentos/SectionBlock'
import '../../styles/fundamentos.css'
import '../../styles/practica-mcp.css'

function PracticaAgentesPage() {
  return (
    <div className="practica-mcp">
      <div className="practica-mcp__content">
        <header className="fundamentos__hero">
          <p className="fundamentos__hero-session">Sesión 04</p>
          <h1 className="fundamentos__hero-title">Práctica Agentes</h1>
          <p className="fundamentos__hero-lead">
            Usa Manus AI, conecta Canva y Data 360 (Banco Mundial) vía MCP, y convierte datos
            abiertos en una presentación real de 10 diapositivas exportada en PDF.
          </p>
        </header>

        <nav className="practica-mcp__steps-nav" aria-label="Pasos de la práctica">
          <ol className="practica-mcp__steps-list">
            {sectionNav.map(({ id, label }, index) => (
              <li key={id}>
                <a className="practica-mcp__steps-link" href={`#${id}`}>
                  <span className="practica-mcp__steps-num">{index + 1}</span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <SectionBlock id="paso-1" eyebrow="Paso 1" title="Prerrequisitos">
          <p>
            Todo lo que usaremos hoy tiene una capa gratuita. Antes de empezar, ten a la mano:
          </p>
          <ul className="practica-mcp__bullet-list">
            {prerequisites.map(({ id, label, description, url }) => (
              <li key={id}>
                <strong>
                  <a href={url} target="_blank" rel="noreferrer">
                    {label}
                  </a>
                </strong>
                {' — '}
                {description}
              </li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock id="paso-2" eyebrow="Paso 2" title="Instalar Manus AI">
          <p>
            <strong>Manus AI</strong> es una app de agentes con una capa gratuita generosa,
            disponible tanto en versión móvil como de escritorio/web.
          </p>
          <ol className="practica-mcp__numbered">
            <li>
              Instala Manus desde{' '}
              <a href={manusApps.web} target="_blank" rel="noreferrer">
                manus.im
              </a>{' '}
              (web/PC) o desde{' '}
              <a href={manusApps.ios} target="_blank" rel="noreferrer">
                App Store
              </a>{' '}
              /{' '}
              <a href={manusApps.android} target="_blank" rel="noreferrer">
                Google Play
              </a>{' '}
              (móvil).
            </li>
            <li>Inicia sesión o crea una cuenta nueva.</li>
            <li>
              Verifica que tienes tus 1000 créditos de bienvenida y la cuota diaria de 300
              créditos activa.
            </li>
          </ol>
        </SectionBlock>

        <SectionBlock id="paso-3" eyebrow="Paso 3" title="Conectar el MCP de Canva">
          <p>{canvaConnectorNote}</p>
          <ol className="practica-mcp__numbered">
            <li>
              En Manus ve a <strong>Conectores</strong> (Connectors).
            </li>
            <li>
              Busca <code>Canva</code> en la lista de conectores predeterminados e instálalo.
            </li>
            <li>Autoriza con tu cuenta de Canva (OAuth) cuando te lo pida.</li>
          </ol>
        </SectionBlock>

        <SectionBlock id="paso-4" eyebrow="Paso 4" title="Conectar el MCP de Data 360">
          <p>
            <a href={data360Repo.url} target="_blank" rel="noreferrer">
              {data360Repo.label}
            </a>{' '}
            {data360Repo.description}
          </p>
          <p>
            Este MCP no está en la lista predeterminada de Manus, así que se agrega como{' '}
            <strong>MCP personalizado</strong> (opción de agregar mediante chat):
          </p>
          <ul className="practica-mcp__bullet-list">
            <li>
              <strong>Nombre:</strong> {data360McpFields.name}
            </li>
            <li>
              <strong>Endpoint:</strong> <code>{data360McpFields.endpoint}</code>
            </li>
            <li>
              <strong>Autenticación:</strong> {data360McpFields.auth}
            </li>
          </ul>
        </SectionBlock>

        <SectionBlock id="paso-5" eyebrow="Paso 5" title="Agregar la API key de OpenRouter">
          <p>{openrouterConnectorNote}</p>
        </SectionBlock>

        <SectionBlock id="paso-6" eyebrow="Paso 6" title="Pedirle a Manus el entregable">
          <p>
            Con los tres conectores listos (Canva, Data360 MCP y OpenRouter), dale a Manus una
            instrucción como:
          </p>
          <p className="practica-mcp__query-prompt">{taskPromptExample}</p>
          <p>
            Manus debería encadenar las tools de <code>Data360 MCP</code> para traer datos
            reales, usar OpenRouter como modelo cuando sea posible, y las de{' '}
            <code>Canva</code> para producir la presentación y exportarla en PDF.
          </p>
        </SectionBlock>

        <SectionBlock id="entregables" eyebrow="Actividad" title="Entregables">
          <p>Cada equipo entrega:</p>
          <ul className="practica-mcp__bullet-list">
            {deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock id="alternativas" eyebrow="Extra" title="Otras alternativas">
          <p>
            Además de usar Manus como asistente puntual, vale la pena conocer otras rutas para
            automatizar este tipo de flujos:
          </p>
          <div className="practica-mcp__grading">
            <ul className="practica-mcp__grading-list">
              {alternatives.map(({ title, description }) => (
                <li key={title}>
                  <strong>{title}</strong>
                  <span>{description}</span>
                </li>
              ))}
            </ul>
          </div>
        </SectionBlock>
      </div>
    </div>
  )
}

export default PracticaAgentesPage
