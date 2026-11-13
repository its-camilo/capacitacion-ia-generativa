import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Fundamentos from './pages/Fundamentos'
import PracticaAgentes from './pages/PracticaAgentes'
import PracticaMcp from './pages/PracticaMcp'
import PracticaRag from './pages/PracticaRag'
import Profesores from './pages/Profesores'
import ProfesorSesion from './pages/ProfesorSesion'
import PinGate from './components/PinGate'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/estudiantes/fundamentos" replace />} />
        <Route path="/estudiantes" element={<Navigate to="/estudiantes/fundamentos" replace />} />
        <Route path="/estudiantes/fundamentos" element={<PinGate><Fundamentos /></PinGate>} />
        <Route path="/estudiantes/practica-mcp" element={<PinGate><PracticaMcp /></PinGate>} />
        <Route path="/estudiantes/practica-rag" element={<PinGate><PracticaRag /></PinGate>} />
        <Route path="/estudiantes/practica-agentes" element={<PinGate><PracticaAgentes /></PinGate>} />
        <Route path="/profesores" element={<Profesores />} />
        <Route path="/profesores/fundamentos" element={<ProfesorSesion sessionId="fundamentos" />} />
        <Route path="/profesores/rag" element={<ProfesorSesion sessionId="rag" />} />
        <Route path="/profesores/mcp" element={<PinGate><ProfesorSesion sessionId="mcp" /></PinGate>} />
        <Route path="/profesores/agentes" element={<PinGate><ProfesorSesion sessionId="agentes" /></PinGate>} />
        <Route path="/profesores/practica-rag" element={<Navigate to="/profesores/rag" replace />} />
        <Route path="/profesores/practica-mcp" element={<Navigate to="/profesores/mcp" replace />} />
        <Route path="/profesores/practica-agentes" element={<Navigate to="/profesores/agentes" replace />} />
        <Route path="/fundamentos" element={<Navigate to="/estudiantes/fundamentos" replace />} />
        <Route path="/practica-mcp" element={<Navigate to="/estudiantes/practica-mcp" replace />} />
        <Route path="/practica-rag" element={<Navigate to="/estudiantes/practica-rag" replace />} />
        <Route path="/practica-agentes" element={<Navigate to="/estudiantes/practica-agentes" replace />} />
      </Route>
    </Routes>
  )
}

export default App
