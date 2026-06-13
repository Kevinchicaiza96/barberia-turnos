import { useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { servicios, barberos, generarSlots, slotsOcupados } from '../data/datos'

const todosSlots = generarSlots()

const festivos = [
  '2025-01-01', '2025-01-06', '2025-03-24', '2025-04-17',
  '2025-04-18', '2025-05-01', '2025-06-02', '2025-06-23',
  '2025-06-30', '2025-07-20', '2025-08-07', '2025-08-18',
  '2025-10-13', '2025-11-03', '2025-11-17', '2025-12-08',
  '2025-12-25', '2026-01-01', '2026-01-12', '2026-03-23',
  '2026-04-02', '2026-04-03', '2026-05-01', '2026-05-18',
  '2026-06-08', '2026-06-15', '2026-06-29', '2026-07-20',
  '2026-08-07', '2026-08-17', '2026-10-12', '2026-11-02',
  '2026-11-16', '2026-12-08', '2026-12-25',
]

function esFestivo(fecha) {
  return festivos.includes(fecha)
}

function Cliente({ agregarTurno }) {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [servicio, setServicio] = useState('')
  const [barbero, setBarbero] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [confirmado, setConfirmado] = useState(false)
  const [bloqueados, setBloqueados] = useState([])
  const [codigo, setCodigo] = useState('')

  async function handleCampo(campo, valor) {
    const nuevoServicio = campo === 'servicio' ? valor : servicio
    const nuevoBarbero = campo === 'barbero' ? valor : barbero
    const nuevaFecha = campo === 'fecha' ? valor : fecha

    if (campo === 'servicio') setServicio(valor)
    if (campo === 'barbero') setBarbero(valor)
    if (campo === 'fecha') setFecha(valor)
    setHora('')

    if (!nuevoServicio || !nuevoBarbero || !nuevaFecha) {
      setBloqueados([])
      return
    }

    const snapshot = await getDocs(collection(db, 'turnos'))
    const nombreBarbero = barberos.find(b => b.id === +nuevoBarbero)?.nombre.split(' ')[0]
    const turnosDia = snapshot.docs
      .map(d => d.data())
      .filter(t =>
        t.barbero === nombreBarbero &&
        t.fecha === nuevaFecha &&
        t.estado !== 'cancelado'
      )

    const ocupados = new Set()
    for (const t of turnosDia) {
      const servicioTurno = servicios.find(s => s.nombre === t.servicio)
      const dur = servicioTurno?.duracion || 30
      slotsOcupados(t.hora, dur, todosSlots).forEach(s => ocupados.add(s))
    }

    const durSeleccionada = servicios.find(s => s.id === +nuevoServicio)?.duracion || 30
    const finalBloqueados = new Set(ocupados)
    todosSlots.forEach(slot => {
      const needed = slotsOcupados(slot, durSeleccionada, todosSlots)
      if (needed.some(s => ocupados.has(s))) finalBloqueados.add(slot)
      if (needed.length < Math.ceil(durSeleccionada / 30)) finalBloqueados.add(slot)
    })

    setBloqueados([...finalBloqueados])
  }

  function handleFecha(valor) {
    const seleccionada = new Date(valor + 'T00:00:00')
    const diaSemana = seleccionada.getDay()
    if (diaSemana === 0) {
      alert('La barbería no trabaja los domingos')
      return
    }
    if (esFestivo(valor)) {
      alert('Ese día es festivo, la barbería no trabaja')
      return
    }
    handleCampo('fecha', valor)
  }

  function resetForm() {
    setConfirmado(false)
    setNombre('')
    setTelefono('')
    setHora('')
    setFecha('')
    setServicio('')
    setBarbero('')
    setBloqueados([])
    setCodigo('')
  }

  async function reservar() {
    if (!nombre || !telefono || !servicio || !barbero || !fecha || !hora) {
      alert('Por favor completa todos los campos')
      return
    }
    const servicioObj = servicios.find(s => s.id === +servicio)
    const barberoObj = barberos.find(b => b.id === +barbero)
    const codigoGenerado = await agregarTurno({
      nombre,
      telefono,
      servicio: servicioObj.nombre,
      barbero: barberoObj.nombre.split(' ')[0],
      fecha,
      hora,
    })
    setCodigo(codigoGenerado)
    setConfirmado(true)
  }

  if (confirmado) {
    return (
      <div className="confirm-card">
        <div className="confirm-icon">✓</div>
        <h2>¡Turno confirmado!</h2>
        <p><strong>Cliente:</strong> {nombre}</p>
        <p><strong>Servicio:</strong> {servicios.find(s => s.id === +servicio)?.nombre}</p>
        <p><strong>Barbero:</strong> {barberos.find(b => b.id === +barbero)?.nombre}</p>
        <p><strong>Fecha:</strong> {fecha}</p>
        <p><strong>Hora:</strong> {hora}</p>
        <div className="codigo-box">
          <p className="codigo-label">Tu código de cancelación</p>
          <p className="codigo-valor">{codigo}</p>
          <p className="codigo-hint">Guarda este código para cancelar tu turno si lo necesitas</p>
        </div>
        <button className="btn-primary" onClick={resetForm}>
          Reservar otro turno
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">Reserva tu turno</h1>
      <div className="form-card">
        <div className="form-group">
          <label>Tu nombre</label>
          <input
            type="text"
            placeholder="Ingresa tu nombre completo"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Teléfono WhatsApp</label>
          <input
            type="tel"
            placeholder="Ingresa tu número de WhatsApp"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Servicio</label>
          <select value={servicio} onChange={e => handleCampo('servicio', e.target.value)}>
            <option value="">Selecciona un servicio</option>
            {servicios.map(s => (
              <option key={s.id} value={s.id}>
                {s.nombre} — ${s.precio.toLocaleString()} ({s.duracion} min)
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Barbero</label>
          <select value={barbero} onChange={e => handleCampo('barbero', e.target.value)}>
            <option value="">Selecciona un barbero</option>
            {barberos.map(b => (
              <option key={b.id} value={b.id}>{b.nombre}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Fecha</label>
          <input
            type="date"
            value={fecha}
            min={new Date().toISOString().split('T')[0]}
            onChange={e => handleFecha(e.target.value)}
          />
          <div className="festivos-lista">
            <span className="festivos-titulo">📅 Próximos festivos:</span>
            {festivos
              .filter(f => f >= new Date().toISOString().split('T')[0])
              .slice(0, 4)
              .map(f => {
                const nombreFecha = new Date(f + 'T00:00:00').toLocaleDateString('es-CO', {
                  weekday: 'long', month: 'long', day: 'numeric'
                })
                return (
                  <span key={f} className="festivo-tag">{nombreFecha}</span>
                )
              })
            }
          </div>
        </div>

        <div className="form-group">
          <label>
            Hora disponible
            {(!barbero || !fecha || !servicio) && (
              <span style={{ color: '#aaa', fontWeight: 400 }}> — selecciona servicio, barbero y fecha primero</span>
            )}
          </label>
          <div className="time-grid">
            {todosSlots.map(h => {
              const ocupado = bloqueados.includes(h)
              return (
                <button
                  key={h}
                  className={`time-slot ${ocupado ? 'taken' : ''} ${hora === h ? 'selected' : ''}`}
                  onClick={() => !ocupado && setHora(h)}
                  disabled={!barbero || !fecha || !servicio}
                >
                  {h}
                </button>
              )
            })}
          </div>
        </div>

        <button className="btn-primary" onClick={reservar}>
          Confirmar turno
        </button>
      </div>
    </div>
  )
}

export default Cliente