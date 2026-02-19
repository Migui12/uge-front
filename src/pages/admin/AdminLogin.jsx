// src/pages/admin/AdminLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales inválidas. Verifique email y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #003087 0%, #001f5c 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'white', borderRadius: '1rem',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>
        {/* Franja peruana */}
        <div className="stripe-peru" style={{ height: '5px' }} />

        <div style={{ padding: '2.5rem' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '70px', height: '70px',
              background: 'linear-gradient(135deg, #003087, #0056b8)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem', fontSize: '2rem'
            }}>
              <img src="https://ugelsatipo.gob.pe/wp-content/uploads/2025/06/LOGOTIPO_UGEL-SATIPO-300x86-1-e1748892509866.png" alt="" />
            </div>
            <h1 style={{ margin: '0 0 0.3rem', color: '#003087', fontSize: '1.3rem' }}>
              Panel Administrativo
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
              Unidad de Gestión Educativa Local
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fee2e2', color: '#b91c1c',
              padding: '0.75rem 1rem', borderRadius: '0.5rem',
              marginBottom: '1.25rem', fontSize: '0.875rem',
              display: 'flex', gap: '0.5rem', alignItems: 'center'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="usuario@ugel.gob.pe"
                required
                autoFocus
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-input"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.95rem' }}
            >
              {loading ? '⏳ Verificando...' : '🔐 Iniciar Sesión'}
            </button>
          </form>

          {/* <div style={{
            marginTop: '1.5rem', padding: '1rem',
            background: '#f8fafc', borderRadius: '0.5rem',
            fontSize: '0.8rem', color: '#64748b'
          }}>
            <strong>Credenciales de prueba:</strong><br />
            Admin: admin@ugel.gob.pe / Admin2024!<br />
            Operador: operador@ugel.gob.pe / Operador2024!
          </div> */}

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <a href="/" style={{ color: '#0056b8', fontSize: '0.85rem', textDecoration: 'none' }}>
              ← Volver al sitio público
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
