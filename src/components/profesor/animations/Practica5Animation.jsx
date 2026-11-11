import RagAnimationCard from './RagAnimationCard'
import createPractica5Scene, { PRACTICA5_DURATION } from './practica5Scene'

const STEPS = [
  { label: 'Dos pantallas', caption: 'El profe lo ve todo; el estudiante, nada aún.' },
  { label: 'Compartir', caption: 'Al compartir, el estudiante ve fuentes, chat y salidas.' },
  { label: 'Solo chat no existe', caption: 'No existe un modo «solo chat»: el interruptor rebota.' },
  { label: 'Todo el dominio no existe', caption: 'Tampoco existe compartir con todo el dominio.' },
  { label: 'Enlace a Moodle', caption: 'El enlace de vista de conversación llega a Moodle.' },
]

// Primer fotograma: ya se compartió y la pantalla del estudiante está encendida.
const START_T = 0.37

function Practica5Animation({ startT = START_T }) {
  return (
    <RagAnimationCard
      ariaLabel="Compartirlo como tutor: dos pantallas lado a lado, la del profesor con todo y la del estudiante apagada; al compartir la del estudiante se enciende con fuentes, chat y salidas; los interruptores «solo chat» y «todo el dominio» rebotan y se apagan porque no existen; y el enlace a la vista de conversación llega a Moodle"
      createScene={createPractica5Scene}
      steps={STEPS}
      duration={PRACTICA5_DURATION}
      startT={startT}
    />
  )
}

export default Practica5Animation
