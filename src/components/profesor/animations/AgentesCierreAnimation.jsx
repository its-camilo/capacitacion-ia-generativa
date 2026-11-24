import RagAnimationCard from './RagAnimationCard'
import createAgentesCierreScene, { AGENTES_CIERRE_DURATION } from './agentesCierreScene'

const STEPS = [
  { label: 'Detector', caption: 'Da probabilidades, no pruebas.' },
  { label: 'Sin sanción', caption: 'Un porcentaje no sostiene una sanción.' },
  { label: 'Pedir proceso', caption: 'Borradores, bitácora y defensa oral.' },
  { label: 'Reglas claras', caption: 'Qué se permite, qué se cita y qué se evalúa.' },
  { label: 'Conversación', caption: 'Evalúe con una conversación, no con un porcentaje.' },
]

// Primer fotograma (y fotograma estático con reduced-motion): la aguja del detector ya marca 72 %.
const START_T = 0.12

function AgentesCierreAnimation() {
  return (
    <RagAnimationCard
      ariaLabel="IA y evaluación, lo que no se puede delegar: un detector marca 72 por ciento, que es una probabilidad y no una prueba; ese porcentaje no sostiene una sanción; la tarea pide proceso con borrador, bitácora y defensa oral; el programa declara qué se permite, qué se cita y qué se evalúa; y la evaluación se hace con una conversación entre docente y estudiante, no con un porcentaje"
      createScene={createAgentesCierreScene}
      steps={STEPS}
      duration={AGENTES_CIERRE_DURATION}
      startT={START_T}
    />
  )
}

export default AgentesCierreAnimation
