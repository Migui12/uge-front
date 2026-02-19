// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Páginas públicas
import Inicio from './pages/public/Inicio';
import Convocatorias from './pages/public/Convocatorias';
import ConvocatoriaDetalle from './pages/public/ConvocatoriaDetalle';
import MesaDePartes from './pages/public/MesaDePartes';
import ConsultaExpediente from './pages/public/ConsultaExpediente';
import Comunicados from './pages/public/Comunicados';
import ComunicadoDetalle from './pages/public/ComunicadoDetalle';
import Documentos from './pages/public/Documentos';

// Páginas admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminComunicados from './pages/admin/AdminComunicados';
import AdminConvocatorias from './pages/admin/AdminConvocatorias';
import AdminTramites from './pages/admin/AdminTramites';
import AdminDocumentos from './pages/admin/AdminDocumentos';
import AdminUsuarios from './pages/admin/AdminUsuarios';

// Layouts
import PublicLayout from './components/common/PublicLayout';
import AdminLayout from './components/common/AdminLayout';

// Proteger rutas admin
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px', border: '4px solid #003087',
            borderTopColor: 'transparent', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto'
          }} />
          <p style={{ color: '#003087', marginTop: '1rem' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Inicio />} />
            <Route path="comunicados" element={<Comunicados />} />
            <Route path="comunicados/:id" element={<ComunicadoDetalle />} />
            <Route path="convocatorias" element={<Convocatorias />} />
            <Route path="convocatorias/:id" element={<ConvocatoriaDetalle />} />
            <Route path="mesa-de-partes" element={<MesaDePartes />} />
            <Route path="consulta-expediente" element={<ConsultaExpediente />} />
            <Route path="documentos" element={<Documentos />} />
          </Route>

          {/* LOGIN ADMIN */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* RUTAS ADMIN PROTEGIDAS */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="comunicados" element={<AdminComunicados />} />
            <Route path="convocatorias" element={<AdminConvocatorias />} />
            <Route path="tramites" element={<AdminTramites />} />
            <Route path="documentos" element={<AdminDocumentos />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
