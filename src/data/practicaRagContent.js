export const sectionNav = [
  { id: 'paso-1', label: 'Bases de datos SQLite' },
  { id: 'paso-2', label: 'Cuenta y MCP Pinecone' },
  { id: 'paso-3', label: 'Cuenta y MCP OpenRouter' },
  { id: 'paso-4', label: 'Crear el RAG' },
  { id: 'paso-5', label: 'Chat web con el RAG' },
  { id: 'paso-6', label: 'MCP Power BI' },
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

export const ragSetupPrompt = `Tengo bases SQLite en la carpeta ~/datos/rag/ (ajusta la ruta si la tuya es distinta).
Elige una de ellas, léela, convierte filas relevantes en chunks de texto y súbelos a Pinecone
en un índice nuevo. El nombre del índice lo eliges tú según la base y lo que indexaste.

Al crear este RAG, usa el MCP de OpenRouter con un fallback de 3 modelos gratuitos
(si uno falla, prueba el siguiente). Para embeddings, usa también un modelo gratuito si hace falta.
Documenta el nombre del índice, qué tablas indexaste y cuántos chunks subiste.`

export const chatUiPrompt = `En la carpeta ./rag-chat/ crea una página web mínima: solo un chat que consulte
el índice Pinecone que acabamos de crear (usa el nombre que definimos al armar el RAG).

Requisitos:
- HTML + CSS + JS vanilla (o el stack más simple posible).
- Campo de texto, botón enviar e historial de mensajes.
- Al preguntar, recupera chunks relevantes de Pinecone y responde con el contexto recuperado.
- Muestra en consola (o en un panel colapsable) los chunks usados como contexto.

No hagas login ni backend complejo: basta un servidor estático y llamadas desde el front
o un mini proxy local si lo necesitas.`

export const powerBiMcpConfig = `{
  "mcpServers": {
    "powerbi": {
      "command": "npx",
      "args": [
        "-y",
        "@sulaiman013/powerbi-mcp"
      ]
    }
  }
}`

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
