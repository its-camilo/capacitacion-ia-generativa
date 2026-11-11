import RagAnimationCard from './RagAnimationCard'
import createPractica1Scene, { PRACTICA1_DURATION } from './practica1Scene'

const STEPS = [
  { label: 'Archivos sueltos', caption: 'Archivos sueltos, con nombres confusos.' },
  { label: 'Se renombran solos', caption: 'Cada uno recibe un nombre claro.' },
  { label: 'Caen en su lugar', caption: 'Quedan en fila dentro del cuaderno.' },
  { label: 'PDF escaneado', caption: 'Un PDF escaneado es una foto: sin texto.' },
  { label: 'Cobertura completa', caption: 'El programa queda cubierto, menos un tema.' },
]

// Primer fotograma: nombres ya renombrados en la fila del cuaderno.
const START_T = 0.58

function Practica1Animation({ startT = START_T }) {
  return (
    <RagAnimationCard
      ariaLabel="Reunir y nombrar las fuentes: archivos sueltos que se renombran y se ordenan en el cuaderno, un PDF escaneado que no se puede buscar y un mapa del programa con un tema sin cubrir"
      createScene={createPractica1Scene}
      steps={STEPS}
      duration={PRACTICA1_DURATION}
      startT={startT}
    />
  )
}

export default Practica1Animation
