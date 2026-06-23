import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export function useDatos(barberiaId) {
  const [servicios, setServicios] = useState([])
  const [barberos, setBarberos] = useState([])
  const [bloqueos, setBloqueos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!barberiaId) return

    const qServicios = query(collection(db, 'servicios'), where('barberia_id', '==', barberiaId))
    const qBarberos = query(collection(db, 'barberos'), where('barberia_id', '==', barberiaId))
    const qBloqueos = query(collection(db, 'bloqueos'), where('barberia_id', '==', barberiaId))

    const unsubServicios = onSnapshot(qServicios, snap => {
      setServicios(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setCargando(false)
    })

    const unsubBarberos = onSnapshot(qBarberos, snap => {
      setBarberos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })

    const unsubBloqueos = onSnapshot(qBloqueos, snap => {
      setBloqueos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })

    return () => {
      unsubServicios()
      unsubBarberos()
      unsubBloqueos()
    }
  }, [barberiaId])

  return { servicios, barberos, bloqueos, cargando }
}