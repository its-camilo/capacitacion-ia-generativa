import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Fundamentos from './pages/Fundamentos'
import PracticaAgentes from './pages/PracticaAgentes'
import PracticaMcp from './pages/PracticaMcp'
import PracticaRag from './pages/PracticaRag'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/estudiantes/fundamentos" replace />} />
        <Route path="/estudiantes" element={<Navigate to="/estudiantes/fundamentos" replace />} />
        <Route path="/estudiantes/fundamentos" element={<Fundamentos />} />
        <Route path="/estudiantes/practica-mcp" element={<PracticaMcp />} />
        <Route path="/estudiantes/practica-rag" element={<PracticaRag />} />
        <Route path="/estudiantes/practica-agentes" element={<PracticaAgentes />} />
        <Route path="/profesores" element={null} />
        <Route path="/profesores/fundamentos" element={null} />
        <Route path="/profesores/practica-mcp" element={null} />
        <Route path="/profesores/practica-rag" element={null} />
        <Route path="/profesores/practica-agentes" element={null} />
        <Route path="/fundamentos" element={<Navigate to="/estudiantes/fundamentos" replace />} />
        <Route path="/practica-mcp" element={<Navigate to="/estudiantes/practica-mcp" replace />} />
        <Route path="/practica-rag" element={<Navigate to="/estudiantes/practica-rag" replace />} />
        <Route path="/practica-agentes" element={<Navigate to="/estudiantes/practica-agentes" replace />} />
      </Route>
    </Routes>
  )
}

export default App
