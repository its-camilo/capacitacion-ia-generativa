import { optimizationTips, tokenTips } from '../../../data/fundamentosContent'
import DiagramCard from '../DiagramCard'
import InsightCard from '../InsightCard'
import SectionBlock from '../SectionBlock'
import {
  CacheDiagram,
  ContextWindowDiagram,
  SeparateChatsDiagram,
  TokenUnitDiagram,
} from '../diagrams/TokenDiagrams'

function TokensCostos() {
  return (
    <SectionBlock id="tokens" eyebrow="Eficiencia" title="Tokens y optimización de costos">
      <p>
        El modelo lee y cobra por <strong>tokens</strong> (pedazos de texto). Gestiona
        la ventana de contexto y el gasto con estas ideas:
      </p>
      <ul className="tip-list tip-list--compact">
        {tokenTips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
      <InsightCard {...optimizationTips} />
      <div className="diagram-stack">
        <DiagramCard caption="El texto se divide en tokens" delay={0}>
          <TokenUnitDiagram />
        </DiagramCard>
        <DiagramCard caption="Instrucciones fijas → caché más barata" delay={80}>
          <CacheDiagram />
        </DiagramCard>
        <DiagramCard caption="Ventana llena → calidad baja" delay={160}>
          <ContextWindowDiagram />
        </DiagramCard>
        <DiagramCard caption="Un chat por tarea" delay={240}>
          <SeparateChatsDiagram />
        </DiagramCard>
      </div>
    </SectionBlock>
  )
}

export default TokensCostos
