export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { to, nombre, servicio, fecha, hora } = req.body

  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_FROM

  const mensaje = `✂️ *BarberApp* — Recordatorio de turno\n\nHola *${nombre}*, te recordamos que tienes un turno mañana:\n\n📋 Servicio: ${servicio}\n📅 Fecha: ${fecha}\n🕐 Hora: ${hora}\n\nSi necesitas cancelar responde con tu código de cancelación.`

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      From: from,
      To: `whatsapp:${to}`,
      Body: mensaje,
    }),
  })

  const data = await response.json()

  if (data.sid) {
    res.status(200).json({ ok: true, sid: data.sid })
  } else {
    res.status(400).json({ ok: false, error: data.message })
  }
}