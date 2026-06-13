import { useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { servicios, barberos, generarSlots, slotsOcupados } from '../data/datos'

const todosSlots = generarSlots()

function Cliente({ agregarTurno }) {
  const [nombre, setNombre] = useState('')
  const [servicio, setServicio] = useState('')
  const [barbero, setBarbero] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [confirmado, setConfirmado] = useState(false)
  const [bloqueados, setBloqueados] = useState([])

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

  function resetForm() {
    setConfirmado(false)
    setNombre('')
    setHora('')
    setFecha('')
    setServicio('')
    setBarbero('')
    setBloqueados([])
  }

  async function reservar() {
    if (!nombre || !servicio || !barbero || !fecha || !hora) {
      alert('Por favor completa todos los campos')
      return
    }
    const servicioObj = servicios.find(s => s.id === +servicio)
    const barberoObj = barberos.find(b => b.id === +barbero)
    await agregarTurno({
      nombre,
      servicio: servicioObj.nombre,
      barbero: barberoObj.nombre.split(' ')[0],
      fecha,
      hora,
    })
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
            placeholder="Ej: Carlos Muñoz"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
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
            onChange={e => handleCampo('fecha', e.target.value)}
          />
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