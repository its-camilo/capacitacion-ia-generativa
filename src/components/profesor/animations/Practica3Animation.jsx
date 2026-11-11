import RagAnimationCard from './RagAnimationCard'
import createPractica3Scene, { PRACTICA3_DURATION } from './practica3Scene'

const STEPS = [
  { label: 'La pregunta', caption: 'Una pregunta: ¿quién paga un impuesto?' },
  { label: 'La cita se abre', caption: 'Cada frase abre el fragmento exacto de su fuente.' },
  { label: 'Contradicción', caption: 'Dos lecturas distintas chocan en el centro.' },
  { label: 'El hueco', caption: 'Un tema queda sin fuente: ese es el hueco.' },
  { label: 'Verificar siempre', caption: 'Solo las citas comprobadas llevan sello.' },
]

// Primer fotograma: respuesta con la cita [1] abierta y resaltada.
const START_T = 0.32

function Practica3Animation({ startT = START_T }) {
  return (
    <RagAnimationCard
      ariaLabel="Preguntar con citas y buscar huecos: una pregunta flota, cada frase de la respuesta abre el fragmento exacto de su fuente y una cita que no respalda sale en rojo, dos lecturas contradictorias chocan, un tema del programa queda sin fuente y las citas comprobadas reciben un sello de verificación"
      createScene={createPractica3Scene}
      steps={STEPS}
      duration={PRACTICA3_DURATION}
      startT={startT}
    />
  )
}

export default Practica3Animation
