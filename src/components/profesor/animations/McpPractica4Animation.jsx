import RagAnimationCard from './RagAnimationCard'
import createMcpPractica4Scene, { MCP_PRACTICA4_DURATION } from './mcpPractica4Scene'

const STEPS = [
  { label: 'Esquema con Gemini', caption: 'Dentro del documento de apuntes, Gemini propone el esquema de 5 diapositivas.' },
  { label: 'Vía 1: PowerPoint', caption: 'Claude entrega un archivo PowerPoint descargable.' },
  { label: 'Vía 2: Canva', caption: 'Claude deja un diseño editable en Canva: ajuste textos e imágenes y descargue.' },
  { label: 'Cinco diapositivas', caption: 'Una idea por diapositiva; la última cierra con una actividad de 5 minutos.' },
  { label: 'Revisar contra los apuntes', caption: 'Compruebe que los datos coincidan con los apuntes y pruébelo en el proyector.' },
]

// Primer fotograma (y fotograma estático con reduced-motion): apuntes y esquema de Gemini con las cinco filas.
const START_T = 0.15

function McpPractica4Animation({ startT = START_T }) {
  return (
    <RagAnimationCard
      ariaLabel="De apuntes a presentación de clase: esquema con Gemini dentro del documento, Vía 1 archivo PowerPoint que entrega Claude, Vía 2 diseño editable en Canva, cinco diapositivas con una idea cada una y actividad de 5 minutos al final, y revisión de que los datos coincidan con los apuntes"
      createScene={createMcpPractica4Scene}
      steps={STEPS}
      duration={MCP_PRACTICA4_DURATION}
      startT={startT}
    />
  )
}

export default McpPractica4Animation
