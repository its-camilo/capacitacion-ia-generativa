import RagAnimationCard from './RagAnimationCard'
import createMcpEntregableScene, { MCP_ENTREGABLE_DURATION } from './mcpEntregableScene'

const STEPS = [
  { label: 'Hoja analizada', caption: 'La hoja de notas ficticia, con gráfico (3,61 y 3,44) y la lista de riesgo: E09, E11, E15 y E25.' },
  { label: 'Tres borradores', caption: 'Tres borradores revisados y no enviados.' },
  { label: 'Presentación en PDF', caption: 'La presentación de 5 diapositivas, exportada a PDF.' },
  { label: 'Nota de una página', caption: 'Qué suite usó, qué licencia tiene y qué haría si no la tuviera.' },
  { label: 'Verificación', caption: 'Promedios y gráfico coinciden, correos sin datos inventados, datos ficticios y conector revocable.' },
]

// Primer fotograma (y fotograma estático con reduced-motion): hoja, gráfico con ambos promedios y lista de riesgo.
const START_T = 0.17

function McpEntregableAnimation({ startT = START_T }) {
  return (
    <RagAnimationCard
      ariaLabel="Lo que se lleva: hoja analizada con gráfico y lista de riesgo, tres borradores revisados y no enviados, presentación de cinco diapositivas exportada a PDF, nota de una página con suite, licencia y plan sin ella, y verificación final"
      createScene={createMcpEntregableScene}
      steps={STEPS}
      duration={MCP_ENTREGABLE_DURATION}
      startT={startT}
    />
  )
}

export default McpEntregableAnimation
