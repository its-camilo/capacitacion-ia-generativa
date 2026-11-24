import RagAnimationCard from './RagAnimationCard'
import createAgentesIdeaScene, { AGENTES_IDEA_DURATION } from './agentesIdeaScene'

const STEPS = [
  { label: 'Chatbot responde', caption: 'Un chatbot responde texto que usted copia.' },
  { label: 'El agente planea', caption: 'El agente decide los pasos antes de actuar.' },
  { label: 'Usa herramientas', caption: 'Conectores en la nube, desde el celular.' },
  { label: 'Maneja el navegador', caption: 'Usa el navegador como lo haría una persona.' },
  { label: 'Ciclo con revisión', caption: 'Planear, ejecutar, revisar y volver a intentar; usted revisa.' },
]

// Primer fotograma (y fotograma estático con reduced-motion): el chatbot ya respondió y el texto sale para copiarse.
const START_T = 0.12

function AgentesIdeaAnimation() {
  return (
    <RagAnimationCard
      ariaLabel="De chatbot a agente, sin perder el control: un chatbot que solo responde texto, un agente que planea sus pasos y los va marcando, que usa conectores en la nube como Drive, Gmail y Canva desde el celular, que maneja el navegador con clics como una persona, y un ciclo de planear, ejecutar, revisar y volver a intentar donde usted revisa"
      createScene={createAgentesIdeaScene}
      steps={STEPS}
      duration={AGENTES_IDEA_DURATION}
      startT={START_T}
    />
  )
}

export default AgentesIdeaAnimation
