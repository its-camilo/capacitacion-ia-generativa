import { useEffect, useState } from 'react'
import { sectionNav } from '../../data/fundamentosContent'
import HistoriaComputacion from './sections/HistoriaComputacion'
import ConceptosBasicos from './sections/ConceptosBasicos'
import PromptingAvanzado from './sections/PromptingAvanzado'
import TokensCostos from './sections/TokensCostos'
import TransformersAttention from './sections/TransformersAttention'
import IntroMcp from './sections/IntroMcp'
import IntroRag from './sections/IntroRag'
import '../../styles/fundamentos.css'

function FundamentosPage() {
  const [activeSection, setActiveSection] = useState(sectionNav[0].id)

  useEffect(() => {
    const observers = sectionNav.map(({ id }) => {
      const element = document.getElementById(id)
      if (!element) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
      )

      observer.observe(element)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  return (
    <div className="fundamentos">
      <nav className="fundamentos__toc" aria-label="Contenido de Fundamentos">
        <p className="fundamentos__toc-title">En esta sección</p>
        <ul className="fundamentos__toc-list">
          {sectionNav.map(({ id, label }) => (
            <li key={id}>
              <a
                className={`fundamentos__toc-link${activeSection === id ? ' fundamentos__toc-link--active' : ''}`}
                href={`#${id}`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="fundamentos__content">
        <header className="fundamentos__hero">
          <p className="fundamentos__hero-session">Sesión 01</p>
          <h1 className="fundamentos__hero-title">Fundamentos</h1>
          <p className="fundamentos__hero-lead">
            Base teórica del curso: historia de la computación, vocabulario esencial,
            prompting, tokens, Transformers, MCP y RAG.
          </p>
        </header>

        <HistoriaComputacion />
        <ConceptosBasicos />
        <PromptingAvanzado />
        <TokensCostos />
        <TransformersAttention />
        <IntroMcp />
        <IntroRag />
      </div>
    </div>
  )
}

export default FundamentosPage
