import { concepts } from '../../../data/fundamentosContent'
import ConceptRow from '../ConceptRow'
import SectionBlock from '../SectionBlock'
import { ConceptDiagram } from '../diagrams/ConceptDiagrams'

function ConceptosBasicos() {
  return (
    <SectionBlock id="conceptos" eyebrow="Vocabulario" title="Conceptos básicos">
      <p>Vocabulario mínimo para hablar de IA en el curso.</p>
      {concepts.map((concept) => (
        <ConceptRow
          key={concept.id}
          term={concept.term}
          definition={concept.definition}
          link={concept.link}
          diagram={<ConceptDiagram id={concept.id} />}
        />
      ))}
    </SectionBlock>
  )
}

export default ConceptosBasicos
