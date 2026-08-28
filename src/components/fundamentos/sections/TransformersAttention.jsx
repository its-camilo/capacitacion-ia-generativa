import { resources } from '../../../data/fundamentosContent'
import DiagramCard from '../DiagramCard'
import ResourceCard from '../ResourceCard'
import SectionBlock from '../SectionBlock'
import {
  AttentionOverviewDiagram,
  GenerationEvolutionDiagram,
  GpuParallelDiagram,
  MatrixSearchDiagram,
  PromptSpecificityDiagram,
  TranslationDiagram,
} from '../diagrams/TransformerDiagrams'

function TransformersAttention() {
  return (
    <SectionBlock id="transformers" eyebrow="Arquitectura" title="Transformers">
      <p>
        En 2017, <em>Attention Is All You Need</em> propuso una forma nueva de procesar
        texto que hoy usan casi todos los modelos.
      </p>
      <div className="diagram-stack">
        <DiagramCard caption="Procesa todo en paralelo → entrena en varias GPUs" delay={0}>
          <GpuParallelDiagram />
        </DiagramCard>
        <DiagramCard caption="Primero se probó traduciendo inglés → alemán" delay={80}>
          <TranslationDiagram />
        </DiagramCard>
        <DiagramCard caption="Luego vieron que podía ir más allá de traducir" delay={160}>
          <GenerationEvolutionDiagram />
        </DiagramCard>
        <DiagramCard caption="Cada token mira a los demás al mismo tiempo" delay={240}>
          <AttentionOverviewDiagram />
        </DiagramCard>
        <DiagramCard
          caption="Matrices = búsqueda tipo diccionario (clave → valor)"
          delay={320}
        >
          <MatrixSearchDiagram />
        </DiagramCard>
        <DiagramCard caption="Prompt más específico = búsqueda más precisa" delay={400}>
          <PromptSpecificityDiagram />
        </DiagramCard>
      </div>
      <ResourceCard {...resources.attentionPaper} />
    </SectionBlock>
  )
}

export default TransformersAttention
