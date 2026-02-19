import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  FaChartBar,
  FaBullhorn,
  FaClipboard,
  FaFolderOpen,
  FaFileAlt,
  FaUsers,
  FaDoorOpen,
  FaBars,
  FaGlobe,
  FaUser
} from 'react-icons/fa';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <FaChartBar />, exact: true },
  { to: '/admin/comunicados', label: 'Comunicados', icon: <FaBullhorn /> },
  { to: '/admin/convocatorias', label: 'Convocatorias', icon: <FaClipboard /> },
  { to: '/admin/tramites', label: 'Mesa de Partes', icon: <FaFolderOpen /> },
  { to: '/admin/documentos', label: 'Documentos', icon: <FaFileAlt /> },
  { to: '/admin/usuarios', label: 'Usuarios', icon: <FaUsers />, adminOnly: true }
];

export default function AdminLayout() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen z-50 flex flex-col bg-green-600 transition-[width] duration-300
        ${sidebarOpen ? 'w-60' : 'w-16'} overflow-x-hidden`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10 min-h-17.5">
          <div className="flex items-center justify-center w-9 h-9 bg-white rounded-full shrink-0">
            <FaUser />
          </div>
          {sidebarOpen && (
            <div>
              <div className="text-white font-bold text-sm">UGEL Admin</div>
              <div className="text-white/60 text-xs">Panel de Control</div>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-2 px-2 overflow-y-auto">
          {navItems.map(item => {
            if (item.adminOnly && !isAdmin()) return null;
            const active = isActive(item.to, item.exact);
            return (
              <Link
                key={item.to}
                to={item.to}
                title={!sidebarOpen ? item.label : ''}
                className={`flex items-center gap-3 px-4 py-2 text-sm transition-all duration-200
                  ${active
                    ? 'text-red-900 bg-gray-50 rounded-2xl font-semibold'
                    : 'text-white/80 font-normal'}
                `}
              >
                <span className="text-lg shrink-0">{item.icon}</span>
                {sidebarOpen && item.label}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          {sidebarOpen && (
            <>
              <div className="text-white text-sm font-semibold">
                {user?.nombre} {user?.apellido}
              </div>
              <div className="text-white/60 text-xs mb-2">{user?.rol}</div>
            </>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-2 py-1 text-xs font-medium text-white bg-red-800 rounded-md hover:bg-red-700 transition-colors"
          >
            <FaDoorOpen />
            {sidebarOpen && 'Cerrar Sesión'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`flex flex-col flex-1 min-h-screen transition-[margin-left] duration-300
          ${sidebarOpen ? 'ml-60' : 'ml-16'}
        `}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-50 flex items-center justify-between p-3.5 px-6 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 text-lg border rounded-md border-gray-200 hover:bg-gray-100 transition"
            >
              <FaBars />
            </button>
            <div>
              <span className="font-semibold text-blue-900">Panel Administrativo</span>
              <span className="text-gray-500 text-xs ml-1">Sistema UGEL</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="px-3 py-1 text-xs font-medium text-blue-900 border border-blue-900 rounded hover:bg-blue-50 transition"
            >
              <FaGlobe className="inline mr-1" /> Ver Sitio Público
            </Link>
            <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-blue-900 rounded-full">
              {user?.nombre?.charAt(0)}
              {user?.apellido?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}