import Uifcito from '../Uifcito'

function SectionBlock({
  id,
  eyebrow,
  title,
  children,
  diagram,
  diagramFirst = false,
  afterDiagram,
  mascot,
}) {
  return (
    <section className="fund-section" id={id} aria-labelledby={`${id}-title`}>
      <div className={`fund-section__head${mascot ? ' fund-section__head--mascot' : ''}`}>
        <div className="fund-section__head-text">
          <p className="fund-section__eyebrow">{eyebrow}</p>
          <h2 className="fund-section__title" id={`${id}-title`}>
            {title}
          </h2>
        </div>
        {mascot && <Uifcito pose={mascot} />}
      </div>
      {diagramFirst && diagram && (
        <div className="fund-section__diagram fund-section__diagram--first">{diagram}</div>
      )}
      {children && <div className="fund-section__body">{children}</div>}
      {!diagramFirst && diagram && (
        <div className="fund-section__diagram">{diagram}</div>
      )}
      {afterDiagram && <div className="fund-section__after-diagram">{afterDiagram}</div>}
    </section>
  )
}

export default SectionBlock
