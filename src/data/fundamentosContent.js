export const sectionNav = [
  { id: 'historia', label: 'Historia de la computación' },
  { id: 'conceptos', label: 'Conceptos básicos' },
  { id: 'prompting', label: 'Prompting avanzado' },
  { id: 'tokens', label: 'Tokens y costos' },
  { id: 'transformers', label: 'Transformers' },
  { id: 'mcp', label: 'Introducción a MCP' },
  { id: 'rag', label: 'Introducción a RAG' },
]

export const timelineSteps = [
  { label: 'Tarjetas perforadas', detail: 'Instrucciones físicas' },
  { label: 'Circuitos', detail: 'Ejecución eléctrica' },
  { label: 'Ensamblador', detail: 'Símbolos para el CPU' },
  { label: 'C++', detail: 'Control y rendimiento' },
  { label: 'Python', detail: 'Código legible' },
  { label: 'IA generativa', detail: 'Describes, el modelo produce' },
]

export const concepts = [
  {
    id: 'agente',
    term: 'Agente',
    definition:
      'Modelo + herramientas + bucle que planea, actúa y revisa el resultado casi solo.',
  },
  {
    id: 'api-key',
    term: 'API key',
    definition:
      'Tu llave de acceso al proveedor. Sin ella no hay servicio ni control de gasto.',
  },
  {
    id: 'proveedor',
    term: 'Proveedor',
    definition:
      'Empresa que hospeda el modelo y te lo entrega por API (OpenAI, Anthropic, Google…).',
  },
  {
    id: 'open-source',
    term: 'Proveedor open source',
    definition:
      'Modelo público (Llama, Mistral…). Lo puedes correr tú; el cómputo igual cuesta.',
  },
  {
    id: 'harness',
    term: 'Harness',
    definition:
      'Capa que opera el modelo: conecta herramientas, reglas y memoria (Cursor, LangGraph…).',
  },
]

export const promptBlocks = [
  { label: 'Contexto', hint: 'Quién eres y qué datos hay' },
  { label: 'Solicitud', hint: 'Qué quieres que haga' },
  { label: 'Formato', hint: 'Cómo debe verse la respuesta' },
  { label: 'Restricciones', hint: 'Qué evitar o limitar' },
]

export const tokenTips = [
  'Chats separados por tarea',
  'Resume hilos largos',
  'Reutiliza instrucciones cacheables',
  'No pegues documentos enteros',
]

export const resources = {
  attentionPaper: {
    title: 'Attention Is All You Need',
    subtitle: 'Vaswani et al., 2017',
    url: 'https://arxiv.org/pdf/1706.03762',
    qrSrc: '/attention-is-all-you-need-qr.png',
    description: 'Paper fundacional del Transformer.',
  },
  cvGenerator: {
    title: 'Generador de hojas de vida con IA',
    subtitle: 'Ejemplo de aplicación cotidiana',
    url: 'https://cv-ai-generator-rho.vercel.app/login',
    qrSrc: '/cv-generator-qr.png',
    description:
      'Tomas tu experiencia, la IA genera un CV. Ejemplo general de IA aplicada — no usa RAG.',
  },
}
