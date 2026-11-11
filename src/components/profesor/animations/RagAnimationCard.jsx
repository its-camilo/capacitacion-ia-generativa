import { useState } from 'react'
import RagLoop from './RagLoop'
import '../../../styles/rag-animations.css'

/**
 * Card independiente para una animación 3D en loop: escena + pills de pasos +
 * una línea de caption. Sin controles; el paso activo lo marca la propia escena.
 */
function RagAnimationCard({ ariaLabel, createScene, steps, duration = 16, startT = 0 }) {
  const [phase, setPhase] = useState(0)
  const current = steps[Math.min(phase, steps.length - 1)]

  return (
    <figure className="rag-anim">
      <div className="rag-anim__stage">
        <RagLoop
          createScene={createScene}
          duration={duration}
          phaseCount={steps.length}
          startT={startT}
          onPhaseChange={setPhase}
          ariaLabel={ariaLabel}
        />
      </div>

      <ol className="rag-anim__steps">
        {steps.map((step, index) => (
          <li
            key={step.label}
            className={`rag-anim__pill${index === phase ? ' rag-anim__pill--active' : ''}`}
            aria-current={index === phase ? 'step' : undefined}
            aria-label={step.label}
          >
            <span className="rag-anim__pill-num">{index + 1}</span>
            <span className="rag-anim__pill-label">{step.label}</span>
          </li>
        ))}
      </ol>

      <p className="rag-anim__caption" key={phase}>
        {current.caption}
      </p>
    </figure>
  )
}

export default RagAnimationCard
