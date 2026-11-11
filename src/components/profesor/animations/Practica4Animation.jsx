import RagAnimationCard from './RagAnimationCard'
import createPractica4Scene, { PRACTICA4_DURATION } from './practica4Scene'

const STEPS = [
  { label: 'Las mismas fuentes', caption: 'Partimos de las mismas fuentes del cuaderno.' },
  { label: 'Se transforman', caption: 'De las fuentes brotan seis salidas distintas.' },
  { label: 'Audio y video primero', caption: 'Audio y video salen primero: tardan más de 10 min.' },
  { label: 'En paralelo', caption: 'Las demás salidas se generan en paralelo.' },
  { label: 'Revisar antes de compartir', caption: 'Se revisa el informe: aquí suavizó una contradicción.' },
]

// Primer fotograma: las seis salidas ya brotaron de las fuentes.
const START_T = 0.36

function Practica4Animation({ startT = START_T }) {
  return (
    <RagAnimationCard
      ariaLabel="Convertirlo en material de estudio: las mismas fuentes se transforman en informe, mapa mental, tarjetas, cuestionario, audio y video, el audio y el video tardan más de diez minutos mientras las demás salidas se generan en paralelo, y una lupa revisa el informe y marca una contradicción suavizada"
      createScene={createPractica4Scene}
      steps={STEPS}
      duration={PRACTICA4_DURATION}
      startT={startT}
    />
  )
}

export default Practica4Animation
