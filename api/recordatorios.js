import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: 'barberia-turnos-16cf3',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()

export default async function handler(req, res) {
  const mañana = new Date()
  mañana.setDate(mañana.getDate() + 1)
  const fechaMañana = mañana.toISOString().split('T')[0]

  const snapshot = await db.collection('turnos')
    .where('fecha', '==', fechaMañana)
    .get()

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