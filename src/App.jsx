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
        <Route index element={<Navigate to="/fundamentos" replace />} />
        <Route path="/fundamentos" element={<Fundamentos />} />
        <Route path="/practica-mcp" element={<PracticaMcp />} />
        <Route path="/practica-rag" element={<PracticaRag />} />
        <Route path="/practica-agentes" element={<PracticaAgentes />} />
      </Route>
    </Routes>
  )
}

export default App
