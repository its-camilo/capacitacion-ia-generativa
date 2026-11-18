import RagAnimationCard from './RagAnimationCard'
import createMcpIdeaScene, { MCP_IDEA_DURATION } from './mcpIdeaScene'

const STEPS = [
  { label: 'Chat aparte', caption: 'El chat vive en otra pestaña: usted copia, pega y vuelve.' },
  { label: 'IA en la herramienta', caption: 'La IA trabaja dentro del documento que ya tiene abierto.' },
  { label: 'Conectores', caption: 'Los conectores la acercan a Drive, Gmail y Canva.' },
  { label: 'El permiso es el riesgo', caption: 'Un conector ve todo lo que su cuenta ve.' },
  { label: 'Usted autoriza', caption: 'La IA actúa solo si usted autoriza; el borrador lo revisa usted.' },
]

// Primer fotograma (y fotograma estático con reduced-motion): chat y documento con el copiar y pegar en curso.
const START_T = 0.12

function McpIdeaAnimation() {
  return (
    <RagAnimationCard
      ariaLabel="De la pestaña del chat a la herramienta donde ya trabaja: un chat aparte con copiar y pegar, la IA integrada en el documento, los conectores de Drive, Gmail y Canva, el permiso como riesgo y la IA que actúa solo si usted autoriza"
      createScene={createMcpIdeaScene}
      steps={STEPS}
      duration={MCP_IDEA_DURATION}
      startT={START_T}
    />
  )
}

export default McpIdeaAnimation
