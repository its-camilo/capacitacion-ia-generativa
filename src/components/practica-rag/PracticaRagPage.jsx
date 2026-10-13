import {
  allMcpConfigCursor,
  allMcpConfigOpencode,
  assetUrl,
  chatUiPrompt,
  classFiles,
  deliverables,
  gradingCriteria,
  openRouterLinks,
  powerBiPrompt,
  ragSetupPrompt,
  sectionNav,
} from '../../data/practicaRagContent'
import SectionBlock from '../fundamentos/SectionBlock'
import InsightCard from '../fundamentos/InsightCard'
import CodeBlock from '../practica-mcp/CodeBlock'
import '../../styles/fundamentos.css'
import '../../styles/practica-mcp.css'

function PracticaRagPage() {
  return (
    <div className="practica-mcp">
      <div className="practica-mcp__content">
        <header className="fundamentos__hero">
          <p className="fundamentos__hero-session">Sesión 03</p>
          <h1 className="fundamentos__hero-title">Práctica RAG</h1>
          <p className="fundamentos__hero-lead">
            Crea un RAG con herramientas MCP, pruébalo en una página HTML independiente y visualiza
            un reporte de Power BI en el navegador, sin instalar Power BI Desktop.
          </p>
        </header>

        <InsightCard
          eyebrow="Antes de empezar"
          title="La importancia del formato ASD-STE100"
          description="ASD-STE100 (Simplified Technical English) es la norma aeroespacial de inglés técnico simplificado: vocabulario aprobado, una sola idea por frase, frases cortas, voz activa y nada de jerga ni sinónimos a la deriva. En esta práctica escribimos cada chunk así —por ejemplo: «Producto Côte de Blaye (ID 38). Categoría: Beverages. Precio: $263.5. Estado: disponible.»— en vez de párrafos largos y ambiguos."
          steps={[
            'Chunks autocontenidos: cada fragmento se entiende solo, sin leer el resto.',
            'Vocabulario consistente (siempre «pedido», nunca alternar con «orden» o «solicitud»).',
            'Una idea por frase: el embedding representa un concepto por vector.',
            'Mejor recuperación por similitud y respuestas del modelo más fieles.',
          ]}
        />

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

        <SectionBlock id="paso-1" eyebrow="Paso 1" title="Configura todos los MCP de una vez">
          <p>
            La base <strong>Northwind</strong> ya está en el servidor de clase: no descargues una
            base ni instales los MCP remotos. Copia un solo bloque a la configuración de tu cliente.
            Incluye SQLite, Pinecone, OpenRouter y Power BI con <code>pbix-mcp</code>.
          </p>
          <CodeBlock
            code={allMcpConfigOpencode}
            caption="OpenCode V2 — ~/.config/opencode/opencode.json"
          />
          <CodeBlock
            code={allMcpConfigCursor}
            caption="Cursor — .cursor/mcp.json"
          />
          <p className="practica-mcp__note">
            SQLite, Pinecone y Power BI usan la BASE y CLAVE de clase; OpenRouter usa autenticación
            OAuth. No instales paquetes, no ejecutes comandos y no necesitas Tailscale.
          </p>
          <p>
            Recarga los MCP. OpenRouter puede pedir autenticación OAuth en el navegador. Para usar el
            chat web, cada equipo crea una API key temporal de OpenRouter en el paso siguiente.
          </p>
        </SectionBlock>

        <SectionBlock id="paso-2" eyebrow="Paso 2" title="API Key de OpenRouter">
          <p>
            Necesitas una API key de OpenRouter para dos cosas: crear el RAG (generar embeddings e
            indexar en Pinecone) y que la página web de chat pueda consultar el RAG con un modelo
            de lenguaje gratuito.
          </p>
          <ol className="practica-mcp__numbered">
            <li>
              Entra a{' '}
              <a href={openRouterLinks.signup} target="_blank" rel="noreferrer">
                openrouter.ai
              </a>{' '}
              y crea una cuenta (puedes usar Google o GitHub).
            </li>
            <li>
              Ve a{' '}
              <a href={openRouterLinks.apiKeys} target="_blank" rel="noreferrer">
                openrouter.ai/keys
              </a>
              , haz clic en <strong>Create key</strong> y copia la clave generada.
            </li>
            <li>
              Guarda la clave en un lugar seguro; la necesitarás al crear el RAG y al configurar
              el chat web. No la pegues en el repositorio público.
            </li>
          </ol>
          <p>
            El MCP remoto de OpenRouter ya está incluido en el bloque del paso 1. Si usas otro
            cliente, revisa la guía oficial de{' '}
            <a href={openRouterLinks.mcpDocs} target="_blank" rel="noreferrer">OpenRouter MCP</a>.
          </p>
        </SectionBlock>

        <SectionBlock id="paso-3" eyebrow="Paso 3" title="Crear el RAG en Pinecone">
          <p>
            Con los MCP de SQLite, Pinecone y OpenRouter ya configurados, pide a la IA que explore
            la base SQLite mediante sus herramientas MCP y cargue hasta 1000 chunks en un índice
            nuevo de Pinecone. El nombre del índice lo elige la IA según la base y el contenido.
            No hace falta ejecutar comandos ni instalar paquetes durante este paso; la IA debe
            operar mediante las herramientas MCP disponibles y reportar cualquier bloqueo.
          </p>
          <p>Prompt de ejemplo para copiar y adaptar:</p>
          <CodeBlock code={ragSetupPrompt} caption="Vibecoding: indexar SQLite en Pinecone" />
          <p className="practica-mcp__note">
            El índice es compartido por todo el curso: cada equipo trabaja en su propio{' '}
            <strong>namespace</strong> (usa el nombre de tu equipo). Si el proyecto alcanza el
            límite de índices, reutiliza el índice de clase con tu namespace en vez de crear otro.
          </p>
          <p className="practica-mcp__note">
            Recuerda lo visto en la Sesión 01: un <strong>chunk</strong> es un fragmento de texto
            que se vectoriza y recupera por similitud. Cada fila o bloque que subas a Pinecone
            debería ser un chunk legible por sí solo.
          </p>
        </SectionBlock>

        <SectionBlock id="paso-4" eyebrow="Paso 4" title="Interfaz de chat con el RAG">
          <p>
            Cuando el índice esté listo, pide una página autocontenida <code>index.html</code> con
            HTML, CSS y JavaScript vanilla. No debe requerir npm, Node.js, compilación, servidor,
            backend ni comandos. Guarda el archivo y ábrelo en el navegador. Las llamadas directas
            a Pinecone y OpenRouter pueden fallar por CORS o por restricciones del proveedor; si
            ocurre, no se debe simular el resultado ni pedir ejecutar comandos.
          </p>
          <p className="practica-mcp__note">
            Para esta prueba se permite ingresar claves temporales en la página, pero cualquier
            persona que acceda al HTML o al navegador puede verlas. No uses claves personales ni
            de producción y revócalas al terminar.
          </p>
          <CodeBlock code={chatUiPrompt} caption="Vibecoding: chat web sencillo" />
          <p className="practica-mcp__note">
            Modelo preseleccionado para esta edición:{' '}
            <code>dots-studio/dots-3-note-preview:free</code>. Si deja de estar gratuito, usa el
            botón <strong>Cargar modelos :free</strong> de la página y elige otro.
          </p>
          <p>
            <a
              className="practica-mcp__download"
              href={assetUrl(classFiles.ragChat)}
              download="rag-chat-index.html"
            >
              Descargar index.html del chat (Pinecone de clase precargado; agrega tu clave OpenRouter)
            </a>
          </p>
        </SectionBlock>

        <SectionBlock id="paso-5" eyebrow="Paso 5" title="Crear el reporte en Power BI">
          <p>
            El MCP remoto <code>powerbi</code> ya está configurado en el paso 1. Usa el paquete{' '}
            <a href="https://github.com/d0nk3yhm/pbix-mcp" target="_blank" rel="noreferrer">
              pbix-mcp
            </a>{' '}
            para construir el PBIX mediante el servidor MCP de clase. Los alumnos no necesitan
            instalar pbix-mcp ni conectarse al VPS mediante Tailscale.
          </p>
          <p>
            El ejemplo está adaptado a la base <strong>Northwind</strong>. Si se usa otra base,
            ajusta las tablas, columnas y consultas SQL del prompt.
          </p>
          <p>Usa este prompt en OpenCode para generar y validar el archivo .pbix y el ZIP:</p>
          <CodeBlock code={powerBiPrompt} caption="OpenCode: generar reporte Power BI con Northwind" />
          <p>
            Ejemplo verificado de esta edición (ábrelo en Power BI Desktop o súbelo a Power BI
            Service):
          </p>
          <p>
            <a
              className="practica-mcp__download"
              href={assetUrl(classFiles.pbix)}
              download="northwind.pbix"
            >
              Descargar northwind.pbix
            </a>{' '}
            <a
              className="practica-mcp__download"
              href={assetUrl(classFiles.pbixZip)}
              download="northwind-powerbi-entregable.zip"
            >
              Descargar ZIP entregable
            </a>
          </p>
          <div className="practica-mcp__note">
            <strong>Visualizar el resultado desde los computadores de capacitación:</strong> una vez
            generado el archivo <code>.pbix</code>, súbelo desde el navegador a{' '}
            <a href="https://app.powerbi.com/" target="_blank" rel="noreferrer">Power BI Service</a>
            {' '}con una cuenta educativa o institucional que tenga los permisos necesarios. Abre
            el informe en el navegador; los estudiantes no necesitan Power BI Desktop ni ejecutar
            comandos. La disponibilidad de carga y visualización depende de las licencias y políticas
            institucionales. No uses “Publicar en la web” para datos confidenciales, porque puede
            exponerlos públicamente.
          </div>
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

        <SectionBlock
          id="cierre"
          eyebrow="Cierre"
          title="Eliminar los archivos de la interfaz del RAG"
        >
          <p>
            Al terminar la práctica, <strong>elimina los archivos de la interfaz del RAG</strong>{' '}
            de tu computador: el <code>index.html</code> del chat (descargado o generado) y
            cualquier copia del ZIP entregable que no vayas a conservar.
          </p>
          <p>
            Si en la página activaste <strong>“Recordar claves en este navegador”</strong>,
            desmárcalo antes de cerrar, o borra los datos del sitio en tu navegador, para que las
            claves de clase no queden guardadas.
          </p>
        </SectionBlock>
      </div>
    </div>
  )
}

export default PracticaRagPage
