import RagAnimationCard from './RagAnimationCard'
import createAgentesExploracionScene, { AGENTES_EXPLORACION_DURATION } from './agentesExploracionScene'

const STEPS = [
  { label: 'Hark no es el único', caption: 'Cada empresa grande ya tiene el suyo.' },
  { label: 'Siete logos', caption: 'Muse, Grok Bot, Hermes, Dots, Duet, Gemini Tasks e Instinct.' },
  { label: 'En la nube', caption: 'Todos viven en la nube y se escriben desde el celular.' },
  { label: 'Un mapa', caption: 'Las fichas se ordenan como un mapa del panorama.' },
  { label: 'Mirar, no tarea', caption: 'Mírelos como un mapa, no como una tarea.' },
]

// Primer fotograma (y fotograma estático con reduced-motion): Hark al centro y las primeras fichas apareciendo.
const START_T = 0.12

function AgentesExploracionAnimation() {
  return (
    <RagAnimationCard
      ariaLabel="Otras alternativas para explorar: la ficha de Hark al centro y, alrededor, los logos de otros agentes; las siete fichas con su logo y nombre (Muse, Grok Bot, Hermes Agent, OpenAI Dots, Claude Duet, Gemini Tasks e Instinct) orbitan alrededor de un celular y una nube, luego se ordenan en una fila como un mapa del panorama, con el mensaje de mirarlos como un mapa y no como una tarea"
      createScene={createAgentesExploracionScene}
      steps={STEPS}
      duration={AGENTES_EXPLORACION_DURATION}
      startT={START_T}
    />
  )
}

export default AgentesExploracionAnimation
