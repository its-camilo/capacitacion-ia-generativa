import SectionBlock from '../SectionBlock'
import TimelineDiagram from '../diagrams/TimelineDiagram'

function HistoriaComputacion() {
  return (
    <SectionBlock
      id="historia"
      eyebrow="Origen"
      title="De la computación a la IA generativa"
      diagram={<TimelineDiagram />}
      diagramFirst
    />
  )
}

export default HistoriaComputacion
