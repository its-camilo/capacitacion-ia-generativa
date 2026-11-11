import RagAnimationCard from './RagAnimationCard'
import createPractica2Scene, { PRACTICA2_DURATION } from './practica2Scene'

const STEPS = [
  { label: 'Añadir fuente', caption: 'En el cuaderno nuevo: Añadir fuente.' },
  { label: 'Desde Drive', caption: 'Los cinco archivos salen de Drive.' },
  { label: 'Procesando', caption: 'Cada archivo se procesa por separado.' },
  { label: '5 fuentes', caption: 'Cinco fuentes y el cuaderno listo.' },
  { label: 'Un cuaderno por curso', caption: 'Un cuaderno por curso: cada cita, a su color.' },
]

// Primer fotograma: chips cargados en la ventana, antes de cerrar la tapa.
const START_T = 0.58

function Practica2Animation({ startT = START_T }) {
  return (
    <RagAnimationCard
      ariaLabel="Crear el cuaderno y cargar: se pulsa Añadir fuente, cinco archivos salen de Drive y se procesan, el cuaderno queda con cinco fuentes y tres cursos mezclados se separan en un cuaderno por curso"
      createScene={createPractica2Scene}
      steps={STEPS}
      duration={PRACTICA2_DURATION}
      startT={startT}
    />
  )
}

export default Practica2Animation
