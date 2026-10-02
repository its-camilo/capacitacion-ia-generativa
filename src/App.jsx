import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import SessionGate from './components/SessionGate'
import Fundamentos from './pages/Fundamentos'
import PracticaAgentes from './pages/PracticaAgentes'
import PracticaMcp from './pages/PracticaMcp'
import PracticaRag from './pages/PracticaRag'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/fundamentos" replace />} />
        <Route path="/fundamentos" element={<Fundamentos />} />
        <Route path="/practica-mcp" element={<SessionGate><PracticaMcp /></SessionGate>} />
        <Route path="/practica-rag" element={<SessionGate><PracticaRag /></SessionGate>} />
        <Route path="/practica-agentes" element={<SessionGate><PracticaAgentes /></SessionGate>} />
      </Route>
    </Routes>
  )
}

export default App
