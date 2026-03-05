import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FaEnvelope, FaPhone, FaBars, FaTimes } from 'react-icons/fa';
import { navLinks } from './navegacion';

export default function Header({ cog, loading }) {
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <header className="bg-green-600 top-0 z-50 shadow-md">
                <div className="max-w-350 mx-auto px-6 py-3 flex items-center justify-between gap-2">
                    {/* Logo + slogan */}
                    <Link to="/" className="flex items-center gap-3 shrink-0">
                        <div className="w-15 h-15 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center">
                            <img
                                src='UGEL.png'
                                alt="UGEL Satipo"
                                className="object-contain max-h-16"
                            />
                        </div>

                        <div className="flex flex-col text-center md:text-left max-w-55 md:max-w-200">
                            <div className="text-white font-semibold text-xs md:text-xl leading-tight">
                                "{loading ? 'Cargando...' : cog?.titulo}"
                            </div>

                            <div className="text-white font-semibold text-xs md:text-sm leading-4 mt-1">
                                {new Date().toLocaleDateString('es-PE', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>

                            <div className="text-red-900 text-xs font-semibold mt-1">
                                "Educación de Calidad para Todos"
                            </div>
                        </div>
                    </Link>


                    {/* Contacto + mobile menu */}
                    <div className="flex items-center gap-4 ml-auto">
                        <div className="hidden md:flex flex-col text-gray-200 text-xs gap-1 text-right">
                            <div className="flex items-center gap-1 justify-end">
                                <FaPhone size={13} className="text-red-800" /> {loading ? 'Cargando...' : cog?.telefono}
                            </div>
                            <div className="flex items-center justify-end gap-1">
                                <FaEnvelope size={13} /> {loading ? 'Cargando...' : cog?.correo}
                            </div>
                        </div>

                        <a
                            href="https://www.transparencia.gob.pe/enlaces/pte_transparencia_enlaces.aspx?id_entidad=14186"
                            target="_blank"
                            rel="noreferrer"
                            className="hidden md:block"
                        >
                            <img
                                src='transparencia.jpg'
                                alt="Portal de Transparencia"
                                className="w-24 md:w-32 rounded-2xl"
                            />
                        </a>

                        {/* Botón drawer mobile */}
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="md:hidden border border-white/30 text-white p-2 rounded"
                        >
                            <FaBars size={20} />
                        </button>
                    </div>
                </div>

                {/* Navegación desktop */}
                <nav className="hidden md:block bg-red-900">
                    <div className="max-w-300 mx-auto px-6 flex">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-4 py-3 text-sm font-bold transition-all duration-200 whitespace-nowrap
                    ${isActive(link.to)
                                        ? 'text-green-600 border-b-4 border-green-600'
                                        : 'text-white hover:text-green-600 font-normal border-b-4 border-transparent'}
                    `}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </nav>
            </header>

            {/* Drawer mobile */}
            <div className={`fixed inset-0 z-50 md:hidden transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
                <div className="relative bg-red-900 w-64 h-full p-6 flex flex-col gap-4 text-white shadow-lg">
                    <button
                        onClick={() => setDrawerOpen(false)}
                        className="self-end p-2 text-white"
                    >
                        <FaTimes size={20} />
                    </button>
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`py-2 px-3 text-sm rounded transition-colors
                    ${isActive(link.to) ? 'bg-green-600 font-semibold' : 'hover:bg-green-700'}
                `}
                            onClick={() => setDrawerOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}