import SectionBlock from '../SectionBlock'
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
    </SectionBlock>
  )
}

export default PromptingAvanzado
