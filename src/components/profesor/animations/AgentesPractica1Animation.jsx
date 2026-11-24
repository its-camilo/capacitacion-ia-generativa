import RagAnimationCard from './RagAnimationCard'
import createAgentesPractica1Scene, { AGENTES_PRACTICA1_DURATION } from './agentesPractica1Scene'

const STEPS = [
  { label: 'Ruta y cuenta', caption: 'Botón +, Más herramientas, Deep Research, con la cuenta @unal.' },
  { label: 'Aparece el plan', caption: 'Tres pasos: investigar, analizar y crear el informe.' },
  { label: 'Acotar el plan', caption: 'Modificar plan baja las fuentes de 80 a unas pocas.' },
  { label: 'Investiga', caption: 'Tarda 30 a 60 minutos; el reloj marca el avance.' },
  { label: 'Revisar y guardar', caption: 'Dos fuentes verificadas, un vacío anotado, informe guardado.' },
]

// Primer fotograma (y fotograma estático con reduced-motion): el menú del botón + abierto camino a Deep Research.
const START_T = 0.12

function AgentesPractica1Animation({ startT = START_T }) {
  return (
    <RagAnimationCard
      ariaLabel="Ver un agente trabajar: con la cuenta @unal se abre Deep Research desde el botón +, Más herramientas; aparece un plan de tres pasos, investigar sitios web, analizar resultados y crear informe; Modificar plan acota las fuentes de 80 a 12 sitios; la investigación corre entre 30 y 60 minutos con un reloj y una barra de progreso; se verifican dos fuentes, OpenStax y DANE, se anota un vacío y se guarda el informe"
      createScene={createAgentesPractica1Scene}
      steps={STEPS}
      duration={AGENTES_PRACTICA1_DURATION}
      startT={startT}
    />
  )
}

export default AgentesPractica1Animation
