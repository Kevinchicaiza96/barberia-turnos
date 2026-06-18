import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useDatos } from '../hooks/useDatos'
import Historial from './Historial'
import Ingresos from './Ingresos'
import Configuracion from './Configuracion'
import Asistente from './Asistente'

function iniciales(nombre) {
  return nombre?.split(' ').slice(0, 2).map(n => n[0]).join('') || '??'
}

function Hoy({ turnos, barberiaId, actualizarEstado }) {
  const { barberos } = useDatos(barberiaId)
  const hoy = new Date().toISOString().split('T')[0]
  const turnosHoy = turnos.filter(t => t.fecha === hoy)
  const pendientes = turnosHoy.filter(t => t.estado === 'pendiente').length
  const completados = turnosHoy.filter(t => t.estado === 'completado').length
  const enCurso = turnosHoy.filter(t => t.estado === 'en curso').length

  const colores = {
    'completado': 'badge-success',
    'en curso': 'badge-warning',
    'pendiente': 'badge-info',
    'cancelado': 'badge-danger',
  }

  async function enviarRecordatorio(turno) {
    if (!turno.telefono) { alert('Sin número de teléfono'); return }
    try {
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: turno.telefono, nombre: turno.nombre, servicio: turno.servicio, fecha: turno.fecha, hora: turno.hora })
      })
      const data = await res.json()
      if (data.ok) alert(`✅ Recordatorio enviado a ${turno.nombre}`)
      else alert(`❌ Error: ${data.error}`)
    } catch { alert('Error al enviar') }
  }

  return (
    <div>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Turnos hoy</div>
          <div className="metric-value">{turnosHoy.length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Completados</div>
          <div className="metric-value">{completados}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">En curso</div>
          <div className="metric-value">{enCurso}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Pendientes</div>
          <div className="metric-value">{pendientes}</div>
        </div>
      </div>

      <div className="form-card" style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '1rem' }}>Turnos de hoy</p>
        {turnosHoy.length === 0 && <p style={{ color: '#aaa', fontSize: '13px', textAlign: 'center', padding: '1rem' }}>No hay turnos para hoy</p>}
        {turnosHoy.sort((a, b) => a.hora.localeCompare(b.hora)).map(t => (
          <div key={t.id} className="turno-row">
            <div className="turno-info">
              <div className="avatar">{iniciales(t.nombre)}</div>
              <div>
                <div className="turno-nombre">{t.nombre}</div>
                <div className="turno-sub">{t.servicio} · {t.barbero} · {t.hora}</div>
              </div>
            </div>
            <div className="turno-acciones">
              <span className={`badge ${colores[t.estado]}`}>{t.estado}</span>
              <select className="estado-select" value={t.estado} onChange={e => actualizarEstado(t.id, e.target.value)}>
                <option value="pendiente">Pendiente</option>
                <option value="en curso">En curso</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
              <button className="btn-sm" onClick={() => enviarRecordatorio(t)}>📱</button>
            </div>
          </div>
        ))}
      </div>

      <div className="form-card">
        <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '1rem' }}>Equipo hoy</p>
        {barberos.map(b => {
          const turnosBarbero = turnosHoy.filter(t => t.barbero === b.nombre.split(' ')[0])
          return (
            <div key={b.id} className="turno-row">
              <div className="turno-info">
                <div className="avatar">{iniciales(b.nombre)}</div>
                <div>
                  <div className="turno-nombre">{b.nombre}</div>
                  <div className="turno-sub">{turnosBarbero.length} turnos hoy</div>
                </div>
              </div>
              <span className={`badge ${b.estado === 'activo' ? 'badge-success' : 'badge-warning'}`}>{b.estado}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Dashboard({ turnos, barberiaId, actualizarEstado }) {
  const [tab, setTab] = useState('hoy')
  const [sidebarAbierto, setSidebarAbierto] = useState(false)

  const tabs = [
    { id: 'hoy', label: 'Hoy', icon: '📅' },
    { id: 'historial', label: 'Historial', icon: '👥' },
    { id: 'ingresos', label: 'Ingresos', icon: '📊' },
    { id: 'config', label: 'Configuración', icon: '⚙️' },
    { id: 'ia', label: 'Asistente IA', icon: '🤖' },
  ]

  return (
    <div className="dash-wrapper">
      {/* Sidebar */}
      <aside className={`dash-sidebar ${sidebarAbierto ? 'open' : ''}`}>
        <div className="dash-brand">✂️ BarberApp</div>
        <nav className="dash-nav">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`dash-nav-item ${tab === t.id ? 'active' : ''}`}
              onClick={() => { setTab(t.id); setSidebarAbierto(false) }}
            >
              <span className="dash-nav-icon">{t.icon}</span>
              <span className="dash-nav-label">{t.label}</span>
            </button>
          ))}
        </nav>
        <button className="dash-salir" onClick={() => signOut(auth)}>
          🚪 Salir
        </button>
      </aside>

      {/* Overlay móvil */}
      {sidebarAbierto && <div className="dash-overlay" onClick={() => setSidebarAbierto(false)} />}

      {/* Contenido */}
      <div className="dash-main">
        <div className="dash-topbar">
          <button className="dash-hamburger" onClick={() => setSidebarAbierto(!sidebarAbierto)}>☰</button>
          <span className="dash-page-title">
            {tabs.find(t => t.id === tab)?.icon} {tabs.find(t => t.id === tab)?.label}
          </span>
        </div>

        <div className="dash-content">
          {tab === 'hoy' && <Hoy turnos={turnos} barberiaId={barberiaId} actualizarEstado={actualizarEstado} />}
          {tab === 'historial' && <Historial turnos={turnos} />}
          {tab === 'ingresos' && <Ingresos turnos={turnos} />}
          {tab === 'config' && <Configuracion barberiaId={barberiaId} />}
          {tab === 'ia' && <Asistente />}
        </div>
      </div>
    </div>
  )
}

export default Dashboard