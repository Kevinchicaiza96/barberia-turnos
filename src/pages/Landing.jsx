import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing">

      {/* HERO */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-badge">✂️ Para barberías en Colombia</div>
          <h1 className="landing-h1">Gestiona tu barbería<br />sin complicaciones</h1>
          <p className="landing-sub">Turnos online, agenda en tiempo real, historial de clientes y asistente IA — todo en un solo lugar.</p>
          <div className="landing-ctas">
            <button className="btn-landing-primary" onClick={() => navigate('/registro')}>
              Empieza gratis
            </button>
            <button className="btn-landing-secondary" onClick={() => navigate('/')}>
              Ver demo
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="landing-features">
        <h2 className="landing-h2">Todo lo que necesitas</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Reservas online</h3>
            <p>Tus clientes reservan su turno desde el celular, 24/7, sin llamadas.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Agenda en tiempo real</h3>
            <p>Ve todos los turnos del día actualizados al instante en tu panel.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Gestión de barberos</h3>
            <p>Administra tu equipo, horarios y turnos por barbero fácilmente.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Panel de ingresos</h3>
            <p>Visualiza tus ganancias diarias y mensuales con gráficas claras.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>Asistente IA</h3>
            <p>Un asistente inteligente que responde preguntas de tus clientes.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Acceso seguro</h3>
            <p>Panel privado para el admin con login seguro y datos protegidos.</p>
          </div>
        </div>
      </section>

      {/* PRECIOS */}
      <section className="landing-precios">
        <h2 className="landing-h2">Planes simples y claros</h2>
        <div className="precios-grid">
          <div className="precio-card">
            <div className="precio-nombre">Básico</div>
            <div className="precio-valor">$59.000<span>/mes</span></div>
            <ul className="precio-lista">
              <li>✓ Reservas online</li>
              <li>✓ Agenda en tiempo real</li>
              <li>✓ Hasta 2 barberos</li>
              <li>✓ Historial de clientes</li>
              <li>✗ Asistente IA</li>
              <li>✗ Panel de ingresos</li>
            </ul>
            <button className="btn-landing-secondary" onClick={() => navigate('/registro')}>
              Empezar
            </button>
          </div>
          <div className="precio-card precio-destacado">
            <div className="precio-badge">Más popular</div>
            <div className="precio-nombre">Pro</div>
            <div className="precio-valor">$99.000<span>/mes</span></div>
            <ul className="precio-lista">
              <li>✓ Todo lo del plan básico</li>
              <li>✓ Barberos ilimitados</li>
              <li>✓ Asistente IA</li>
              <li>✓ Panel de ingresos</li>
              <li>✓ Soporte prioritario</li>
              <li>✓ Cancelación de turnos</li>
            </ul>
            <button className="btn-landing-primary" onClick={() => navigate('/registro')}>
              Empezar
            </button>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="landing-cta-final">
        <h2>¿Listo para modernizar tu barbería?</h2>
        <p>Únete a las barberías que ya gestionan sus turnos con BarberApp.</p>
        <button className="btn-landing-primary" onClick={() => navigate('/registro')}>
          Crear cuenta gratis
        </button>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <p>✂️ BarberApp · Hecho para barberías colombianas</p>
      </footer>

    </div>
  )
}

export default Landing