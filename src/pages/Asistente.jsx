import { useState } from 'react'

const mensajesIniciales = [
  {
    id: 1,
    rol: 'bot',
    texto: '¡Hola! Soy el asistente de la barbería. Puedo ayudarte con horarios, precios y reservas. ¿En qué te ayudo?'
  }
]

function Asistente() {
  const [mensajes, setMensajes] = useState(mensajesIniciales)
  const [input, setInput] = useState('')
  const [cargando, setCargando] = useState(false)

  async function enviar() {
    const texto = input.trim()
    if (!texto || cargando) return

    const nuevosMensajes = [...mensajes, { id: Date.now(), rol: 'user', texto }]
    setMensajes(nuevosMensajes)
    setInput('')
    setCargando(true)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: `Eres el asistente virtual de una barbería en Colombia llamada BarberApp.
          Ayudas a clientes y barberos con información sobre turnos, precios y servicios.
          Barberos: Andrés García (Lun-Sáb 8am-5pm), Luis Martínez (Mar-Dom 9am-6pm), Felipe Ruiz (Lun-Vie 10am-7pm).
          Servicios: Corte $15.000, Corte + barba $25.000, Arreglo de barba $12.000, Tintura $35.000.
          Horario general: Lunes a Sábado 8am–7pm.
          Responde siempre en español, de forma amable y breve.`,
          messages: nuevosMensajes
            .filter(m => m.rol !== 'bot' || m.id !== 1)
            .map(m => ({ role: m.rol === 'user' ? 'user' : 'assistant', content: m.texto }))
        })
      })

      const data = await res.json()
      const respuesta = data.content[0].text

      setMensajes(prev => [...prev, { id: Date.now(), rol: 'bot', texto: respuesta }])
    } catch {
      setMensajes(prev => [...prev, {
        id: Date.now(),
        rol: 'bot',
        texto: 'Hubo un error al conectar. Intenta de nuevo.'
      }])
    }

    setCargando(false)
  }

  return (
    <div>
      <h1 className="page-title">Asistente IA</h1>

      <div className="form-card chat-container">
        <div className="chat-area">
          {mensajes.map(m => (
            <div key={m.id} className={`mensaje ${m.rol === 'user' ? 'mensaje-user' : 'mensaje-bot'}`}>
              {m.texto}
            </div>
          ))}
          {cargando && (
            <div className="mensaje mensaje-bot cargando">
              Escribiendo...
            </div>
          )}
        </div>

        <div className="chat-input-row">
          <input
            type="text"
            placeholder="Escribe tu pregunta..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && enviar()}
          />
          <button className="btn-primary" style={{ width: 'auto', padding: '9px 20px', marginTop: 0 }} onClick={enviar}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Asistente