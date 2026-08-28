import { promptBlocks } from '../../../data/fundamentosContent'
import ArrowDefs from './ArrowDefs'

function PromptTemplateDiagram() {
  const blockHeight = 62
  const gap = 14
  const width = 280
  const totalHeight = promptBlocks.length * blockHeight + (promptBlocks.length - 1) * gap + 36

  return (
    <svg
      className="diagram-svg diagram-svg--vertical"
      viewBox={`0 0 ${width} ${totalHeight}`}
      role="img"
      aria-label="Plantilla de prompt en vertical"
    >
      <ArrowDefs id="prompt-arrow" />
      {promptBlocks.map((block, index) => {
        const y = index * (blockHeight + gap)
        return (
          <g key={block.label}>
            <rect
              x="20"
              y={y}
              width={width - 40}
              height={blockHeight}
              rx="8"
              className="diagram-box diagram-box--accent diagram-pulse"
              style={{ '--pulse-delay': `${index * 0.4}s` }}
            />
            <text x="36" y={y + 22} className="diagram-label diagram-label--title">
              {block.label}
            </text>
            <text x="36" y={y + 40} className="diagram-label">
              {block.hint}
            </text>
            {index < promptBlocks.length - 1 && (
              <line
                x1={width / 2}
                y1={y + blockHeight + 1}
                x2={width / 2}
                y2={y + blockHeight + gap - 1}
                className="diagram-arrow diagram-arrow--animated"
                markerEnd="url(#prompt-arrow)"
              />
            )}
          </g>
        )
      })}
      <text x={width / 2} y={totalHeight - 8} textAnchor="middle" className="diagram-label diagram-label--accent">
        Más específico → mejor resultado
      </text>
    </svg>
  )
}

export default PromptTemplateDiagram
