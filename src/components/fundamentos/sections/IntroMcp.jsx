import SectionBlock from '../SectionBlock'
import McpSqlDiagram from '../diagrams/McpSqlDiagram'

function IntroMcp() {
  return (
    <SectionBlock
      id="mcp"
      eyebrow="Herramientas"
      title="Introducción a MCP"
      diagram={<McpSqlDiagram />}
    >
      <p>
        MCP expone herramientas al modelo. Tú defines las reglas (por ejemplo consultas
        SQL); la IA decide cuándo usarlas según lo que le pides.
      </p>
    </SectionBlock>
  )
}

export default IntroMcp
