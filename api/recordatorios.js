import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyB_MmjGXADXS_q1TRrDqWVZG1wv6Dh3QfU",
  authDomain: "barberia-turnos-16cf3.firebaseapp.com",
  projectId: "barberia-turnos-16cf3",
  storageBucket: "barberia-turnos-16cf3.firebasestorage.app",
  messagingSenderId: "790226542430",
  appId: "1:790226542430:web:d3d3638b0c6e6fcb88f9cf"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default async function handler(req, res) {
  const mañana = new Date()
  mañana.setDate(mañana.getDate() + 1)
  const fechaMañana = mañana.toISOString().split('T')[0]

  const q = query(collection(db, 'turnos'), where('fecha', '==', fechaMañana))
  const snapshot = await getDocs(q)

  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_FROM

  let enviados = 0
  let errores = 0

  for (const doc of snapshot.docs) {
    const turno = doc.data()
    if (!turno.telefono) continue
    if (turno.estado === 'cancelado') continue

    const mensaje = `✂️ *BarberApp* — Recordatorio de turno\n\nHola *${turno.nombre}*, te recordamos que tienes un turno mañana:\n\n📋 Servicio: ${turno.servicio}\n📅 Fecha: ${turno.fecha}\n🕐 Hora: ${turno.hora}\n\nSi necesitas cancelar responde con tu código de cancelación.`

    try {
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: from,
          To: `whatsapp:${turno.telefono}`,
          Body: mensaje,
        }),
      })
      const data = await response.json()
      if (data.sid) enviados++
      else errores++
    } catch {
      errores++
    }
  }

  res.status(200).json({ ok: true, enviados, errores, total: snapshot.size })
}