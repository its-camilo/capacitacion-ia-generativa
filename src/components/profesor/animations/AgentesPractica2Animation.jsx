import RagAnimationCard from './RagAnimationCard'
import createAgentesPractica2Scene, { AGENTES_PRACTICA2_DURATION } from './agentesPractica2Scene'

const STEPS = [
  { label: 'Archivos por Drive', caption: 'Botón +, Subir o agregar archivos, Desde Drive.' },
  { label: 'Ocho preguntas', caption: 'La del equilibrio es P = 30 y Q = 80.' },
  { label: 'Se construye la app', caption: 'El quiz en vivo, en celular y proyector.' },
  { label: 'Puntaje al final', caption: 'Correcta, explicación y fuente; puntaje al completar las 8.' },
  { label: 'Con clics, no con Enter', caption: 'Las sin responder cuentan como falladas; plan B listo.' },
]

// Primer fotograma (y fotograma estático con reduced-motion): el menú del botón + abierto en Desde Drive.
const START_T = 0.12

function AgentesPractica2Animation({ startT = START_T }) {
  return (
    <RagAnimationCard
      ariaLabel="App interactiva de clase: con el botón +, Subir o agregar archivos y Desde Drive entran los archivos S2-02 Lectura 1 Oferta, demanda y equilibrio y S2-04 Artículo Controles de precios; Claude propone 8 preguntas y se marca la del equilibrio, P = 30 y Q = 80; se construye el artefacto, un quiz en vivo en una ventana, con un celular y un proyector a los lados; en la vista previa cada respuesta muestra si es correcta, la explicación y la fuente, y el puntaje aparece solo al final con la lista de falladas y el botón Reiniciar quiz; se avanza con clics en Siguiente, no con Enter, las preguntas sin responder cuentan como falladas y queda listo el plan B con las preguntas en un documento"
      createScene={createAgentesPractica2Scene}
      steps={STEPS}
      duration={AGENTES_PRACTICA2_DURATION}
      startT={startT}
    />
  )
}

export default AgentesPractica2Animation
