import RagAnimationCard from './RagAnimationCard'
import createIdeaScene, { IDEA_DURATION } from './ideaScene'

const STEPS = [
  { label: 'Tus fuentes', caption: 'Tus documentos son la base.' },
  { label: 'Fragmentos', caption: 'Se cortan en fragmentos.' },
  { label: 'Vectores', caption: 'Cada fragmento se vuelve un vector.' },
  { label: 'Tu pregunta busca', caption: 'Tu pregunta busca los más cercanos.' },
  { label: 'Respuesta con cita', caption: 'La respuesta cita sus fuentes.' },
]

// Primer fotograma (y fotograma estático con reduced-motion): documentos ya abiertos en abanico.
const START_T = 0.075

function IdeaAnimation() {
  return (
    <RagAnimationCard
      ariaLabel="El viaje de una pregunta: tus fuentes, fragmentos, vectores, la pregunta que busca y la respuesta con cita"
      createScene={createIdeaScene}
      steps={STEPS}
      duration={IDEA_DURATION}
      startT={START_T}
    />
  )
}

export default IdeaAnimation
