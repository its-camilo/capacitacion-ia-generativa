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
  powerBiPrompt,
  ragSetupPrompt,
  sampleDatabases,
  sectionNav,
  sqliteMcpConfig,
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
            Crea un RAG con herramientas MCP, pruébalo en una página HTML independiente y visualiza
            un reporte de Power BI en el navegador, sin instalar Power BI Desktop.
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

        <SectionBlock id="paso-3" eyebrow="Paso 3" title="API Key de OpenRouter">
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
              el chat web.
            </li>
            <li>Instala el MCP remoto de OpenRouter en tu cliente de IA:</li>
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

        <SectionBlock id="mcp-sqlite" eyebrow="Recuerda" title="MCP SQLite (misma configuración de la sesión 2)">
          <p>
            Para crear el RAG necesitamos leer la base de datos SQLite con el agente. Es el mismo
            MCP que configuramos en la <strong>Sesión 02</strong>; si ya lo tienes activo puedes
            continuar. Si no, agrégalo de nuevo:
          </p>
          <CodeBlock
            code={sqliteMcpConfig}
            caption="Configuración en mcpServers — reemplaza la ruta por la de tu .db"
          />
          <p>
            Reinicia el cliente o recarga los servidores MCP y verifica que{' '}
            <code>sqlite</code> aparezca conectado antes de continuar.
          </p>
        </SectionBlock>

        <SectionBlock id="paso-4" eyebrow="Paso 4" title="Crear el RAG en Pinecone">
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
            Recuerda lo visto en la Sesión 01: un <strong>chunk</strong> es un fragmento de texto
            que se vectoriza y recupera por similitud. Cada fila o bloque que subas a Pinecone
            debería ser un chunk legible por sí solo.
          </p>
        </SectionBlock>

        <SectionBlock id="paso-5" eyebrow="Paso 5" title="Interfaz de chat con el RAG">
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
        </SectionBlock>

        <SectionBlock id="paso-6" eyebrow="Paso 6" title="Crear el reporte en Power BI">
          <p>
            Para generar el archivo usaremos{' '}
            <a href="https://github.com/d0nk3yhm/pbix-mcp" target="_blank" rel="noreferrer">
              pbix-mcp
            </a>
            , un servidor MCP que construye archivos <code>.pbix</code> nativos. En esta parte sí
            se prepara el entorno en el equipo donde se ejecutará OpenCode; no es necesario que
            cada computador restringido de los participantes tenga ese entorno instalado.
          </p>
          <p>
            El ejemplo está adaptado a la base <strong>Northwind</strong>. Si se usa otra base,
            ajusta las tablas, columnas y consultas SQL del prompt.
          </p>
          <p>Configuración del servidor MCP para OpenCode. Reemplaza la ruta por la ubicación real del proyecto:</p>
          <CodeBlock code={powerBiMcpConfig} caption="Configuración mcpServers — pbix-mcp" />
          <p>Después de configurar y conectar el MCP, usa este prompt en OpenCode para generar y validar el archivo .pbix y el ZIP:</p>
          <CodeBlock code={powerBiPrompt} caption="OpenCode: generar reporte Power BI con Northwind" />
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
