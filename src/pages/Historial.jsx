import { useState } from 'react'

function iniciales(nombre) {
  return nombre.split(' ').slice(0, 2).map(n => n[0]).join('')
}

function Historial({ turnos }) {
  const [busqueda, setBusqueda] = useState('')

  const clientes = turnos.reduce((acc, t) => {
    const existente = acc.find(c => c.nombre === t.nombre)
    if (existente) {
      existente.visitas += 1
      existente.ultimoServicio = t.servicio
      existente.ultimaFecha = t.fecha
    } else {
      acc.push({
        nombre: t.nombre,
        visitas: 1,
        ultimoServicio: t.servicio,
        ultimaFecha: t.fecha,
      })
    }
    return acc
  }, [])

  const filtrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <h1 className="page-title">Historial de clientes</h1>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="metric-card">
          <div className="metric-label">Total clientes</div>
          <div className="metric-value">{clientes.length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Visitas totales</div>
          <div className="metric-value">{turnos.length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Servicios hoy</div>
          <div className="metric-value">
            {turnos.filter(t => t.fecha === new Date().toISOString().split('T')[0]).length}
          </div>
        </div>
      </div>

      <div className="form-card">
        <div className="form-group">
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        {filtrados.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888', padding: '1rem' }}>
            No se encontró ningún cliente
          </p>
        )}

        {filtrados.map((c, i) => (
          <div key={i} className="turno-row">
            <div className="turno-info">
              <div className="avatar">{iniciales(c.nombre)}</div>
              <div>
                <div className="turno-nombre">{c.nombre}</div>
                <div className="turno-sub">{c.ultimaFecha} · {c.ultimoServicio}</div>
              </div>
            </div>
            <div className="turno-acciones">
              <span className={`badge ${c.visitas === 1 ? 'badge-warning' : 'badge-info'}`}>
                {c.visitas === 1 ? 'Nuevo' : `${c.visitas} visitas`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Historial