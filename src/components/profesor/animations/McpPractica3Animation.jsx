import RagAnimationCard from './RagAnimationCard'
import createMcpPractica3Scene, { MCP_PRACTICA3_DURATION } from './mcpPractica3Scene'

const STEPS = [
  { label: 'Datos y rúbrica', caption: 'Claude toma los datos de E04, E11 y E19 de la hoja y la rúbrica de su Drive.' },
  { label: 'Tres borradores', caption: 'Deja tres borradores en su Gmail, dirigidos a usted mismo.' },
  { label: 'Permitir una vez', caption: 'Claude pide permiso para «Create draft email»: elija Permitir una vez.' },
  { label: 'Revisar sin enviar', caption: 'Revise los tres en Gmail → Borradores: dato real, tono y acción concreta.' },
  { label: 'Nunca «Permitir siempre»', caption: 'Autorice crear borradores, no enviar. No envíe nada a estudiantes.' },
]

// Primer fotograma (y fotograma estático con reduced-motion): hoja y rúbrica con las tres filas resaltadas.
const START_T = 0.15

function McpPractica3Animation({ startT = START_T }) {
  return (
    <RagAnimationCard
      ariaLabel="Retroalimentación personalizada sin enviar: datos de E04, E11 y E19 de la hoja y la rúbrica, tres borradores en Gmail, autorizar Permitir una vez para crear borradores, revisar los tres sin enviar y nunca Permitir siempre para enviar"
      createScene={createMcpPractica3Scene}
      steps={STEPS}
      duration={MCP_PRACTICA3_DURATION}
      startT={startT}
    />
  )
}

export default McpPractica3Animation
