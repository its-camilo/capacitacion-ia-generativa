import { lazy, Suspense, useState } from 'react'
import InsightCard from '../fundamentos/InsightCard'
import RichText from './RichText'

// Las animaciones 3D cargan three.js (~800 kB): se piden bajo demanda, fuera del bundle principal.
const ANIMATIONS = {
  idea: lazy(() => import('./animations/IdeaAnimation')),
  practica1: lazy(() => import('./animations/Practica1Animation')),
  practica2: lazy(() => import('./animations/Practica2Animation')),
  practica3: lazy(() => import('./animations/Practica3Animation')),
  practica4: lazy(() => import('./animations/Practica4Animation')),
  practica5: lazy(() => import('./animations/Practica5Animation')),
  entregable: lazy(() => import('./animations/EntregableAnimation')),
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button className="prof-prompt__copy" type="button" onClick={copy}>
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  )
}

function Block({ block }) {
  switch (block.type) {
    case 'p':
      return <p><RichText text={block.text} /></p>

    case 'list':
      return (
        <ul className="practica-mcp__bullet-list">
          {block.items.map((item) => (
            <li key={item}><RichText text={item} /></li>
          ))}
        </ul>
      )

    case 'numbered':
      return (
        <ol className="practica-mcp__numbered">
          {block.items.map((item) => (
            <li key={item}><RichText text={item} /></li>
          ))}
        </ol>
      )

    case 'checklist':
      return (
        <ul className="prof-checklist">
          {block.items.map((item) => (
            <li key={item}>
              <span className="prof-checklist__box" aria-hidden="true" />
              <span><RichText text={item} /></span>
            </li>
          ))}
        </ul>
      )

    case 'table':
      return (
        <div className="prof-table-wrap">
          <table className="prof-table">
            <thead>
              <tr>
                {block.headers.map((header) => (
                  <th key={header} scope="col">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join('|')}>
                  {row.map((cell, index) => (
                    <td key={`${row[0]}-${index}`}><RichText text={cell} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'compare':
      return (
        <div className="prof-compare">
          {block.columns.map((column) => (
            <article
              className={`prof-compare__col prof-compare__col--${column.tone || 'neutral'}`}
              key={column.title}
            >
              <p className="prof-compare__tag">{column.tag}</p>
              <h3 className="prof-compare__title">{column.title}</h3>
              <ul>
                {column.items.map((item) => (
                  <li key={item}><RichText text={item} /></li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )

    case 'cards':
      return (
        <div className="prof-card-grid">
          {block.items.map((card) => {
            const content = (
              <>
                {card.tag && <span className="prof-card__tag">{card.tag}</span>}
                <h3 className="prof-card__title">{card.title}</h3>
                <p className="prof-card__description">{card.description}</p>
              </>
            )

            return card.url ? (
              <a
                className="prof-card prof-card--link"
                key={card.title}
                href={card.url}
                target="_blank"
                rel="noreferrer"
              >
                {content}
              </a>
            ) : (
              <div className="prof-card" key={card.title}>{content}</div>
            )
          })}
        </div>
      )

    case 'prompt':
      return (
        <figure className="prof-prompt">
          <figcaption className="prof-prompt__header">
            <span className="prof-prompt__label">{block.label}</span>
            <CopyButton text={block.text} />
          </figcaption>
          <pre className="prof-prompt__text">{block.text}</pre>
        </figure>
      )

    case 'callout':
      return (
        <aside className={`prof-callout prof-callout--${block.tone || 'ok'}`}>
          <p className="prof-callout__title">{block.title}</p>
          <p className="prof-callout__text"><RichText text={block.text} /></p>
        </aside>
      )

    case 'note':
      return <p className="practica-mcp__note"><RichText text={block.text} /></p>

    case 'insight':
      return (
        <InsightCard
          eyebrow={block.eyebrow}
          title={block.title}
          description={block.description}
          steps={block.steps}
        />
      )

    case 'links':
      return (
        <ul className="practica-mcp__links">
          {block.items.map((item) => (
            <li key={item.url}>
              <a href={item.url} target="_blank" rel="noreferrer">
                {item.provider && <span className="practica-mcp__link-provider">{item.provider}</span>}
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )

    case 'animation': {
      if (!Object.hasOwn(ANIMATIONS, block.animation)) return null
      const Animation = ANIMATIONS[block.animation]
      return (
        <Suspense fallback={null}>
          <Animation />
        </Suspense>
      )
    }

    default:
      return null
  }
}

function ProfesorBlocks({ blocks }) {
  return blocks.map((block, index) => <Block block={block} key={index} />)
}

export default ProfesorBlocks
