import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { collection, onSnapshot, addDoc, doc, updateDoc, query, where } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { db, auth } from './firebase'
import Cliente from './pages/Cliente'
import Agenda from './pages/Agenda'
import Superadmin from './pages/Superadmin'
import Registro from './pages/Registro'
import Configuracion from './pages/Configuracion'
import Equipo from './pages/Equipo'
import Historial from './pages/Historial'
import Asistente from './pages/Asistente'
import Login from './pages/Login'
import Cancelar from './pages/Cancelar'
import Landing from './pages/Landing'
import Ingresos from './pages/Ingresos'
import './App.css'

const BARBERIA_ID = 'QkrmM1YbG4LxlKSa3hHa'

function Layout({ children, usuario, menuAbierto, setMenuAbierto }) {
  const location = useLocation()
  const esLanding = location.pathname === '/landing'

  if (esLanding) return <>{children}</>

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">✂️ BarberApp</div>
        <button className="hamburger" onClick={() => setMenuAbierto(!menuAbierto)}>
          {menuAbierto ? '✕' : '☰'}
        </button>
        <div className={`nav-links ${menuAbierto ? 'nav-open' : ''}`}>
          <NavLink to="/" onClick={() => setMenuAbierto(false)}>Cliente</NavLink>
          <NavLink to="/cancelar" onClick={() => setMenuAbierto(false)}>Cancelar</NavLink>
          {usuario && <>
            <NavLink to="/configuracion" onClick={() => setMenuAbierto(false)}>Config</NavLink>
            <NavLink to="/agenda" onClick={() => setMenuAbierto(false)}>Agenda</NavLink>
            <NavLink to="/equipo" onClick={() => setMenuAbierto(false)}>Equipo</NavLink>
            <NavLink to="/historial" onClick={() => setMenuAbierto(false)}>Historial</NavLink>
            <NavLink to="/ingresos" onClick={() => setMenuAbierto(false)}>Ingresos</NavLink>
            <NavLink to="/asistente" onClick={() => setMenuAbierto(false)}>Asistente IA</NavLink>
            <button className="nav-logout" onClick={() => signOut(auth)}>Salir</button>
          </>}
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
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
          <Route path="/" element={<Cliente agregarTurno={agregarTurno} barberiaId={BARBERIA_ID} />} />
          <Route path="/cancelar" element={<Cancelar barberiaId={BARBERIA_ID} />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/configuracion" element={usuario ? <Configuracion barberiaId={BARBERIA_ID} /> : <Login />} />
          <Route path="/admin" element={usuario ? <Agenda turnos={turnos} actualizarEstado={actualizarEstado} /> : <Login />} />
          <Route path="/agenda" element={usuario ? <Agenda turnos={turnos} actualizarEstado={actualizarEstado} /> : <Login />} />
          <Route path="/equipo" element={usuario ? <Equipo barberiaId={BARBERIA_ID} /> : <Login />} />
          <Route path="/historial" element={usuario ? <Historial turnos={turnos} /> : <Login />} />
          <Route path="/ingresos" element={usuario ? <Ingresos turnos={turnos} /> : <Login />} />
          <Route path="/asistente" element={usuario ? <Asistente /> : <Login />} />
          <Route path="/superadmin" element={usuario ? <Superadmin usuario={usuario} /> : <Login />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App