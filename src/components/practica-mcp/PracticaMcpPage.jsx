import {
  deliverables,
  googleDocsLinks,
  googleDocsMcpConfig,
  gradingCriteria,
  mcpConfigPaths,
  northwindRepo,
  sampleQueries,
  sectionNav,
  sqliteMcpConfig,
} from '../../data/practicaMcpContent'
import SectionBlock from '../fundamentos/SectionBlock'
import CodeBlock from './CodeBlock'
import '../../styles/fundamentos.css'
import '../../styles/practica-mcp.css'

function PracticaMcpPage() {
  return (
    <div className="practica-mcp">
      <div className="practica-mcp__content">
        <header className="fundamentos__hero">
          <p className="fundamentos__hero-session">Sesión 02</p>
          <h1 className="fundamentos__hero-title">Práctica MCP</h1>
          <p className="fundamentos__hero-lead">
            Conecta tu cliente (Cursor, OpenCode u otro) a bases de datos y documentos
            reales mediante MCP. Primero SQLite con Northwind; luego Google Docs como bonus.
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
          title="Descargar la base de datos de ejemplo"
        >
          <p>
            Usaremos <strong>Northwind</strong>, el clásico dataset de ventas e inventario de
            Microsoft. En el repositorio{' '}
            <a href={northwindRepo.url} target="_blank" rel="noreferrer">
              {northwindRepo.label}
            </a>{' '}
            descarga <code>dist/{northwindRepo.fileName}</code>.
          </p>
          <p>
            <a
              className="practica-mcp__download"
              href={northwindRepo.downloadUrl}
              target="_blank"
              rel="noreferrer"
            >
              Descargar {northwindRepo.fileName}
            </a>
          </p>
          <p>
            Guarda el archivo en tu máquina y anota la ruta absoluta (por ejemplo{' '}
            <code>~/datos/{northwindRepo.fileName}</code>). Si quieres más registros, clona el
            repo y ejecuta <code>make populate</code>. También puedes usar otras bases SQLite.
          </p>
        </SectionBlock>

        <SectionBlock id="paso-2" eyebrow="Paso 2" title="Instalar el MCP de SQLite">
          <p>
            Agrega el servidor MCP de SQLite en la configuración de tu cliente. Reemplaza la ruta
            del último argumento con la ubicación de tu <code>northwind.db</code>.
          </p>
          <CodeBlock
            code={sqliteMcpConfig}
            caption="Configuración en mcpServers (Cursor, OpenCode, Claude Desktop…)"
          />
          <p>
            Reinicia el cliente o recarga los servidores MCP. Verifica que aparezca el servidor{' '}
            <code>sqlite</code> conectado antes de continuar.
          </p>
        </SectionBlock>

        <SectionBlock id="paso-3" eyebrow="Paso 3" title="Probar con consultas">
          <p>
            Desde OpenCode, Cursor o tu cliente, pide al modelo que use las tools de SQLite. Empieza
            con un par de preguntas en lenguaje natural y confirma que ejecuta SQL y devuelve
            resultados.
          </p>
          <ul className="practica-mcp__query-list">
            {sampleQueries.map(({ id, prompt, hint }) => (
              <li key={id} className="practica-mcp__query-card">
                <p className="practica-mcp__query-prompt">&ldquo;{prompt}&rdquo;</p>
                <p className="practica-mcp__query-hint">{hint}</p>
              </li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock
          id="paso-4"
          eyebrow="Paso 4 · Bonus"
          title="Instalar el MCP de Google Docs"
        >
          <p>
            Como extensión, conecta Google Docs (y Drive) para que el agente pueda leer y escribir
            documentos. Puedes usar el MCP oficial de Google o el paquete de la comunidad{' '}
            <code>@a-bonus/google-docs-mcp</code>, que simplifica OAuth con Desktop app.
          </p>
          <ol className="practica-mcp__numbered">
            <li>
              Crea un proyecto en Google Cloud, habilita las APIs de Docs y Drive, y configura la
              pantalla de consentimiento OAuth.
            </li>
            <li>
              Crea credenciales OAuth (tipo Desktop), copia Client ID y Client Secret, y autoriza
              con{' '}
              <code>
                GOOGLE_CLIENT_ID=&quot;…&quot; GOOGLE_CLIENT_SECRET=&quot;…&quot; npx -y
                @a-bonus/google-docs-mcp auth
              </code>
              .
            </li>
            <li>Agrega el servidor a tu cliente:</li>
          </ol>
          <CodeBlock code={googleDocsMcpConfig} caption="Ejemplo de configuración" />
          <ul className="practica-mcp__links">
            {googleDocsLinks.map(({ id, provider, label, url }) => (
              <li key={id}>
                <a href={url} target="_blank" rel="noreferrer">
                  <span className="practica-mcp__link-provider">{provider}</span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock id="paso-5" eyebrow="Paso 5" title="Crear un Doc y probarlo">
          <p>
            Crea un documento vacío en tu Google Drive. Luego, desde OpenCode o tu cliente, haz una
            solicitud simple: por ejemplo, que lea el título, inserte un párrafo con un resumen de
            Northwind, o que copie ahí los resultados de una consulta anterior.
          </p>
          <p>
            El objetivo es ver el ciclo completo: el modelo elige la tool de Docs, la invoca y tú
            verificas el cambio en Drive.
          </p>
        </SectionBlock>

        <SectionBlock id="entregables" eyebrow="Actividad" title="Entregables y evaluación">
          <p>
            Con SQLite y Google Docs funcionando, el reto es integrarlos en un mini proyecto. Cada
            equipo entrega:
          </p>
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
          <p className="practica-mcp__note">
            Pueden sumar más bases de datos u otros MCPs (Sheets, Drive, etc.) si les ayuda a
            enriquecer el informe; documenten todo en la lista de tools.
          </p>
        </SectionBlock>

        <SectionBlock
          id="cierre"
          eyebrow="Cierre"
          title="Quitar el MCP de Google Docs"
        >
          <p>
            Al terminar la práctica, <strong>elimina el servidor MCP de Google Docs</strong> del
            archivo JSON o JSONC donde configuraste los MCPs. Si lo dejas activo, el agente podría
            seguir accediendo a tu cuenta de Google con las credenciales OAuth que autorizaste.
          </p>
          <p>
            Busca el bloque <code>google-docs</code> dentro de <code>mcpServers</code> y bórralo
            por completo. Según tu cliente, el archivo suele estar en una de estas rutas:
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
            <code>google-docs</code> ya no aparece conectado. El MCP de SQLite puede quedarse si
            sigues usándolo localmente.
          </p>
        </SectionBlock>
      </div>
    </div>
  )
}

export default PracticaMcpPage
