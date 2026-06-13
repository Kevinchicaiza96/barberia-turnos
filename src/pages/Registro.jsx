import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

function Registro() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [telefono, setTelefono] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [listo, setListo] = useState(false)

  async function registrar() {
    if (!nombre || !email || !password || !telefono || !ciudad) {
      setError('Por favor completa todos los campos')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setCargando(true)
    setError('')

    try {
      const credencial = await createUserWithEmailAndPassword(auth, email, password)
      const uid = credencial.user.uid

      await setDoc(doc(db, 'barberias', uid), {
        nombre,
        email,
        telefono,
        ciudad,
        plan: 'basico',
        activa: true,
        admin_uid: uid,
        fechaRegistro: new Date().toISOString(),
      })

      setListo(true)
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        setError('Ese email ya está registrado')
      } else if (e.code === 'auth/invalid-email') {
        setError('El email no es válido')
      } else {
        setError('Hubo un error al registrarse. Intenta de nuevo.')
      }
    }

    setCargando(false)
  }

  if (listo) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="confirm-icon" style={{ margin: '0 auto 1rem' }}>✓</div>
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>¡Barbería registrada!</h2>
          <p style={{ textAlign: 'center', color: '#888', fontSize: '14px' }}>
            Tu cuenta ha sido creada exitosamente. Ya puedes empezar a gestionar tus turnos.
          </p>
          <a href="/" className="btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', textDecoration: 'none' }}>
            Ir a la app
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-brand">✂️ BarberApp</div>
        <h2 className="login-title">Registra tu barbería</h2>

        <div className="form-group">
          <label>Nombre de la barbería</label>
          <input
            type="text"
            placeholder="¿Cómo se llama tu barbería?"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Ciudad</label>
          <input
            type="text"
            placeholder="¿En qué ciudad está ubicada?"
            value={ciudad}
            onChange={e => setCiudad(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Teléfono</label>
          <input
            type="tel"
            placeholder="Número de contacto"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Escribe tu correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && registrar()}
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button className="btn-primary" onClick={registrar} disabled={cargando}>
          {cargando ? 'Registrando...' : 'Crear cuenta gratis'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '1rem' }}>
          ¿Ya tienes cuenta? <a href="/admin" style={{ color: '#1a1a1a', fontWeight: 500 }}>Inicia sesión</a>
        </p>
      </div>
    </div>
  )
}

export default Registro