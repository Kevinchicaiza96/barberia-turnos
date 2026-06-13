import { useState, useEffect } from 'react'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'

const SUPERADMIN_UID = 'eVRosML8s5cjLl88bsfmz9Y7b'

function Superadmin({ usuario }) {
  const [barberias, setBarberias] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      const snapshot = await getDocs(collection(db, 'barberias'))
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      setBarberias(data)
      setCargando(false)
    }
    cargar()
  }, [])

  async function toggleActiva(id, activa) {
    await updateDoc(doc(db, 'barberias', id), { activa: !activa })
    setBarberias(prev => prev.map(b => b.id === id ? { ...b, activa: !activa } : b))
  }

  if (!usuario || !usuario.uid.startsWith(SUPERADMIN_UID.slice(0, 10))) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2 style={{ textAlign: 'center' }}>Acceso denegado</h2>
          <p style={{ textAlign: 'center', color: '#888', marginTop: '0.5rem', fontSize: '14px' }}>
            No tienes permisos para ver esta página.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">Superadmin</h1>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="metric-card">
          <div className="metric-label">Total barberías</div>
          <div className="metric-value">{barberias.length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Activas</div>
          <div className="metric-value">{barberias.filter(b => b.activa).length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Inactivas</div>
          <div className="metric-value">{barberias.filter(b => !b.activa).length}</div>
        </div>
      </div>

      <div className="form-card">
        {cargando && <p style={{ color: '#aaa', textAlign: 'center', padding: '1rem' }}>Cargando...</p>}
        {barberias.map(b => (
          <div key={b.id} className="turno-row">
            <div className="turno-info">
              <div className="avatar">{b.nombre?.slice(0, 2).toUpperCase()}</div>
              <div>
                <div className="turno-nombre">{b.nombre}</div>
                <div className="turno-sub">{b.email} · {b.ciudad} · Plan {b.plan}</div>
                <div className="turno-sub">{b.fechaRegistro ? new Date(b.fechaRegistro).toLocaleDateString('es-CO') : 'Sin fecha'}</div>
              </div>
            </div>
            <div className="turno-acciones">
              <span className={`badge ${b.activa ? 'badge-success' : 'badge-danger'}`}>
                {b.activa ? 'Activa' : 'Inactiva'}
              </span>
              <button className="btn-sm" onClick={() => toggleActiva(b.id, b.activa)}>
                {b.activa ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Superadmin