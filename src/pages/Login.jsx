import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  async function entrar() {
    if (!email || !password) {
      setError('Completa todos los campos')
      return
    }
    setCargando(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/agenda')
    } catch {
      setError('Email o contraseña incorrectos')
    }
    setCargando(false)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-brand">✂️ BarberApp</div>
        <h2 className="login-title">Panel de administración</h2>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && entrar()}
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && entrar()}
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button className="btn-primary" onClick={entrar} disabled={cargando}>
          {cargando ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </div>
  )
}

export default Login