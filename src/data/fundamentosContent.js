export const sectionNav = [
  { id: 'historia', label: 'Historia de la computación' },
  { id: 'conceptos', label: 'Conceptos básicos' },
  { id: 'prompting', label: 'Prompting avanzado' },
  { id: 'skills', label: 'Skills' },
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
    link: {
      label: 'Ollama Portable',
      url: 'https://github.com/ekhos-ai/ollama-portable',
    },
  },
  {
    id: 'harness',
    term: 'Harness',
    definition:
      'Capa que opera el modelo: conecta herramientas, reglas y memoria (Cursor, LangGraph…).',
  },
]

export const officialSkillRepos = [
  {
    id: 'anthropic-skills',
    provider: 'Anthropic',
    title: 'anthropics/skills',
    description:
      'Skills oficiales para Claude: documentos (PDF, Word, Excel, PowerPoint), flujos técnicos y plantillas del estándar Agent Skills.',
    url: 'https://github.com/anthropics/skills',
  },
  {
    id: 'openai-skills',
    provider: 'OpenAI',
    title: 'openai/skills',
    description:
      'Catálogo de skills para Codex: instrucciones reutilizables, scripts y recursos organizados en carpetas con SKILL.md.',
    url: 'https://github.com/openai/skills',
  },
  {
    id: 'openai-plugins',
    provider: 'OpenAI',
    title: 'openai/plugins',
    description:
      'Repositorio actual de plugins y skills distribuibles para Codex y ChatGPT, con guías para empaquetar workflows reutilizables.',
    url: 'https://github.com/openai/plugins',
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

export const mcpToolCalling = {
  title: 'Tool calling',
  description:
    'En MCP, una tool es una función que el servidor expone al modelo: tiene nombre, descripción y parámetros. El LLM elige cuándo invocarla; el servidor la ejecuta y devuelve el resultado. Ese ciclo —decidir, llamar, responder— es el tool calling.',
  links: [
    {
      id: 'opencode-tools',
      provider: 'OpenCode',
      label: 'Tools integradas',
      url: 'https://opencode.ai/docs/tools/',
    },
    {
      id: 'opencode-mcp',
      provider: 'OpenCode',
      label: 'Servidores MCP',
      url: 'https://opencode.ai/v2/docs/mcp-servers',
    },
    {
      id: 'anthropic-mcp',
      provider: 'Anthropic',
      label: 'MCP connector (Claude API)',
      url: 'https://platform.claude.com/docs/en/agents-and-tools/mcp-connector',
    },
    {
      id: 'openai-tools',
      provider: 'OpenAI',
      label: 'Using tools',
      url: 'https://developers.openai.com/api/docs/guides/tools',
    },
    {
      id: 'openai-mcp',
      provider: 'OpenAI',
      label: 'MCP y conectores',
      url: 'https://developers.openai.com/api/docs/guides/tools-connectors-mcp',
    },
  ],
}

export const ragConcepts = [
  {
    id: 'chunk',
    term: 'Chunk',
    definition:
      'Fragmento de texto en el que se divide un documento antes de vectorizarlo. En RAG, cada chunk se convierte en un vector; al preguntar, se recuperan los chunks más similares y se pasan al modelo como contexto.',
  },
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
