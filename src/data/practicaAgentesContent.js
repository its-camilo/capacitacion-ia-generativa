export const sectionNav = [
  { id: 'paso-1', label: 'Prerrequisitos' },
  { id: 'paso-2', label: 'Entrar a Hark' },
  { id: 'paso-3', label: 'Consultar Data360' },
  { id: 'paso-4', label: 'Crear la presentación en Canva' },
  { id: 'paso-5', label: 'Exportar y verificar el PDF' },
  { id: 'entregables', label: 'Entregables' },
]

export const prerequisites = [
  {
    id: 'hark-account',
    label: 'Cuenta gratuita de Hark',
    description:
      'Hark ofrece sus funciones en el plan gratuito; los planes pagos aumentan el uso disponible. La tarea puede consumir la cuota, así que conviene trabajar con un tema acotado.',
    url: 'https://hark.com',
  },
  {
    id: 'canva-account',
    label: 'Cuenta de Canva',
    description:
      'Necesaria para crear y editar la presentación. La cuenta gratuita puede tener límites de plantillas, recursos y exportación.',
    url: 'https://www.canva.com',
  },
  {
    id: 'data360',
    label: 'Data360 del Banco Mundial',
    description:
      'Fuente de indicadores y datos comparables sobre desarrollo. Se consulta desde el navegador; esta práctica no requiere configurar un servidor MCP.',
    url: 'https://data360.worldbank.org/en/search',
  },
]

export const harkLinks = {
  web: 'https://hark.com',
  pricing: 'https://hark.com/pricing',
  guide: 'https://hark.com/using-hark',
}

export const data360Repo = {
  label: 'Data360 — Banco Mundial',
  url: 'https://data360.worldbank.org/en/search',
  description:
    'Portal de datos de desarrollo con indicadores, series temporales y metadatos de más de 200 economías. Permite explorar por tema, país, indicador y periodo.',
}

export const taskPromptExample =
  'Investiga un tema de desarrollo para Colombia usando datos reales del portal Data360 del Banco Mundial: https://data360.worldbank.org/en/search. Elige un tema con series temporales disponibles, por ejemplo pobreza, educación, salud, género, empleo o cambio climático. Antes de diseñar, identifica entre 3 y 5 indicadores pertinentes y registra para cada uno el nombre exacto, unidad, años disponibles, valores utilizados y enlace a la fuente. No inventes ni completes datos faltantes; señala los vacíos y las limitaciones. Después, entra a Canva con mi autorización y crea una presentación editable de exactamente 10 diapositivas, en español, con narrativa clara para una audiencia universitaria. Incluye: título y pregunta central; contexto; metodología y fuentes; al menos dos gráficos legibles basados en los datos verificados; interpretación de resultados; limitaciones; conclusión y recomendaciones. Incluye fuente y año junto a cada gráfico y una diapositiva final de referencias con enlaces. Usa un diseño consistente, accesible y sobrio, evita párrafos largos y no presentes correlación como causalidad. Muéstrame una vista previa y verifica títulos, cifras, etiquetas, unidades y referencias antes de exportar. Finalmente, exporta el diseño desde Canva como PDF y entrégame el archivo descargable. Si no puedes acceder a Data360, editar Canva o exportar el archivo, explícame qué paso quedó bloqueado y no simules que lo completaste.'

export const deliverables = [
  'El PDF exportado desde Canva con exactamente 10 diapositivas, gráficos basados en datos verificados y enlaces a las fuentes.',
  'Capturas de pantalla del flujo en Hark: consulta de Data360, construcción o edición de la presentación en Canva y exportación del PDF.',
  'Una breve nota con el tema, los indicadores seleccionados, los años analizados y cualquier limitación o paso que haya requerido intervención manual.',
]

export const alternatives = [
  {
    title: 'My Tierroom',
    url: 'https://my-tierroom.party/',
    description:
      'Alternativa adicional para explorar. Verifica directamente en el sitio sus funciones, requisitos de acceso y condiciones de uso.',
  },
  {
    title: 'Manus AI',
    url: 'https://manus.im',
    description:
      'Agente de propósito general para investigar y completar tareas en varios pasos. Alternativa a Hark para explorar flujos de investigación y creación de entregables; las funciones y cuotas gratuitas pueden cambiar.',
  },
  {
    title: 'Studio de Google Workspace',
    url: 'https://workspace.google.com/',
    description:
      'Herramienta de Google Workspace para crear automatizaciones y flujos de trabajo con IA e integraciones del ecosistema de Google. Las funciones disponibles dependen de la cuenta, el plan y la disponibilidad del producto.',
  },
  {
    title: 'Hermes Agent',
    url: 'https://hermes-agent.nousresearch.com/docs/',
    description:
      'Agente de código abierto de Nous Research con memoria, herramientas web, habilidades reutilizables, automatizaciones y soporte para MCP. Requiere instalación o un entorno donde ejecutarlo y configurar un proveedor de modelos.',
  },
  {
    title: 'OpenClaw',
    url: 'https://github.com/openclaw/openclaw',
    description:
      'Runtime de agentes de código abierto para automatizar tareas e integraciones. Su despliegue y mantenimiento requieren más configuración técnica que una aplicación web alojada.',
  },
  {
    title: 'ChatGPT y Claude',
    description:
      'Asistentes que pueden apoyar investigación, análisis y creación de contenido; las capacidades de conectores, uso del navegador y exportación dependen del producto, plan y permisos disponibles.',
  },
]
