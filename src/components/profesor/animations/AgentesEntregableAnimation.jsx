import RagAnimationCard from './RagAnimationCard'
import createAgentesEntregableScene, { AGENTES_ENTREGABLE_DURATION } from './agentesEntregableScene'

const STEPS = [
  { label: 'Elegir camino', caption: 'Una app de quiz o un flujo automatizado.' },
  { label: 'Artefacto de Claude', caption: 'El enlace al quiz en vivo.' },
  { label: 'El formulario', caption: 'Reflexión de unidad, con sus 6 preguntas.' },
  { label: 'Hark trabajando', caption: 'Un pantallazo del flujo en construcción.' },
  { label: 'Tres entregables', caption: 'Enlace, formulario y pantallazo, más la demo de 2 minutos.' },
]

// Primer fotograma (y fotograma estático con reduced-motion): las dos tarjetas de camino ya conectadas a la mesa.
const START_T = 0.12

function AgentesEntregableAnimation() {
  return (
    <RagAnimationCard
      ariaLabel="El piloto y su ficha: cada mesa elige un camino entre una app de quiz y un flujo automatizado; el Camino A entrega el enlace al artefacto de Claude con el Quiz en vivo: Oferta, demanda y equilibrio; el Camino B entrega el formulario Reflexión de unidad con sus 6 preguntas y un pantallazo de Hark construyendo el flujo con el formulario, la hoja y los borradores; al final, los tres entregables juntos y la demo de 2 minutos"
      createScene={createAgentesEntregableScene}
      steps={STEPS}
      duration={AGENTES_ENTREGABLE_DURATION}
      startT={START_T}
    />
  )
}

export default AgentesEntregableAnimation
