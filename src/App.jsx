import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { collection, onSnapshot, addDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import Cliente from './pages/Cliente'
import Agenda from './pages/Agenda'
import Equipo from './pages/Equipo'
import Historial from './pages/Historial'
import Asistente from './pages/Asistente'
import './App.css'

function App() {
  const [turnos, setTurnos] = useState([])
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'turnos'), snapshot => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      setTurnos(data)
    })
    return () => unsub()
  }, [])

  async function agregarTurno(turno) {
    await addDoc(collection(db, 'turnos'), { ...turno, estado: 'pendiente' })
  }

  async function actualizarEstado(id, estado) {
    await updateDoc(doc(db, 'turnos', id), { estado })
  }

  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">✂️ BarberApp</div>

          <button className="hamburger" onClick={() => setMenuAbierto(!menuAbierto)}>
            {menuAbierto ? '✕' : '☰'}
          </button>

          <div className={`nav-links ${menuAbierto ? 'nav-open' : ''}`}>
            <NavLink to="/" onClick={() => setMenuAbierto(false)}>Cliente</NavLink>
            <NavLink to="/agenda" onClick={() => setMenuAbierto(false)}>Agenda</NavLink>
            <NavLink to="/equipo" onClick={() => setMenuAbierto(false)}>Equipo</NavLink>
            <NavLink to="/historial" onClick={() => setMenuAbierto(false)}>Historial</NavLink>
            <NavLink to="/asistente" onClick={() => setMenuAbierto(false)}>Asistente IA</NavLink>
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