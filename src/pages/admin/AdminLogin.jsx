import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Credenciales inválidas. Verifique email y contraseña.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-700 via-green-600 to-emerald-800 px-6">
      
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 text-white">
        
        {/* Logo + Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <img
                src="https://ugelsatipo.gob.pe/wp-content/uploads/2025/06/LOGOTIPO_UGEL-SATIPO-300x86-1-e1748892509866.png"
                alt="UGEL Satipo"
                className="h-14 object-contain"
              />
            </div>
          </div>

          <h1 className="text-2xl font-semibold tracking-wide">
            Panel Administrativo
          </h1>
          <p className="text-sm text-emerald-100 mt-1">
            Unidad de Gestión Educativa Local
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/40 text-red-100 text-sm p-3 rounded-xl mb-6 backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm mb-2 text-emerald-100">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e =>
                setForm(f => ({ ...f, email: e.target.value }))
              }
              placeholder="usuario@ugel.gob.pe"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
                         placeholder-emerald-100 text-white 
                         focus:outline-none focus:ring-2 focus:ring-white/60 
                         transition duration-200"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-emerald-100">
              Contraseña
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e =>
                setForm(f => ({ ...f, password: e.target.value }))
              }
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
                         placeholder-emerald-100 text-white 
                         focus:outline-none focus:ring-2 focus:ring-white/60 
                         transition duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-emerald-700 font-semibold
                       hover:bg-emerald-100 transition duration-300
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-sm text-emerald-200 hover:text-white transition"
          >
            ← Volver al sitio público
          </a>
        </div>
      </div>
    </div>
  );
}
