export const sectionNav = [
  { id: 'paso-1', label: 'Bases de datos SQLite' },
  { id: 'paso-2', label: 'Cuenta y MCP Pinecone' },
  { id: 'paso-3', label: 'API Key OpenRouter' },
  { id: 'mcp-sqlite', label: 'MCP SQLite (configuración)' },
  { id: 'paso-4', label: 'Crear el RAG' },
  { id: 'paso-5', label: 'Chat web con el RAG' },
  { id: 'paso-6', label: 'Power BI en la web' },
  { id: 'entregables', label: 'Entregables' },
  { id: 'cierre', label: 'Cierre: quitar MCP Pinecone' },
]

export const sampleDatabases = [
  {
    id: 'northwind',
    label: 'jpwhite3/northwind-SQLite3',
    url: 'https://github.com/jpwhite3/northwind-SQLite3',
    fileName: 'northwind.db',
    downloadUrl:
      'https://raw.githubusercontent.com/jpwhite3/northwind-SQLite3/main/dist/northwind.db',
    description:
      'Catálogo de productos, clientes y órdenes comerciales.',
  },
  {
    id: 'chinook',
    label: 'lerocha/chinook-database',
    url: 'https://github.com/lerocha/chinook-database',
    fileName: 'chinook.db',
    downloadUrl:
      'https://raw.githubusercontent.com/lerocha/chinook-database/master/ChinookDatabase/DataSources/Chinook_Sqlite.sqlite',
    description:
      'Tienda de música con canciones, artistas, géneros y ventas.',
  },
  {
    id: 'sakila',
    label: 'siara-cc/sakila_sqlite3',
    url: 'https://github.com/siara-cc/sakila_sqlite3',
    fileName: 'sakila.db',
    downloadUrl:
      'https://raw.githubusercontent.com/siara-cc/sakila_sqlite3/master/sakila.db',
    description:
      'Sistema de alquiler de películas con descripciones, reparto y categorías.',
  },
  {
    id: 'world',
    label: 'factbook/factbook.sql',
    url: 'https://github.com/factbook/factbook.sql',
    fileName: 'factbook.db',
    downloadUrl:
      'https://github.com/factbook/factbook.sql/releases/download/v0.1/factbook.db',
    description:
      'Datos demográficos con países, ciudades, idiomas y poblaciones.',
  },
  {
    id: 'imdb',
    label: 'hamzafoy/imdb_sqlite3_sequelize',
    url: 'https://github.com/hamzafoy/imdb_sqlite3_sequelize',
    fileName: 'movies.db',
    downloadUrl:
      'https://raw.githubusercontent.com/hamzafoy/imdb_sqlite3_sequelize/master/movies.db',
    description:
      'Metadatos de películas, directores, actores y valoraciones.',
  },
  {
    id: 'classicmodels',
    label: 'Yash-Kavaiya/Chatwithsql',
    url: 'https://github.com/Yash-Kavaiya/Chatwithsql',
    fileName: 'ClassicModels.db',
    downloadUrl:
      'https://raw.githubusercontent.com/Yash-Kavaiya/Chatwithsql/main/ClassicModels.db',
    description:
      'Empresa de venta de modelos a escala, clientes, pagos y empleados.',
  },
  {
    id: 'salesco',
    label: 'EAName/Database-Systems-and-Data-Preparation',
    url: 'https://github.com/EAName/Database-Systems-and-Data-Preparation',
    fileName: 'SalesCO.db',
    downloadUrl:
      'https://raw.githubusercontent.com/EAName/Database-Systems-and-Data-Preparation/main/data/sample/SalesCO.db',
    description:
      'Ventas comerciales con clientes, productos y territorios; esquema relacional amplio para practicar.',
  },
]

export const pineconeLinks = {
  signup: 'https://app.pinecone.io/',
  apiKeys: 'https://app.pinecone.io/',
}

export const pineconeMcpConfig = `{
  "mcpServers": {
    "pinecone": {
      "command": "npx",
      "args": [
        "-y",
        "@pinecone-database/mcp"
      ],
      "env": {
        "PINECONE_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}`

export const sqliteMcpConfig = `{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-server-sqlite-npx",
        "/ruta/a/tu/northwind.db"
      ]
    }
  }
}`

export const openRouterLinks = {
  signup: 'https://openrouter.ai/',
  apiKeys: 'https://openrouter.ai/keys',
  mcpDocs: 'https://openrouter.ai/docs/guides/overview/mcp-server',
}

export const openRouterMcpConfigOpencode = `{
  "mcp": {
    "openrouter": {
      "type": "remote",
      "url": "https://mcp.openrouter.ai/mcp",
      "enabled": true
    }
  }
}`

export const openRouterMcpConfigCursor = `{
  "mcpServers": {
    "openrouter": {
      "url": "https://mcp.openrouter.ai/mcp"
    }
  }
}`

export const ragSetupPrompt = `Usa las herramientas MCP de SQLite, Pinecone y OpenRouter que ya están conectadas. No ejecutes comandos de terminal, no instales paquetes y no crees scripts para ejecutar.

Explora la base SQLite disponible mediante el MCP de SQLite. Elige las tablas más útiles, convierte filas representativas en chunks de texto legibles por sí solos y crea un índice nuevo en Pinecone. No superes 1000 registros/chunks para esta demostración. Usa un modelo gratuito de embeddings compatible con Pinecone y, si necesitas generar embeddings mediante OpenRouter, prueba hasta 3 modelos gratuitos en orden si alguno falla.

No inventes resultados: confirma con las herramientas que el índice se creó y que los vectores se subieron. Al terminar, informa el nombre del índice, las tablas consultadas, el número de chunks cargados, el modelo de embeddings y cualquier limitación encontrada. Si alguna operación no está disponible mediante MCP, explica el bloqueo; no intentes resolverlo ejecutando comandos.`
export const chatUiPrompt = `Crea un único archivo llamado index.html, autocontenido, con HTML, CSS y JavaScript vanilla. No uses React, Vite, npm, Node.js, paquetes, compilación, backend, servidor local ni comandos de terminal. La página debe poder guardarse y abrirse en un navegador moderno.

Construye una interfaz de chat que consulte el índice Pinecone que ya creamos y use OpenRouter para redactar respuestas:
- Incluye campos editables para la API key de Pinecone, la región/host del índice, el nombre del índice y la API key de OpenRouter.
- Permite escribir preguntas, enviar con un botón o Enter y ver el historial.
- Recupera de Pinecone los chunks relevantes para cada pregunta y pásalos como contexto a un modelo gratuito de OpenRouter.
- Muestra la respuesta y un panel desplegable con los chunks recuperados; deja claro cuándo no se recuperó contexto.
- Incluye estados de carga, errores legibles y botón para limpiar la conversación.
- Usa únicamente APIs HTTP desde el navegador; no dependas de archivos externos ni de librerías.
- No simules respuestas ni afirmes que la consulta funcionó si la API devuelve un error.

Es una demostración didáctica: las claves introducidas en el HTML/navegador pueden ser vistas por quien use la página. No reutilices claves personales o de producción. Usa claves temporales de prueba con permisos mínimos y revócalas al terminar. Si CORS o las restricciones del proveedor impiden las llamadas desde el navegador, explica que el acceso directo no es viable en ese entorno; no añadas un backend ni solicites ejecutar comandos.`
export const powerBiMcpConfig = `No se necesita configurar un MCP de Power BI en los computadores de capacitación. El archivo .pbix debe estar generado previamente y disponible para subirlo desde el navegador.`
export const powerBiPrompt = `Necesito visualizar en la web un reporte de Power BI ya generado, usando un computador con acceso limitado.

No instales programas, no ejecutes comandos de terminal, no crees entornos Python, no uses scripts locales y no pidas a la IA que ejecute comandos. No asumas que Power BI Desktop está instalado.

Si ya existe un archivo .pbix generado:
1. Abre el navegador e ingresa a https://app.powerbi.com/ con una cuenta institucional/educativa de Microsoft.
2. En el espacio de trabajo autorizado, busca la opción para cargar o importar el archivo .pbix. La etiqueta puede variar según la interfaz y los permisos de la cuenta.
3. Selecciona el archivo .pbix y espera a que termine la importación.
4. Abre el informe desde el servicio web y comprueba que se vean los gráficos y que no haya errores.
5. Si la cuenta no permite cargar el archivo, crear informes o compartirlos, no intentes eludir la restricción: informa al instructor qué permiso falta.

Importante:
- Una cuenta educativa no garantiza por sí sola todas las funciones de Power BI. Las licencias y políticas de la institución pueden limitar la carga, edición o uso compartido.
- No uses “Publicar en la web” con datos reales, personales, institucionales o confidenciales: puede hacer que el informe sea accesible públicamente. Usa solo datos ficticios o públicos y comparte mediante opciones autorizadas.
- El archivo .pbix debe haberse generado antes de esta actividad. Esta guía cubre únicamente cargarlo y visualizarlo en Power BI Service desde el navegador; no requiere Power BI Desktop en el computador del estudiante.`
export const deliverables = [
  'Un proyecto de Power BI (.pbix) comprimido en ZIP donde representen los datos que quieran de la base elegida.',
  'Una captura de pantalla de una respuesta del RAG que muestre claramente en qué chunks se basó la respuesta.',
]

export const gradingCriteria = [
  {
    title: 'Visualización en Power BI',
    description:
      '¿El reporte responde una pregunta clara sobre la base elegida? ¿Las medidas y gráficos tienen sentido?',
  },
  {
    title: 'RAG funcional',
    description:
      '¿El chat recupera contexto real de Pinecone y la respuesta cita información verificable de los chunks?',
  },
  {
    title: 'Evidencia de chunks',
    description:
      '¿La captura muestra la pregunta, la respuesta y los fragmentos (chunks) que alimentaron el contexto?',
  },
]

export const mcpConfigPaths = [
  '.cursor/mcp.json',
  '.cursor/mcp.jsonc',
  '~/.config/opencode/opencode.json',
  'mcp.json',
  'mcp.jsonc',
  'Claude Desktop: claude_desktop_config.json',
]
