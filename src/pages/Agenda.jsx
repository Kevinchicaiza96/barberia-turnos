const colores = {
  'completado': 'badge-success',
  'en curso': 'badge-warning',
  'pendiente': 'badge-info',
  'cancelado': 'badge-danger',
}

function iniciales(nombre) {
  return nombre.split(' ').slice(0, 2).map(n => n[0]).join('')
}

function Agenda({ turnos, actualizarEstado }) {
  const completados = turnos.filter(t => t.estado === 'completado').length
  const pendientes = turnos.filter(t => t.estado === 'pendiente').length
  const enCurso = turnos.filter(t => t.estado === 'en curso').length

  async function enviarRecordatorio(turno) {
    if (!turno.telefono) {
      alert('Este turno no tiene número de teléfono registrado')
      return
    }
    try {
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: turno.telefono,
          nombre: turno.nombre,
          servicio: turno.servicio,
          fecha: turno.fecha,
          hora: turno.hora,
        })
      })
      const data = await res.json()
      if (data.ok) {
        alert(`✅ Recordatorio enviado a ${turno.nombre}`)
      } else {
        alert(`❌ Error: ${data.error}`)
      }
    } catch {
      alert('Error al enviar el recordatorio')
    }
  }

  return (
    <div>
      <h1 className="page-title">Agenda de hoy</h1>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total turnos</div>
          <div className="metric-value">{turnos.length}</div>
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

      <div className="form-card">
        {turnos.length === 0 && (
          <p style={{ textAlign: 'center', color: '#aaa', padding: '2rem 0' }}>
            No hay turnos registrados aún
          </p>
        )}
        {turnos.map(t => (
          <div key={t.id} className="turno-row">
            <div className="turno-info">
              <div className="avatar">{iniciales(t.nombre)}</div>
              <div>
                <div className="turno-nombre">{t.nombre}</div>
                <div className="turno-sub">{t.servicio} · {t.barbero} · {t.hora}</div>
                <div className="turno-sub">{t.fecha}</div>
              </div>
            </div>
            <div className="turno-acciones">
              <span className={`badge ${colores[t.estado]}`}>{t.estado}</span>
              <select
                className="estado-select"
                value={t.estado}
                onChange={e => actualizarEstado(t.id, e.target.value)}
              >
                <option value="pendiente">Pendiente</option>
                <option value="en curso">En curso</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
              <button className="btn-sm" onClick={() => enviarRecordatorio(t)}>
                📱 WA
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Agenda