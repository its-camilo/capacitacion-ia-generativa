function McpSqlDiagram() {
  return (
    <div className="flow-diagram" role="img" aria-label="Flujo MCP con consultas SQL">
      <p className="flow-diagram__title">Antes: tú escribes el SQL</p>
      <div className="flow-diagram__row">
        <span className="flow-node">Tú</span>
        <span className="flow-diagram__arrow" aria-hidden="true" />
        <span className="flow-node flow-node--accent">SQL</span>
        <span className="flow-diagram__arrow" aria-hidden="true" />
        <span className="flow-node">BD</span>
      </div>

      <p className="flow-diagram__title">Con MCP</p>
      <div className="flow-diagram__row">
        <span className="flow-node">Tú</span>
        <span className="flow-diagram__arrow" aria-hidden="true" />
        <span className="flow-node">
          Lenguaje
          <br />
          natural
        </span>
        <span className="flow-diagram__arrow" aria-hidden="true" />
        <span className="flow-node flow-node--accent">LLM</span>
        <span className="flow-diagram__arrow" aria-hidden="true" />
        <span className="flow-node flow-node--accent">MCP</span>
        <span className="flow-diagram__arrow" aria-hidden="true" />
        <span className="flow-node">
          SQL
          <br />
          + BD
        </span>
      </div>

      <p className="flow-diagram__caption">
        MCP = reglas para que la IA use herramientas
      </p>
    </div>
  )
}

export default McpSqlDiagram
