import RagAnimationCard from './RagAnimationCard'
import createMcpPractica2Scene, { MCP_PRACTICA2_DURATION } from './mcpPractica2Scene'

const STEPS = [
  { label: 'Promedios por corte', caption: 'Claude busca la hoja en su Drive y calcula el promedio de cada corte.' },
  { label: 'Distribución del grupo', caption: 'Los 25 estudiantes se reparten por rango de nota.' },
  { label: 'Estudiantes en riesgo', caption: 'Riesgo: promedio menor de 3,0 o asistencia menor de 70 %.' },
  { label: 'Gráfico', caption: 'Claude dibuja el gráfico de la distribución en el chat.' },
  { label: 'Lista de riesgo', caption: 'Quedan cuatro códigos: E09, E11, E15 y E25. Verifique los números.' },
]

// Primer fotograma (y fotograma estático con reduced-motion): promedios de ambos cortes ya calculados.
const START_T = 0.17

function McpPractica2Animation({ startT = START_T }) {
  return (
    <RagAnimationCard
      ariaLabel="Analizar el grupo: promedios por corte, distribución del grupo, estudiantes en riesgo, gráfico en el chat y lista de riesgo con los códigos E09, E11, E15 y E25"
      createScene={createMcpPractica2Scene}
      steps={STEPS}
      duration={MCP_PRACTICA2_DURATION}
      startT={startT}
    />
  )
}

export default McpPractica2Animation
