export const sectionNav = [
  { id: 'paso-1', label: 'Base de datos Northwind' },
  { id: 'paso-2', label: 'MCP SQLite' },
  { id: 'paso-3', label: 'Probar consultas' },
  { id: 'paso-4', label: 'Bonus: Google Docs MCP' },
  { id: 'paso-5', label: 'Probar Google Docs' },
  { id: 'entregables', label: 'Entregables' },
  { id: 'cierre', label: 'Cierre: quitar Google Docs MCP' },
]

export const northwindRepo = {
  label: 'jpwhite3/northwind-SQLite3',
  url: 'https://github.com/jpwhite3/northwind-SQLite3',
  downloadUrl:
    'https://raw.githubusercontent.com/jpwhite3/northwind-SQLite3/main/dist/northwind.db',
  fileName: 'northwind.db',
}

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

export const googleDocsMcpConfig = `{
  "mcpServers": {
    "google-docs": {
      "command": "npx",
      "args": ["-y", "@a-bonus/google-docs-mcp"],
      "env": {
        "GOOGLE_CLIENT_ID": "tu-client-id",
        "GOOGLE_CLIENT_SECRET": "tu-client-secret"
      }
    }
  }
}`

export const sampleQueries = [
  {
    id: 'tables',
    prompt: '¿Qué tablas hay en la base de datos?',
    hint: 'El modelo debería listar tablas como Customers, Orders, Products…',
  },
  {
    id: 'top-products',
    prompt:
      '¿Cuáles son los 5 productos con más unidades vendidas? Incluye nombre y cantidad total.',
    hint: 'Requiere unir Order Details con Products y agrupar.',
  },
  {
    id: 'revenue',
    prompt: '¿Cuál fue el total de ventas por país de los clientes?',
    hint: 'Combina Customers, Orders y Order Details.',
  },
]

export const googleDocsLinks = [
  {
    id: 'google-docs-mcp-official',
    provider: 'Google',
    label: 'MCP oficial de Google Docs',
    url: 'https://developers.google.com/workspace/docs/api/guides/configure-mcp-server',
  },
  {
    id: 'google-docs-mcp-community',
    provider: 'npm',
    label: '@a-bonus/google-docs-mcp',
    url: 'https://www.npmjs.com/package/@a-bonus/google-docs-mcp',
  },
  {
    id: 'opencode-mcp',
    provider: 'OpenCode',
    label: 'Servidores MCP',
    url: 'https://opencode.ai/v2/docs/mcp-servers',
  },
]

export const deliverables = [
  'Un informe sobre el tema que elijan (ventas, inventario, clientes, etc.).',
  'Lista de las tools MCP que usaron y para qué sirvió cada una.',
  'Breve sustentación de por qué eligieron esas herramientas para el informe.',
]

export const mcpConfigPaths = [
  '.cursor/mcp.json',
  '.cursor/mcp.jsonc',
  'mcp.json',
  'mcp.jsonc',
  'Claude Desktop: claude_desktop_config.json',
]

export const gradingCriteria = [
  {
    title: 'Utilidad del informe',
    description:
      '¿Responde una pregunta de negocio real? ¿Los hallazgos son accionables o solo descriptivos?',
  },
  {
    title: 'Variedad de tools',
    description:
      '¿Combinaron bien SQLite con Google Docs (u otros MCPs)? ¿Cada tool aportó algo distinto al flujo?',
  },
  {
    title: 'Sustentación',
    description:
      '¿Explican con claridad por qué usaron cada herramienta y cómo encajan en el informe final?',
  },
]
