import { mcpToolCalling } from '../../../data/fundamentosContent'
import SectionBlock from '../SectionBlock'
import McpSqlDiagram from '../diagrams/McpSqlDiagram'
import ToolCallingCard from '../ToolCallingCard'

function IntroMcp() {
  return (
    <SectionBlock
      id="mcp"
      eyebrow="Herramientas"
      title="Introducción a MCP"
      diagram={<McpSqlDiagram />}
      afterDiagram={<ToolCallingCard {...mcpToolCalling} />}
    >
      <p>
        MCP expone herramientas al modelo. Tú defines las reglas (por ejemplo consultas
        SQL); la IA decide cuándo usarlas según lo que le pides.
      </p>
    </SectionBlock>
  )
}

export default IntroMcp
