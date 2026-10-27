import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Fundamentos from './pages/Fundamentos'
import PracticaAgentes from './pages/PracticaAgentes'
import PracticaMcp from './pages/PracticaMcp'
import PracticaRag from './pages/PracticaRag'
import Profesores from './pages/Profesores'
import ProfesorSesion from './pages/ProfesorSesion'

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
        <Route path="/profesores" element={<Profesores />} />
        <Route path="/profesores/fundamentos" element={<ProfesorSesion sessionId="fundamentos" />} />
        <Route path="/profesores/rag" element={<ProfesorSesion sessionId="rag" />} />
        <Route path="/profesores/mcp" element={<ProfesorSesion sessionId="mcp" />} />
        <Route path="/profesores/agentes" element={<ProfesorSesion sessionId="agentes" />} />
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
