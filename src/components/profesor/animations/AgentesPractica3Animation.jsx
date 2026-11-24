import RagAnimationCard from './RagAnimationCard'
import createAgentesPractica3Scene, { AGENTES_PRACTICA3_DURATION } from './agentesPractica3Scene'

const STEPS = [
  { label: 'Pegar los enlaces', caption: 'La hoja de reflexiones y la rúbrica, en el chat de Hark.' },
  { label: 'Formulario y hoja', caption: 'Hark reutiliza el formulario con las 6 preguntas.' },
  { label: 'Cinco borradores', caption: 'Uno por fila, dirigidos a usted mismo.' },
  { label: 'Revisar', caption: 'Los [verificar] en E15 y E19; la rúbrica puede faltar.' },
  { label: 'Nada se envía', caption: 'Borradores en el Gmail @unal; cambie de cuenta para verlos.' },
]

// Primer fotograma (y fotograma estático con reduced-motion): los dos enlaces entrando al chat de Hark.
const START_T = 0.12

function AgentesPractica3Animation({ startT = START_T }) {
  return (
    <RagAnimationCard
      ariaLabel="Flujo de retroalimentación con un agente, Hark: se pegan en el chat de Hark los enlaces de la hoja S4-01 Respuestas ficticias de reflexión y de la rúbrica 04 Rúbrica de desarrollo; Hark reutiliza el formulario Reflexión de unidad, con sus 6 preguntas, en vez de crear uno nuevo y conecta la hoja de respuestas; escribe 5 borradores en Gmail, uno por fila, para E03, E08, E15, E19 y E21, dirigidos a usted mismo; en la revisión aparecen marcas [verificar] en E15, sin logro ni enlace válido, y en E19, con el menos 0,4 reconstruido, y un aviso de que la rúbrica puede no haberse usado; los borradores quedan en el Gmail de la cuenta @unal, nada se envía y hay que cambiar de cuenta en Gmail para verlos"
      createScene={createAgentesPractica3Scene}
      steps={STEPS}
      duration={AGENTES_PRACTICA3_DURATION}
      startT={startT}
    />
  )
}

export default AgentesPractica3Animation
