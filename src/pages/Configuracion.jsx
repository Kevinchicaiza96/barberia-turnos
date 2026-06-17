import { useState } from 'react'
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useDatos } from '../hooks/useDatos'

function Configuracion({ barberiaId }) {
  const { servicios, barberos } = useDatos(barberiaId)

  const [nuevoServicio, setNuevoServicio] = useState({ nombre: '', precio: '', duracion: '' })
  const [nuevoBarbero, setNuevoBarbero] = useState({ nombre: '', horario: '' })
  const [editandoServicio, setEditandoServicio] = useState(null)
  const [editandoBarbero, setEditandoBarbero] = useState(null)
  const [tab, setTab] = useState('servicios')

  async function agregarServicio() {
    if (!nuevoServicio.nombre || !nuevoServicio.precio || !nuevoServicio.duracion) {
      alert('Completa todos los campos')
      return
    }
    await addDoc(collection(db, 'servicios'), {
      nombre: nuevoServicio.nombre,
      precio: +nuevoServicio.precio,
      duracion: +nuevoServicio.duracion,
      barberia_id: barberiaId,
    })
    setNuevoServicio({ nombre: '', precio: '', duracion: '' })
  }

  async function eliminarServicio(id) {
    if (confirm('¿Eliminar este servicio?')) {
      await deleteDoc(doc(db, 'servicios', id))
    }
  }

  async function guardarServicio(id) {
    await updateDoc(doc(db, 'servicios', id), {
      nombre: editandoServicio.nombre,
      precio: +editandoServicio.precio,
      duracion: +editandoServicio.duracion,
    })
    setEditandoServicio(null)
  }

  async function agregarBarbero() {
    if (!nuevoBarbero.nombre || !nuevoBarbero.horario) {
      alert('Completa todos los campos')
      return
    }
    await addDoc(collection(db, 'barberos'), {
      nombre: nuevoBarbero.nombre,
      horario: nuevoBarbero.horario,
      estado: 'activo',
      barberia_id: barberiaId,
    })
    setNuevoBarbero({ nombre: '', horario: '' })
  }

  async function eliminarBarbero(id) {
    if (confirm('¿Eliminar este barbero?')) {
      await deleteDoc(doc(db, 'barberos', id))
    }
  }

  async function guardarBarbero(id) {
    await updateDoc(doc(db, 'barberos', id), {
      nombre: editandoBarbero.nombre,
      horario: editandoBarbero.horario,
    })
    setEditandoBarbero(null)
  }

  return (
    <div>
      <h1 className="page-title">Configuración</h1>

      <div className="config-tabs">
        <button className={`config-tab ${tab === 'servicios' ? 'active' : ''}`} onClick={() => setTab('servicios')}>
          Servicios
        </button>
        <button className={`config-tab ${tab === 'barberos' ? 'active' : ''}`} onClick={() => setTab('barberos')}>
          Barberos
        </button>
      </div>

      {tab === 'servicios' && (
        <div>
          <div className="form-card" style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '1rem' }}>Agregar servicio</p>
            <div className="form-group">
              <label>Nombre</label>
              <input type="text" placeholder="Ej: Corte de cabello" value={nuevoServicio.nombre} onChange={e => setNuevoServicio({ ...nuevoServicio, nombre: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Precio (COP)</label>
                <input type="number" placeholder="15000" value={nuevoServicio.precio} onChange={e => setNuevoServicio({ ...nuevoServicio, precio: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Duración (min)</label>
                <input type="number" placeholder="30" value={nuevoServicio.duracion} onChange={e => setNuevoServicio({ ...nuevoServicio, duracion: e.target.value })} />
              </div>
            </div>
            <button className="btn-primary" onClick={agregarServicio}>+ Agregar servicio</button>
          </div>

          <div className="form-card">
            {servicios.length === 0 && <p style={{ color: '#aaa', textAlign: 'center', padding: '1rem' }}>No hay servicios aún</p>}
            {servicios.map(s => (
              <div key={s.id} className="turno-row">
                {editandoServicio?.id === s.id ? (
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', alignItems: 'center' }}>
                    <input className="form-group input" style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px' }} value={editandoServicio.nombre} onChange={e => setEditandoServicio({ ...editandoServicio, nombre: e.target.value })} />
                    <input className="form-group input" style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px' }} type="number" value={editandoServicio.precio} onChange={e => setEditandoServicio({ ...editandoServicio, precio: e.target.value })} />
                    <input className="form-group input" style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px' }} type="number" value={editandoServicio.duracion} onChange={e => setEditandoServicio({ ...editandoServicio, duracion: e.target.value })} />
                  </div>
                ) : (
                  <div className="turno-info">
                    <div>
                      <div className="turno-nombre">{s.nombre}</div>
                      <div className="turno-sub">${s.precio?.toLocaleString()} · {s.duracion} min</div>
                    </div>
                  </div>
                )}
                <div className="turno-acciones">
                  {editandoServicio?.id === s.id ? (
                    <>
                      <button className="btn-sm" onClick={() => guardarServicio(s.id)}>Guardar</button>
                      <button className="btn-sm" onClick={() => setEditandoServicio(null)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-sm" onClick={() => setEditandoServicio({ ...s })}>Editar</button>
                      <button className="btn-sm" style={{ color: '#c62828' }} onClick={() => eliminarServicio(s.id)}>Eliminar</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'barberos' && (
        <div>
          <div className="form-card" style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '1rem' }}>Agregar barbero</p>
            <div className="form-group">
              <label>Nombre completo</label>
              <input type="text" placeholder="Ej: Carlos Pérez" value={nuevoBarbero.nombre} onChange={e => setNuevoBarbero({ ...nuevoBarbero, nombre: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Horario</label>
              <input type="text" placeholder="Ej: Lun–Sáb · 8am–4pm" value={nuevoBarbero.horario} onChange={e => setNuevoBarbero({ ...nuevoBarbero, horario: e.target.value })} />
            </div>
            <button className="btn-primary" onClick={agregarBarbero}>+ Agregar barbero</button>
          </div>

          <div className="form-card">
            {barberos.length === 0 && <p style={{ color: '#aaa', textAlign: 'center', padding: '1rem' }}>No hay barberos aún</p>}
            {barberos.map(b => (
              <div key={b.id} className="turno-row">
                {editandoBarbero?.id === b.id ? (
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', alignItems: 'center' }}>
                    <input style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px' }} value={editandoBarbero.nombre} onChange={e => setEditandoBarbero({ ...editandoBarbero, nombre: e.target.value })} />
                    <input style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px' }} value={editandoBarbero.horario} onChange={e => setEditandoBarbero({ ...editandoBarbero, horario: e.target.value })} />
                  </div>
                ) : (
                  <div className="turno-info">
                    <div className="avatar">{b.nombre?.slice(0, 2).toUpperCase()}</div>
                    <div>
                      <div className="turno-nombre">{b.nombre}</div>
                      <div className="turno-sub">{b.horario}</div>
                    </div>
                  </div>
                )}
                <div className="turno-acciones">
                  {editandoBarbero?.id === b.id ? (
                    <>
                      <button className="btn-sm" onClick={() => guardarBarbero(b.id)}>Guardar</button>
                      <button className="btn-sm" onClick={() => setEditandoBarbero(null)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-sm" onClick={() => setEditandoBarbero({ ...b })}>Editar</button>
                      <button className="btn-sm" style={{ color: '#c62828' }} onClick={() => eliminarBarbero(b.id)}>Eliminar</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Configuracion