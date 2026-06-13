import { useState } from 'react'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

function Cancelar() {
  const [codigo, setCodigo] = useState('')
  const [turno, setTurno] = useState(null)
  const [error, setError] = useState('')
  const [cancelado, setCancelado] = useState(false)
  const [buscando, setBuscando] = useState(false)

  async function buscar() {
    if (!codigo.trim()) return
    setBuscando(true)
    setError('')
    setTurno(null)

    const q = query(collection(db, 'turnos'), where('codigo', '==', codigo.toUpperCase()))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      setError('No se encontró ningún turno con ese código')
      setBuscando(false)
      return
    }

    const data = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }

    if (data.estado === 'cancelado') {
      setError('Este turno ya fue cancelado')
      setBuscando(false)
      return
    }

    if (data.estado === 'completado') {
      setError('Este turno ya fue completado y no se puede cancelar')
      setBuscando(false)
      return
    }

    setTurno(data)
    setBuscando(false)
  }

  async function cancelar() {
    if (!turno) return
    await updateDoc(doc(db, 'turnos', turno.id), { estado: 'cancelado' })
    setCancelado(true)
  }

  if (cancelado) {
    return (
      <div className="confirm-card">
        <div className="confirm-icon" style={{ background: '#ffebee', color: '#c62828' }}>✕</div>
        <h2>Turno cancelado</h2>
        <p style={{ color: '#888', marginTop: '0.5rem' }}>Tu turno ha sido cancelado exitosamente.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">Cancelar turno</h1>
      <div className="form-card">
        <div className="form-group">
          <label>Código de tu turno</label>
          <input
            type="text"
            placeholder="Ej: A3X9KL"
            value={codigo}
            onChange={e => setCodigo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && buscar()}
            style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '18px' }}
          />
        </div>

        {error && <p style={{ color: '#c62828', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

        <button className="btn-primary" onClick={buscar} disabled={buscando}>
          {buscando ? 'Buscando...' : 'Buscar turno'}
        </button>

        {turno && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f5f5f5', borderRadius: '10px' }}>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>Turno encontrado:</p>
            <p><strong>{turno.nombre}</strong></p>
            <p style={{ fontSize: '14px', color: '#444', marginTop: '4px' }}>{turno.servicio} · {turno.barbero}</p>
            <p style={{ fontSize: '14px', color: '#444' }}>{turno.fecha} a las {turno.hora}</p>
            <button
              className="btn-primary"
              style={{ marginTop: '1rem', background: '#c62828' }}
              onClick={cancelar}
            >
              Confirmar cancelación
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cancelar