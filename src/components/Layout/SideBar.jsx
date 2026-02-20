import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    FaChartBar,
    FaBullhorn,
    FaClipboard,
    FaFolderOpen,
    FaFileAlt,
    FaUsers,
    FaDoorOpen,
    FaUser
} from 'react-icons/fa';

import { useAuth } from '../../hooks/useAuth';

const navItems = [
    { to: '/admin', label: 'Dashboard', icon: <FaChartBar />, exact: true },
    { to: '/admin/comunicados', label: 'Comunicados', icon: <FaBullhorn /> },
    { to: '/admin/convocatorias', label: 'Convocatorias', icon: <FaClipboard /> },
    { to: '/admin/tramites', label: 'Mesa de Partes', icon: <FaFolderOpen /> },
    { to: '/admin/documentos', label: 'Documentos', icon: <FaFileAlt /> },
    { to: '/admin/usuarios', label: 'Usuarios', icon: <FaUsers />, adminOnly: true }
];

export default function SideBar({ open, setOpen }) {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path, exact) =>
        exact ? location.pathname === path : location.pathname.startsWith(path);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <>
            {open && (
                <div
                    className='fixed inset-0 bg-black/40 z-40 lg:hidden'
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`fixed lg:static inset-y-0 left-0 overflow-hidden z-100 w-68
                    shrink-0 bg-green-600 min-h-screen overflow-y-auto flex flex-col transition-all duration-300
                    ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
                `}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 p-4 border-b border-white/10 min-h-17.5">
                    <div className="flex items-center justify-center w-9 h-9 bg-white rounded-full shrink-0">
                        <FaUser />
                    </div>
                    <div>
                        <div className="text-white font-bold text-sm">UGEL Admin</div>
                        <div className="text-white/60 text-xs">Panel de Control</div>
                    </div>
                </div>

                {/* Nav items */}
                <nav className="flex-1 py-2 px-2 overflow-y-auto space-y-1">
                    {navItems.map(item => {
                        if (item.adminOnly && !isAdmin()) return null;
                        const active = isActive(item.to, item.exact);
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setOpen(false)}
                                className={`flex items-center gap-3 px-4 py-2 text-sm rounded-xl transition-all duration-200
                                    ${active
                                        ? 'text-red-900 bg-gray-50 font-semibold'
                                        : 'text-white/80 font-normal hover:bg-gray-50/20'
                                    }
                                `}
                            >
                                <span className="text-lg shrink-0">
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User info */}
                <div className="p-4 border-t border-white/10 bg-black/20">
                    <div className="text-white text-sm font-semibold">
                        {user?.nombre} {user?.apellido}
                    </div>
                    <div className="text-white/60 text-xs mb-2">{user?.rol}</div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-2 py-2 text-xs font-medium text-white bg-red-800 rounded-xl hover:bg-red-700 transition-colors"
                    >
                        <FaDoorOpen />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>
        </>
    );
}
