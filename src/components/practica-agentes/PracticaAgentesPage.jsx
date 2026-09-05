import {
  canvaMcpConfig,
  data360McpConfig,
  data360Repo,
  data360RenderSteps,
  deliverables,
  gatewayTokenNote,
  gradingCriteria,
  mobilePromptExample,
  openclawRepo,
  prerequisites,
  renderBlueprintNotes,
  sectionNav,
} from '../../data/practicaAgentesContent'
import SectionBlock from '../fundamentos/SectionBlock'
import CodeBlock from '../practica-mcp/CodeBlock'
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
            Despliega tu propio agente OpenClaw en la nube, conéctalo a Canva y a Data 360
            vía MCP, y úsalo desde tu celular para convertir datos abiertos en un informe
            visual real.
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

        <SectionBlock
          id="paso-2"
          eyebrow="Paso 2"
          title="Desplegar OpenClaw en Render"
        >
          <p>
            <strong>OpenClaw</strong> es un runtime de agentes de código abierto: corre como un
            proceso persistente en la nube (no un chat que se cierra al terminar la pestaña) y
            se conecta a herramientas externas mediante MCP.
          </p>
          <ol className="practica-mcp__numbered">
            <li>
              Haz fork del repositorio{' '}
              <a href={openclawRepo.url} target="_blank" rel="noreferrer">
                {openclawRepo.label}
              </a>{' '}
              a tu propia cuenta de GitHub.
            </li>
            <li>
              En Render, crea un servicio nuevo con <strong>New + → Blueprint</strong> y conecta
              tu fork. Render detectará el archivo <code>render.yaml</code> del repo.
            </li>
            <li>Completa el formulario del Blueprint y despliega.</li>
          </ol>
          <ul className="practica-mcp__bullet-list">
            {renderBlueprintNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock id="paso-3" eyebrow="Paso 3" title="Entrar al dashboard">
          <p>
            Cuando el build termine, tu instancia queda disponible en{' '}
            <code>https://&lt;nombre-de-tu-servicio&gt;.onrender.com/openclaw</code>.
          </p>
          <p>{gatewayTokenNote}</p>
          <p>
            Guarda esa URL: es la misma que usarás luego desde el celular, así que confírmala
            abriéndola primero desde tu computador.
          </p>
        </SectionBlock>

        <SectionBlock id="paso-4" eyebrow="Paso 4" title="Conectar el MCP de Canva">
          <p>
            Canva expone un servidor MCP remoto ya hospedado — no hay que instalar nada, solo
            apuntar a su URL y autorizar con OAuth.
          </p>
          <ol className="practica-mcp__numbered">
            <li>
              En OpenClaw ve a <strong>Settings → MCP → Add server</strong>.
            </li>
            <li>
              Nombre: <code>canva</code>. Transporte: <strong>Streamable HTTP</strong>. URL:{' '}
              <code>https://mcp.canva.com/mcp</code>.
            </li>
            <li>
              Guarda. La primera vez que el agente use una tool de Canva, se abrirá un flujo de
              login/autorización con tu cuenta de Canva.
            </li>
          </ol>
          <CodeBlock
            code={canvaMcpConfig}
            caption="Equivalente editando openclaw.json directamente"
          />
        </SectionBlock>

        <SectionBlock id="paso-5" eyebrow="Paso 5" title="Conectar el MCP de Data 360">
          <p>
            <a href={data360Repo.url} target="_blank" rel="noreferrer">
              {data360Repo.label}
            </a>{' '}
            {data360Repo.description}
          </p>
          <p>
            Este MCP no tiene versión remota hospedada, así que hay que desplegarlo tú mismo
            para que OpenClaw (que vive en Render, no en tu laptop) pueda alcanzarlo por
            HTTP:
          </p>
          <ol className="practica-mcp__numbered">
            {data360RenderSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p>
            Con esa URL, agrega el servidor en OpenClaw igual que hiciste con Canva (Settings →
            MCP → Add server, nombre <code>data360</code>, transporte Streamable HTTP).
          </p>
          <CodeBlock
            code={data360McpConfig}
            caption="Equivalente editando openclaw.json directamente"
          />
        </SectionBlock>

        <SectionBlock
          id="paso-6"
          eyebrow="Paso 6"
          title="Usarlo desde el celular"
        >
          <p>
            Abre el navegador de tu celular y entra a la misma URL de tu servicio de OpenClaw
            en Render (no necesitas instalar nada). Inicia sesión con el token del paso 3.
          </p>
          <p>Pídele al agente algo como:</p>
          <p className="practica-mcp__query-prompt">{mobilePromptExample}</p>
          <p>
            El agente debería encadenar las tools de <code>data360</code> para traer datos
            reales y las de <code>canva</code> para producir el diseño y exportarlo en PDF —
            todo desde tu teléfono.
          </p>
        </SectionBlock>

        <SectionBlock id="entregables" eyebrow="Actividad" title="Entregables y evaluación">
          <p>Cada equipo entrega:</p>
          <ul className="practica-mcp__bullet-list">
            {deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="practica-mcp__grading">
            <h3 className="practica-mcp__grading-title">Criterios de calificación</h3>
            <ul className="practica-mcp__grading-list">
              {gradingCriteria.map(({ title, description }) => (
                <li key={title}>
                  <strong>{title}</strong>
                  <span>{description}</span>
                </li>
              ))}
            </ul>
          </div>
        </SectionBlock>

        <SectionBlock id="cierre" eyebrow="Cierre" title="Apagar los servicios">
          <p>
            Al terminar la práctica, entra a Render y elimina (o suspende) los dos servicios
            que creaste — OpenClaw y el MCP de Data 360. Son gratuitos, pero es buena práctica
            no dejar servicios corriendo con tokens y OAuth activos si no vas a seguir
            usándolos.
          </p>
          <p>
            Si quieres conservar tu agente para seguir explorando después del curso, puedes
            dejarlo activo: solo recuerda que el plan Free se duerme tras inactividad y que sin
            disco persistente perderás la configuración en cada redeploy.
          </p>
        </SectionBlock>
      </div>
    </div>
  )
}

export default PracticaAgentesPage
