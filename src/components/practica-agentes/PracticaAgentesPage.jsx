import {
  alternatives,
  data360Repo,
  deliverables,
  harkLinks,
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
            Usa el plan gratuito de Hark para investigar datos de desarrollo en Data360
            (Banco Mundial), crear una presentación de 10 diapositivas en Canva y exportarla
            como PDF. El agente trabaja desde un navegador en la nube; no necesitas configurar
            MCP ni instalar herramientas de desarrollo para esta práctica.
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
            La práctica está diseñada para realizarse con herramientas web. Hark ofrece un plan
            gratuito, aunque el uso del agente tiene límites y una tarea larga puede agotar la
            cuota disponible. Antes de empezar, ten a la mano:
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
          <p>
            No se necesita una API key de OpenRouter para el flujo principal. Tampoco se agrega
            un servidor MCP de Canva o Data360: Hark puede navegar sitios web mediante Handoff.
          </p>
        </SectionBlock>

        <SectionBlock id="paso-2" eyebrow="Paso 2" title="Entrar a Hark">
          <p>
            <a href={harkLinks.web} target="_blank" rel="noreferrer">Hark</a> es un asistente
            que puede delegar tareas al navegador de un computador en la nube mediante su
            función Handoff. Su plan gratuito incluye las funciones principales, mientras que
            los planes pagos aumentan el uso disponible. Consulta los{' '}
            <a href={harkLinks.pricing} target="_blank" rel="noreferrer">planes vigentes</a>.
          </p>
          <ol className="practica-mcp__numbered">
            <li>
              Abre <a href={harkLinks.web} target="_blank" rel="noreferrer">hark.com</a> e
              inicia sesión o crea una cuenta.
            </li>
            <li>Inicia una conversación o crea un proyecto para mantener reunida la tarea.</li>
            <li>
              Explica que necesitas investigar datos, crear una presentación en Canva y
              descargar el PDF. Cuando Hark necesite usar un navegador, permite iniciar la
              tarea de Handoff.
            </li>
            <li>
              Si solicita entrar a Canva, inicia sesión tú mismo en la ventana segura y revisa
              los permisos antes de autorizar cualquier acción.
            </li>
          </ol>
          <p>
            Handoff usa su propio navegador en la nube para interactuar con sitios web. Por eso,
            los pasos de esta sesión no dependen de instalar Manus, registrar conectores MCP ni
            proporcionar una API key de OpenRouter.
          </p>
        </SectionBlock>

        <SectionBlock id="paso-3" eyebrow="Paso 3" title="Consultar datos en Data360">
          <p>
            <a href={data360Repo.url} target="_blank" rel="noreferrer">{data360Repo.label}</a>{' '}
            {data360Repo.description}
          </p>
          <ol className="practica-mcp__numbered">
            <li>Elige un tema de desarrollo y define una pregunta que se pueda responder con datos.</li>
            <li>
              Busca indicadores para Colombia u otra economía y revisa la unidad de medida, la
              cobertura temporal, la definición y la fuente original.
            </li>
            <li>
              Conserva los enlaces de los indicadores y los años exactos que usarás. No aceptes
              cifras sin fuente ni permitas que el agente invente valores cuando falten datos.
            </li>
          </ol>
          <p>
            Data360 reúne información de distintas fuentes y conjuntos de datos. Verifica la
            fuente específica de cada indicador; no asumas que todos los indicadores provienen
            de la misma unidad del Banco Mundial.
          </p>
        </SectionBlock>

        <SectionBlock id="paso-4" eyebrow="Paso 4" title="Crear la presentación en Canva">
          <p>
            Copia el siguiente prompt en Hark. El agente debe investigar primero, comprobar los
            datos y luego usar el navegador para construir la presentación. La creación y
            exportación dependen de que Hark pueda interactuar con Canva y de las funciones
            disponibles en la cuenta utilizada.
          </p>
          <div className="practica-mcp__query-prompt">{taskPromptExample}</div>
          <p>
            Si Hark solicita intervención para iniciar sesión, elegir una plantilla o confirmar
            una acción, completa ese paso manualmente. Revisa la presentación antes de aceptar
            la versión final: los gráficos deben corresponder a los valores consultados y cada
            cifra debe tener una fuente identificable.
          </p>
        </SectionBlock>

        <SectionBlock id="paso-5" eyebrow="Paso 5" title="Exportar y verificar el PDF">
          <ol className="practica-mcp__numbered">
            <li>
              Pide a Hark que exporte el diseño de Canva como PDF y que adjunte el archivo
              resultante a la conversación.
            </li>
            <li>
              Abre el PDF y verifica que tenga exactamente 10 diapositivas, que los gráficos y
              las etiquetas se lean correctamente y que los enlaces a las fuentes estén incluidos.
            </li>
            <li>
              Si la descarga automática no funciona, abre la presentación en Canva y utiliza
              Compartir o Descargar → PDF. Esta intervención manual es válida; indícala en la
              nota de entrega.
            </li>
          </ol>
          <p>
            La cuota gratuita de Hark puede limitar cuánto trabajo puede realizar en una sesión.
            Si se alcanza ese límite, guarda lo ya producido y continúa manualmente en Canva; no
            es necesario contratar un plan para completar la actividad.
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
            Hark es la herramienta del flujo principal de esta sesión. Estas otras opciones
            permiten comparar distintos enfoques de agentes, desde servicios web hasta agentes
            de código abierto:
          </p>
          <div className="practica-mcp__grading">
            <ul className="practica-mcp__grading-list">
              {alternatives.map(({ title, description, url }) => (
                <li key={title}>
                  <strong>
                    {url ? (
                      <a href={url} target="_blank" rel="noreferrer">{title}</a>
                    ) : title}
                  </strong>
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
