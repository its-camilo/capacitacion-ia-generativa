export const sectionNav = [
  { id: 'paso-1', label: 'Prerrequisitos' },
  { id: 'paso-2', label: 'Desplegar OpenClaw en Render' },
  { id: 'paso-3', label: 'Entrar al dashboard' },
  { id: 'paso-4', label: 'MCP de Canva' },
  { id: 'paso-5', label: 'MCP de Data 360' },
  { id: 'paso-6', label: 'Usarlo desde el celular' },
  { id: 'entregables', label: 'Entregables' },
  { id: 'cierre', label: 'Cierre: apagar los servicios' },
]

export const prerequisites = [
  {
    id: 'github',
    label: 'Cuenta de GitHub',
    description: 'Gratuita. La usarás para hacer fork del repo de OpenClaw.',
    url: 'https://github.com/signup',
  },
  {
    id: 'render',
    label: 'Cuenta de Render',
    description:
      'Gratuita (plan Free). Permite desplegar servicios web sin tarjeta para el uso que haremos hoy.',
    url: 'https://render.com',
  },
  {
    id: 'llm-key',
    label: 'API key de un proveedor LLM',
    description:
      'OpenClaw necesita un modelo para razonar. Sirve una key gratuita de OpenRouter, Anthropic o cualquier proveedor que ya tengas.',
    url: 'https://openrouter.ai/keys',
  },
  {
    id: 'canva-account',
    label: 'Cuenta de Canva',
    description: 'Gratuita. El MCP de Canva se autentica contra tu cuenta vía OAuth.',
    url: 'https://www.canva.com',
  },
]

export const openclawRepo = {
  label: 'openclaw/openclaw',
  url: 'https://github.com/openclaw/openclaw',
}

export const renderBlueprintNotes = [
  'El repo forkeado incluye un render.yaml que define el servicio web de OpenClaw (Docker) en el puerto 8080.',
  'Por defecto usa el plan "starter" (de pago). Para esta práctica cambia el plan a "Free" en el formulario del Blueprint y elimina el bloque de disco persistente (el plan Free no lo soporta).',
  'Sin disco persistente la configuración y las sesiones no sobreviven un redeploy; para una práctica de una sesión no es un problema, solo tenlo en cuenta.',
  'Render te pedirá la API key de tu proveedor LLM y un SETUP_PASSWORD para proteger la configuración inicial.',
  'El plan Free se "duerme" tras ~15 minutos sin uso: la primera petición después de eso tarda unos segundos en despertar (cold start).',
]

export const gatewayTokenNote =
  'Render genera automáticamente OPENCLAW_GATEWAY_TOKEN. Búscalo en tu servicio → pestaña Environment, y úsalo para iniciar sesión la primera vez que abras el dashboard.'

export const canvaMcpConfig = `{
  "mcp": {
    "servers": {
      "canva": {
        "url": "https://mcp.canva.com/mcp",
        "transport": "streamable-http",
        "enabled": true
      }
    }
  }
}`

export const data360Repo = {
  label: 'worldbank/data360-mcp',
  url: 'https://github.com/worldbank/data360-mcp',
  description:
    'MCP del Banco Mundial sobre la plataforma Data 360: cientos de indicadores de desarrollo (PIB, pobreza, género, clima, salud, educación…) con series de tiempo y metadatos. No requiere API key.',
}

export const data360RenderSteps = [
  'En Render, crea un segundo servicio: New + → Web Service, y conecta (o forkea primero) el repo worldbank/data360-mcp.',
  'Runtime: Python 3. Build command: pip install uv && uv sync.',
  'Start command: MCP_PORT=$PORT bash run_server.sh — el script respeta la variable MCP_PORT y Render inyecta $PORT automáticamente.',
  'Plan: Free. No necesita variables de entorno adicionales ni disco persistente.',
  'Al terminar el deploy, tu MCP quedará disponible en https://<tu-servicio-data360>.onrender.com/mcp.',
]

export const data360McpConfig = `{
  "mcp": {
    "servers": {
      "data360": {
        "url": "https://<tu-servicio-data360>.onrender.com/mcp",
        "transport": "streamable-http",
        "enabled": true
      }
    }
  }
}`

export const mobilePromptExample =
  '"Usando el MCP de Data 360, busca un indicador de desarrollo que te interese (pobreza, educación, cambio climático, género…) para un país o región. Trae la serie de tiempo, identifica la tendencia principal y arma un mini-informe. Luego usa el MCP de Canva para crear una infografía o presentación que resuma esos hallazgos con al menos un gráfico, y expórtala como PDF."'

export const deliverables = [
  'El PDF exportado desde Canva (informe, presentación o infografía) con el caso de uso elegido.',
  'Una o más capturas de pantalla de OpenClaw ejecutando el flujo completo desde el celular (llamando las tools de Data 360 y de Canva).',
  'Una nota breve: qué indicador/tema eligieron de Data 360 y por qué.',
]

export const gradingCriteria = [
  {
    title: 'Despliegue correcto',
    description:
      '¿OpenClaw quedó accesible en la nube y se pudo usar desde el celular sin depender de la laptop del equipo?',
  },
  {
    title: 'Uso combinado de MCPs',
    description:
      '¿El flujo realmente encadena Data 360 (datos) con Canva (entregable visual), en vez de improvisar el contenido?',
  },
  {
    title: 'Calidad del entregable',
    description:
      '¿El PDF comunica un hallazgo claro con datos reales, no solo texto genérico o relleno?',
  },
  {
    title: 'Sustentación',
    description:
      '¿Pueden explicar por qué eligieron ese indicador/caso de uso y qué mostró el dato?',
  },
]
