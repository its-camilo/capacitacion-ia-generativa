import { resources } from '../../../data/fundamentosContent'
import ResourceCard from '../ResourceCard'
import SectionBlock from '../SectionBlock'
import RagDiagram from '../diagrams/RagDiagram'

function IntroRag() {
  return (
    <SectionBlock id="rag" eyebrow="Conocimiento" title="Introducción a RAG">
      <p>
        El contexto del chat es limitado: si subes muchos PDFs de golpe, se llena, cuesta
        más y la respuesta empeora.
      </p>
      <p>
        RAG guarda los documentos en una base especial, recupera solo los trozos
        relevantes y se los pasa al modelo. Más eficiente para mucha documentación.
      </p>
      <div className="fund-section__diagram fund-section__diagram--inline">
        <RagDiagram />
      </div>
      <ResourceCard {...resources.cvGenerator} />
    </SectionBlock>
  )
}

export default IntroRag
