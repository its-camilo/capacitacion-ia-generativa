import RagAnimationCard from './RagAnimationCard'
import createEntregableScene, { ENTREGABLE_DURATION } from './entregableScene'

const STEPS = [
  { label: 'Pregunta', caption: 'Primera pieza: la pregunta que se le hizo al cuaderno.' },
  { label: 'Respuesta', caption: 'Segunda pieza: la respuesta, con su cita.' },
  { label: 'Fuente abierta', caption: 'Tercera pieza: la fuente abierta que respalda la cita.' },
  { label: 'El entregable', caption: 'Las tres piezas encajan y forman el entregable.' },
  { label: 'Probado con otra cuenta', caption: 'El enlace se prueba sin sesión y se marcan cuatro puntos.' },
]

// Primer fotograma: las tres piezas ya encajaron y forman el entregable.
const START_T = 0.72

function EntregableAnimation({ startT = START_T }) {
  return (
    <RagAnimationCard
      ariaLabel="Lo que se lleva: caen tres piezas, la pregunta, la respuesta con su cita y la fuente abierta, encajan para formar el entregable, y el enlace se prueba en una ventana sin sesión como estudiante mientras cuatro afirmaciones se marcan una a una"
      createScene={createEntregableScene}
      steps={STEPS}
      duration={ENTREGABLE_DURATION}
      startT={startT}
    />
  )
}

export default EntregableAnimation
