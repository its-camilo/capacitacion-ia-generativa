export const phases = [
  {
    key: 'fundamentos',
    path: '/fundamentos',
    label: 'Fundamentos',
    session: '01',
    tag: 'Base teórica',
  },
  {
    key: 'mcp',
    path: '/practica-mcp',
    label: 'Práctica MCP',
    session: '02',
    tag: 'Conectores',
  },
  {
    key: 'rag',
    path: '/practica-rag',
    label: 'Práctica RAG',
    session: '03',
    tag: 'Recuperación',
  },
  {
    key: 'agentes',
    path: '/practica-agentes',
    label: 'Práctica Agentes',
    session: '04',
    tag: 'Despliegue',
  },
]

export const professorPhases = [
  phases[0],
  { ...phases[2], path: '/rag', label: 'RAG', session: '02' },
  { ...phases[1], path: '/mcp', label: 'MCP', session: '03' },
  { ...phases[3], path: '/agentes', label: 'Agentes', session: '04' },
]
