import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom'
import { collection, onSnapshot, addDoc, doc, updateDoc, query, where } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from './firebase'
import Cliente from './pages/Cliente'
import Superadmin from './pages/Superadmin'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Cancelar from './pages/Cancelar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import './App.css'

const BARBERIA_ID = 'QkrmM1YbG4LxlKSa3hHa'

function Layout({ children, menuAbierto, setMenuAbierto }) {
  const location = useLocation()
  const esLanding = location.pathname === '/landing' || location.pathname === '/dashboard'

  if (esLanding) return <>{children}</>

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">✂️ BarberApp</div>
        <button className="hamburger" onClick={() => setMenuAbierto(!menuAbierto)}>
          {menuAbierto ? '✕' : '☰'}
        </button>
        <div className={`nav-links ${menuAbierto ? 'nav-open' : ''}`}>
          <NavLink to="/" onClick={() => setMenuAbierto(false)}>Reservar</NavLink>
          <NavLink to="/cancelar" onClick={() => setMenuAbierto(false)}>Cancelar</NavLink>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
      <footer className="app-footer">
        <a href="/admin" className="admin-link">Acceso admin</a>
      </footer>
    </div>
  )
}

function App() {
  const [turnos, setTurnos] = useState([])
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [usuario, setUsuario] = useState(null)
  const [cargandoAuth, setCargandoAuth] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUsuario(u)
      setCargandoAuth(false)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    const q = query(collection(db, 'turnos'), where('barberia_id', '==', BARBERIA_ID))
    const unsub = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      setTurnos(data)
    })
    return () => unsub()
  }, [])

  async function agregarTurno(turno) {
    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase()
    await addDoc(collection(db, 'turnos'), { ...turno, estado: 'pendiente', codigo, barberia_id: BARBERIA_ID })
    return codigo
  }

  async function actualizarEstado(id, estado) {
    await updateDoc(doc(db, 'turnos', id), { estado })
  }

  if (cargandoAuth) return null

  return (
    <BrowserRouter>
      <Layout usuario={usuario} menuAbierto={menuAbierto} setMenuAbierto={setMenuAbierto}>
        <Routes>
          <Route path="/" element={usuario ? <Navigate to="/dashboard" /> : <Cliente agregarTurno={agregarTurno} barberiaId={BARBERIA_ID} />} />
          <Route path="/cancelar" element={<Cancelar barberiaId={BARBERIA_ID} />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/admin" element={usuario ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/dashboard" element={usuario ? <Dashboard turnos={turnos} barberiaId={BARBERIA_ID} actualizarEstado={actualizarEstado} /> : <Login />} />
          <Route path="/superadmin" element={usuario ? <Superadmin usuario={usuario} /> : <Login />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App