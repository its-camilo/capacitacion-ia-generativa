import RagAnimationCard from './RagAnimationCard'
import createMcpPractica5Scene, { MCP_PRACTICA5_DURATION } from './mcpPractica5Scene'

const STEPS = [
  { label: 'Revisar conectores', caption: 'En Claude, abra Configuración → Conectores y revise qué quedó conectado.' },
  { label: 'Desconectar Gmail y Canva', caption: 'Si no los va a seguir usando, desconecte Gmail y Canva.' },
  { label: 'Drive solo si se necesita', caption: 'Deje Drive conectado únicamente si lo necesita.' },
  { label: 'Borrar borradores', caption: 'Borre de Gmail los borradores de prueba.' },
  { label: 'Borrar la copia', caption: 'Borre de Drive su copia de la hoja.' },
]

// Primer fotograma (y fotograma estático con reduced-motion): lista de conectores con el barrido de revisión.
const START_T = 0.1

function McpPractica5Animation({ startT = START_T }) {
  return (
    <RagAnimationCard
      ariaLabel="Revisar permisos y desconectar: revisar en Configuración, Conectores qué quedó conectado, desconectar Gmail y Canva, dejar Drive solo si se necesita, borrar los borradores de prueba de Gmail y borrar la copia de la hoja en Drive"
      createScene={createMcpPractica5Scene}
      steps={STEPS}
      duration={MCP_PRACTICA5_DURATION}
      startT={startT}
    />
  )
}

export default McpPractica5Animation
