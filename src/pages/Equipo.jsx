import { useState } from 'react'

const barberosiniciales = [
  { id: 1, nombre: 'Andrés García', horario: 'Lun–Sáb · 8am–5pm', turnosHoy: 3, estado: 'activo' },
  { id: 2, nombre: 'Luis Martínez', horario: 'Mar–Dom · 9am–6pm', turnosHoy: 2, estado: 'activo' },
  { id: 3, nombre: 'Felipe Ruiz', horario: 'Lun–Vie · 10am–7pm', turnosHoy: 3, estado: 'descanso' },
]

function iniciales(nombre) {
  return nombre.split(' ').slice(0, 2).map(n => n[0]).join('')
}

function Equipo() {
  const [barberos, setBarberos] = useState(barberosiniciales)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [nuevo, setNuevo] = useState({ nombre: '', horario: '', estado: 'activo' })

  function agregar() {
    if (!nuevo.nombre || !nuevo.horario) {
      alert('Completa nombre y horario')
      return
    }
    setBarberos([...barberos, { ...nuevo, id: Date.now(), turnosHoy: 0 }])
    setNuevo({ nombre: '', horario: '', estado: 'activo' })
    setMostrarForm(false)
  }

  function eliminar(id) {
    if (confirm('¿Eliminar este barbero?')) {
      setBarberos(barberos.filter(b => b.id !== id))
    }
  }

  return (
    <div>
      <h1 className="page-title">Gestión del equipo</h1>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="metric-card">
          <div className="metric-label">Total barberos</div>
          <div className="metric-value">{barberos.length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Activos hoy</div>
          <div className="metric-value">{barberos.filter(b => b.estado === 'activo').length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Turnos totales</div>
          <div className="metric-value">{barberos.reduce((a, b) => a + b.turnosHoy, 0)}</div>
        </div>
      </div>

      <div className="form-card">
        {barberos.map(b => (
          <div key={b.id} className="turno-row">
            <div className="turno-info">
              <div className="avatar">{iniciales(b.nombre)}</div>
              <div>
                <div className="turno-nombre">{b.nombre}</div>
                <div className="turno-sub">{b.horario} · {b.turnosHoy} turnos hoy</div>
              </div>
            </div>
            <div className="turno-acciones">
              <span className={`badge ${b.estado === 'activo' ? 'badge-success' : 'badge-warning'}`}>
                {b.estado}
              </span>
              <button className="btn-sm" onClick={() => eliminar(b.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {mostrarForm && (
        <div className="form-card" style={{ marginTop: '1rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '16px' }}>Nuevo barbero</h3>
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              placeholder="Ej: Carlos Pérez"
              value={nuevo.nombre}
              onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Horario</label>
            <input
              type="text"
              placeholder="Ej: Lun–Vie · 9am–6pm"
              value={nuevo.horario}
              onChange={e => setNuevo({ ...nuevo, horario: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Estado</label>
            <select value={nuevo.estado} onChange={e => setNuevo({ ...nuevo, estado: e.target.value })}>
              <option value="activo">Activo</option>
              <option value="descanso">Descanso</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-primary" onClick={agregar}>Guardar</button>
            <button className="btn-secondary" onClick={() => setMostrarForm(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {!mostrarForm && (
        <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => setMostrarForm(true)}>
          + Agregar barbero
        </button>
      )}
    </div>
  )
}

export default Equipo