export const sectionNav = [
  { id: 'paso-1', label: 'Prerrequisitos' },
  { id: 'paso-2', label: 'Instalar Manus AI' },
  { id: 'paso-3', label: 'MCP de Canva' },
  { id: 'paso-4', label: 'MCP de Data 360' },
  { id: 'paso-5', label: 'API key de OpenRouter' },
  { id: 'paso-6', label: 'El entregable' },
]

export const prerequisites = [
  {
    id: 'manus',
    label: 'Cuenta de Manus AI',
    description:
      'Gratuita. Se puede crear con correo o cuenta de Google. Trae 1000 créditos de bienvenida y una cuota diaria de 300 créditos.',
    url: 'https://manus.im',
  },
  {
    id: 'canva-account',
    label: 'Cuenta de Canva',
    description: 'Gratuita. El conector de Canva en Manus se autentica contra tu cuenta vía OAuth.',
    url: 'https://www.canva.com',
  },
  {
    id: 'llm-key',
    label: 'API key de OpenRouter',
    description:
      'Gratuita. Manus la usará como conector para consultar modelos de OpenRouter dentro de la tarea.',
    url: 'https://openrouter.ai/keys',
  },
]

export const manusApps = {
  web: 'https://manus.im',
  ios: 'https://apps.apple.com/app/manus/id6738007748',
  android: 'https://play.google.com/store/apps/details?id=im.manus.app',
}

export const data360Repo = {
  label: 'Data 360 MCP — Banco Mundial',
  url: 'https://data360.worldbank.org',
  description:
    'MCP del Banco Mundial sobre la plataforma Data 360: cientos de indicadores de desarrollo (PIB, pobreza, género, clima, salud, educación…) con series de tiempo y metadatos. No requiere API key.',
}

export const data360McpFields = {
  name: 'Data360 MCP',
  endpoint: 'https://mcpext.worldbank.org/ext/data360/mcp',
  auth: 'Sin autenticación',
}

export const canvaConnectorNote =
  'Canva aparece en la lista de conectores predeterminados de Manus: solo hay que buscarlo y autorizar con tu cuenta (OAuth), sin URLs ni configuración manual.'

export const openrouterConnectorNote =
  'La API key de OpenRouter también está en el listado de conectores predeterminados de Manus: solo pégala en su campo correspondiente.'

export const taskPromptExample =
  '"Usando la API key de OpenRouter siempre que se pueda, obtén datos de un tema de desarrollo que te interese (pobreza, educación, cambio climático, género, salud…) desde el MCP de Data360 para un país o región. Con esa información, arma una presentación de 10 diapositivas en Canva sobre ese tema, con al menos un gráfico y una conclusión clara. Al final, exporta la presentación en formato PDF."'

export const alternatives = [
  {
    title: 'Automatizaciones dentro de Manus',
    description:
      'Manus AI también permite crear automatizaciones (tareas programadas o disparadas por eventos) usando los mismos conectores, sin depender de que alguien inicie la tarea manualmente cada vez.',
  },
  {
    title: 'Studio',
    description:
      'De la suite de Google, sirve para construir distintos tipos de automatizaciones e integraciones con modelos de Gemini.',
  },
  {
    title: 'OpenClaw',
    description:
      'Runtime de agentes de código abierto. Requiere desplegarlo en un servidor relativamente potente en la nube para poder acceder desde PC y celular, a diferencia de Manus que no necesita infraestructura propia.',
  },
]
