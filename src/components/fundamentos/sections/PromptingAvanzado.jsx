import SectionBlock from '../SectionBlock'
import ToolCallingCard from '../ToolCallingCard'
import { promptingContextCard } from '../../../data/fundamentosContent'
import PromptTemplateDiagram from '../diagrams/PromptTemplateDiagram'

function PromptingAvanzado() {
  return (
    <SectionBlock
      id="prompting"
      eyebrow="Comunicación"
      title="Prompting avanzado"
      diagram={<PromptTemplateDiagram />}
    >
      <p>
        Estructura tu prompt en cuatro bloques. Cuanto más específico seas, menos
        ambigüedad y mejor resultado.
      </p>
      <ToolCallingCard {...promptingContextCard} />
    </SectionBlock>
  )
}

export default PromptingAvanzado
