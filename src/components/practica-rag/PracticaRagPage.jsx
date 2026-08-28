import {
  chatUiPrompt,
  deliverables,
  gradingCriteria,
  mcpConfigPaths,
  openRouterLinks,
  openRouterMcpConfigCursor,
  openRouterMcpConfigOpencode,
  pineconeLinks,
  pineconeMcpConfig,
  powerBiMcpConfig,
  ragSetupPrompt,
  sampleDatabases,
  sectionNav,
} from '../../data/practicaRagContent'
import SectionBlock from '../fundamentos/SectionBlock'
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
            Indexa una base SQLite en Pinecone, chatea con ese conocimiento usando OpenRouter
            (modelos gratuitos) y cierra con un reporte en Power BI.
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

        <SectionBlock
          id="paso-1"
          eyebrow="Paso 1"
          title="Descargar una base de datos de ejemplo"
        >
          <p>
            Elige <strong>una</strong> de estas bases para la práctica. Guárdalas en una carpeta
            común (por ejemplo <code>~/datos/rag/</code>) y anota la ruta absoluta; la usarás más
            adelante con tu cliente de IA.
          </p>
          <ul className="practica-mcp__query-list">
            {sampleDatabases.map(({ id, label, url, fileName, downloadUrl, description }) => (
              <li key={id} className="practica-mcp__query-card">
                <p className="practica-mcp__query-prompt">
                  <a href={url} target="_blank" rel="noreferrer">
                    {label}
                  </a>{' '}
                  — <code>{fileName}</code>
                </p>
                <p className="practica-mcp__query-hint">{description}</p>
                <p>
                  <a
                    className="practica-mcp__download"
                    href={downloadUrl}
                    download={fileName}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Descargar {fileName}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock id="paso-2" eyebrow="Paso 2" title="Cuenta Pinecone y MCP">
          <ol className="practica-mcp__numbered">
            <li>
              Crea una cuenta gratuita en{' '}
              <a href={pineconeLinks.signup} target="_blank" rel="noreferrer">
                Pinecone
              </a>
              .
            </li>
            <li>
              Dentro del panel, genera una <strong>API key</strong> y guárdala en un lugar seguro.
            </li>
            <li>
              Agrega el servidor MCP de Pinecone en la configuración de tu cliente (Cursor,
              OpenCode, Claude Desktop…):
            </li>
          </ol>
          <CodeBlock
            code={pineconeMcpConfig}
            caption="Configuración en mcpServers — reemplaza YOUR_API_KEY"
          />
          <p>
            Reinicia el cliente o recarga los servidores MCP. Verifica que aparezca{' '}
            <code>pinecone</code> conectado antes de continuar.
          </p>
        </SectionBlock>

        <SectionBlock id="paso-3" eyebrow="Paso 3" title="Cuenta OpenRouter y MCP">
          <ol className="practica-mcp__numbered">
            <li>
              Inicia sesión en{' '}
              <a href={openRouterLinks.signup} target="_blank" rel="noreferrer">
                OpenRouter
              </a>{' '}
              (también puedes registrarte con Google o GitHub).
            </li>
            <li>
              Genera tu{' '}
              <a href={openRouterLinks.apiKeys} target="_blank" rel="noreferrer">
                API key
              </a>{' '}
              y consérvala; la usarás para embeddings y respuestas del chat.
            </li>
            <li>Instala el MCP remoto de OpenRouter:</li>
          </ol>
          <CodeBlock code={openRouterMcpConfigOpencode} caption="OpenCode (~/.config/opencode/opencode.json)" />
          <CodeBlock
            code={openRouterMcpConfigCursor}
            caption="Cursor y otros clientes (~/.cursor/mcp.json)"
          />
          <p>
            Si usas otro cliente, sigue la guía oficial en{' '}
            <a href={openRouterLinks.mcpDocs} target="_blank" rel="noreferrer">
              OpenRouter MCP
            </a>
            . La primera vez puede pedirte autenticación OAuth en el navegador.
          </p>
        </SectionBlock>

        <SectionBlock id="paso-4" eyebrow="Paso 4" title="Crear el RAG en Pinecone">
          <p>
            Con Pinecone y OpenRouter conectados, dile a tu cliente de IA en qué carpeta están tus
            bases <code>.db</code> y pídele que indexe una de ellas en un índice nuevo en Pinecone.
            El <strong>nombre del índice</strong> lo define la IA según la base y el contenido que
            indexe. Solo al <strong>crear el RAG</strong>, usa el <strong>MCP de OpenRouter</strong>{' '}
            con un fallback de <strong>3 modelos gratuitos</strong> (si uno falla, prueba el
            siguiente).
          </p>
          <p>Prompt de ejemplo para copiar y adaptar:</p>
          <CodeBlock code={ragSetupPrompt} caption="Vibecoding: indexar SQLite en Pinecone" />
          <p className="practica-mcp__note">
            Recuerda lo visto en la Sesión 01: un <strong>chunk</strong> es un fragmento de texto
            que se vectoriza y recupera por similitud. Cada fila o bloque que subas a Pinecone
            debería ser un chunk legible por sí solo.
          </p>
        </SectionBlock>

        <SectionBlock id="paso-5" eyebrow="Paso 5" title="Interfaz de chat con el RAG">
          <p>
            Cuando el índice esté listo, pasa a modo vibecoding y pide una interfaz mínima de chat
            que consulte ese RAG:
          </p>
          <CodeBlock code={chatUiPrompt} caption="Vibecoding: chat web sencillo" />
        </SectionBlock>

        <SectionBlock id="paso-6" eyebrow="Paso 6" title="Instalar el MCP de Power BI">
          <p>
            Para el entregable de visualización, conecta el MCP de Power BI en tu cliente:
          </p>
          <CodeBlock code={powerBiMcpConfig} caption="Configuración en mcpServers" />
          <p>
            Úsalo para explorar la misma base SQLite que elegiste y armar el reporte que enviarás
            comprimido.
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

        <SectionBlock
          id="cierre"
          eyebrow="Cierre"
          title="Quitar el MCP de Pinecone"
        >
          <p>
            Al terminar la práctica, <strong>elimina el servidor MCP de Pinecone</strong> del
            archivo donde configuraste los MCPs. Si lo dejas activo, el agente podría seguir
            accediendo a tu cuenta de Pinecone con la API key que configuraste.
          </p>
          <p>
            Busca el bloque <code>pinecone</code> dentro de <code>mcpServers</code> (o la sección{' '}
            <code>mcp</code> en OpenCode) y bórralo por completo. Según tu cliente, el archivo suele
            estar en una de estas rutas:
          </p>
          <ul className="practica-mcp__bullet-list">
            {mcpConfigPaths.map((path) => (
              <li key={path}>
                <code>{path}</code>
              </li>
            ))}
          </ul>
          <p>
            Guarda el archivo, reinicia el cliente o recarga los servidores MCP, y confirma que{' '}
            <code>pinecone</code> ya no aparece conectado. Puedes revocar la API key desde el panel
            de Pinecone si ya no la necesitas.
          </p>
        </SectionBlock>
      </div>
    </div>
  )
}

export default PracticaRagPage
