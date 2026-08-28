import { timelineSteps } from '../../../data/fundamentosContent'
import ArrowDefs from './ArrowDefs'

function TimelineDiagram() {
  const stepHeight = 76
  const gap = 12
  const width = 300
  const totalHeight = timelineSteps.length * stepHeight + (timelineSteps.length - 1) * gap

  return (
    <svg
      className="diagram-svg diagram-svg--vertical"
      viewBox={`0 0 ${width} ${totalHeight}`}
      role="img"
      aria-label="Evolución vertical de la computación hacia la IA generativa"
    >
      <ArrowDefs />
      <line
        x1="28"
        y1="24"
        x2="28"
        y2={totalHeight - 24}
        stroke="rgba(203,213,225,0.25)"
        strokeWidth="2"
      />
      {timelineSteps.map((step, index) => {
        const y = index * (stepHeight + gap)
        const isLast = index === timelineSteps.length - 1
        return (
          <g key={step.label} className="timeline-step" style={{ '--step-i': index }}>
            <circle
              className="timeline-step__dot"
              cx="28"
              cy={y + 28}
              r="6"
              fill={isLast ? 'var(--color-amber)' : 'var(--color-signal)'}
            />
            <rect
              x="52"
              y={y}
              width={width - 60}
              height={stepHeight - 8}
              rx="8"
              className={`diagram-box${isLast ? ' diagram-box--accent' : ''}`}
            />
            <text x="68" y={y + 28} className="diagram-label diagram-label--title">
              {step.label}
            </text>
            <text x="68" y={y + 48} className="diagram-label">
              {step.detail}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default TimelineDiagram
