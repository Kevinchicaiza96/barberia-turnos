import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Cliente from './pages/Cliente'
import Agenda from './pages/Agenda'
import Equipo from './pages/Equipo'
import Historial from './pages/Historial'
import Asistente from './pages/Asistente'
import { turnosIniciales } from './data/datos'
import './App.css'

function App() {
  const [turnos, setTurnos] = useState(turnosIniciales)

  function agregarTurno(turno) {
    setTurnos(prev => [...prev, { ...turno, id: Date.now(), estado: 'pendiente' }])
  }

  function actualizarEstado(id, estado) {
    setTurnos(prev => prev.map(t => t.id === id ? { ...t, estado } : t))
  }

  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">✂️ BarberApp</div>
          <div className="nav-links">
            <NavLink to="/">Cliente</NavLink>
            <NavLink to="/agenda">Agenda</NavLink>
            <NavLink to="/equipo">Equipo</NavLink>
            <NavLink to="/historial">Historial</NavLink>
            <NavLink to="/asistente">Asistente IA</NavLink>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Cliente agregarTurno={agregarTurno} />} />
            <Route path="/agenda" element={<Agenda turnos={turnos} actualizarEstado={actualizarEstado} />} />
            <Route path="/equipo" element={<Equipo />} />
            <Route path="/historial" element={<Historial turnos={turnos} />} />
            <Route path="/asistente" element={<Asistente />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App