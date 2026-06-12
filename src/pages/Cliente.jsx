import { useState } from 'react'
import { servicios, barberos, horasDisponibles } from '../data/datos'

function Cliente({ agregarTurno }) {
  const [nombre, setNombre] = useState('')
  const [servicio, setServicio] = useState('')
  const [barbero, setBarbero] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [confirmado, setConfirmado] = useState(false)

  const horasOcupadas = ['9:00', '10:00', '11:30']

  function reservar() {
    if (!nombre || !servicio || !barbero || !fecha || !hora) {
      alert('Por favor completa todos los campos')
      return
    }

    const servicioObj = servicios.find(s => s.id === +servicio)
    const barberoObj = barberos.find(b => b.id === +barbero)

    agregarTurno({
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
        <button className="btn-primary" onClick={() => {
          setConfirmado(false)
          setNombre('')
          setHora('')
          setFecha('')
          setServicio('')
          setBarbero('')
        }}>
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
          <select value={servicio} onChange={e => setServicio(e.target.value)}>
            <option value="">Selecciona un servicio</option>
            {servicios.map(s => (
              <option key={s.id} value={s.id}>
                {s.nombre} — ${s.precio.toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Barbero</label>
          <select value={barbero} onChange={e => setBarbero(e.target.value)}>
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
            onChange={e => setFecha(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Hora disponible</label>
          <div className="time-grid">
            {horasDisponibles.map(h => (
              <button
                key={h}
                className={`time-slot ${horasOcupadas.includes(h) ? 'taken' : ''} ${hora === h ? 'selected' : ''}`}
                onClick={() => !horasOcupadas.includes(h) && setHora(h)}
              >
                {h}
              </button>
            ))}
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