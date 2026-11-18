import RagAnimationCard from './RagAnimationCard'
import createMcpPractica1Scene, { MCP_PRACTICA1_DURATION } from './mcpPractica1Scene'

const STEPS = [
  { label: 'Entrar a claude.ai', caption: 'Entre a claude.ai con su cuenta @unal (Continuar con Google).' },
  { label: 'Drive y Gmail', caption: 'Active los conectores de Google Drive y Gmail.' },
  { label: 'Canva', caption: 'Conecte Canva con su cuenta de Canva; la gratuita sirve.' },
  { label: 'Abrir la hoja', caption: 'Abra la hoja de notas: 25 estudiantes ficticios, E01 a E25.' },
  { label: 'Hacer una copia', caption: 'Archivo → Hacer una copia: trabaje sobre la suya en su Drive.' },
]

// Primer fotograma (y fotograma estático con reduced-motion): conectores de Drive y Gmail ya activos.
const START_T = 0.37

function McpPractica1Animation({ startT = START_T }) {
  return (
    <RagAnimationCard
      ariaLabel="Activar los conectores y abrir la hoja: entrar a claude.ai con la cuenta @unal, activar Drive y Gmail, activar Canva, abrir la hoja de notas con 25 estudiantes ficticios y hacer una copia en su Drive"
      createScene={createMcpPractica1Scene}
      steps={STEPS}
      duration={MCP_PRACTICA1_DURATION}
      startT={startT}
    />
  )
}

export default McpPractica1Animation
