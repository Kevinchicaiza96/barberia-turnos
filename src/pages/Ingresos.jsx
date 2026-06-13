import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { servicios } from '../data/datos'

function calcularIngresos(turnos) {
  const porDia = {}
  for (const t of turnos) {
    if (t.estado === 'cancelado') continue
    const servicio = servicios.find(s => s.nombre === t.servicio)
    const precio = servicio?.precio || 0
    if (!porDia[t.fecha]) porDia[t.fecha] = 0
    porDia[t.fecha] += precio
  }
  return Object.entries(porDia)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([fecha, total]) => ({
      fecha: fecha.slice(5),
      total,
    }))
}

function Ingresos({ turnos }) {
  const datos = calcularIngresos(turnos)

  const totalMes = turnos
    .filter(t => t.estado !== 'cancelado' && t.fecha?.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((acc, t) => acc + (servicios.find(s => s.nombre === t.servicio)?.precio || 0), 0)

  const totalHoy = turnos
    .filter(t => t.estado !== 'cancelado' && t.fecha === new Date().toISOString().split('T')[0])
    .reduce((acc, t) => acc + (servicios.find(s => s.nombre === t.servicio)?.precio || 0), 0)

  const turnosCompletados = turnos.filter(t => t.estado === 'completado').length
  const turnosCancelados = turnos.filter(t => t.estado === 'cancelado').length

  return (
    <div>
      <h1 className="page-title">Panel de ingresos</h1>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Ingresos hoy</div>
          <div className="metric-value">${totalHoy.toLocaleString()}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Ingresos este mes</div>
          <div className="metric-value">${totalMes.toLocaleString()}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Turnos completados</div>
          <div className="metric-value">{turnosCompletados}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Cancelados</div>
          <div className="metric-value">{turnosCancelados}</div>
        </div>
      </div>

      <div className="form-card">
        <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '1.2rem' }}>Ingresos últimos 7 días</p>
        {datos.length === 0 ? (
          <p style={{ color: '#aaa', fontSize: '14px', textAlign: 'center', padding: '2rem 0' }}>
            No hay datos suficientes aún
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={datos} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => [`$${v.toLocaleString()}`, 'Ingresos']} />
              <Bar dataKey="total" fill="#1a1a1a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="form-card" style={{ marginTop: '1rem' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '1rem' }}>Servicios más solicitados</p>
        {servicios.map(s => {
          const cantidad = turnos.filter(t => t.servicio === s.nombre && t.estado !== 'cancelado').length
          const porcentaje = turnos.length > 0 ? Math.round((cantidad / turnos.length) * 100) : 0
          return (
            <div key={s.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span>{s.nombre}</span>
                <span style={{ color: '#888' }}>{cantidad} turnos</span>
              </div>
              <div style={{ background: '#f0f0f0', borderRadius: '99px', height: '6px' }}>
                <div style={{ background: '#1a1a1a', borderRadius: '99px', height: '6px', width: `${porcentaje}%`, transition: 'width 0.3s' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Ingresos