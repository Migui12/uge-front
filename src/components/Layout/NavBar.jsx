import { Link } from 'react-router-dom';
import { FaBars, FaGlobe } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

export default function NavBar({ open, setOpen }) {
    const { user } = useAuth();
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between p-3.5 px-6 bg-white shadow-sm">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setOpen(prev => !prev)}
                    className="p-1.5 text-lg border rounded-md border-gray-200 hover:bg-gray-100 transition"
                >
                    <FaBars />
                </button>
                <div className='flex items-center'>
                    <span className="font-semibold text-sm md:text-xl text-blue-900">Panel Administrativo</span>
                    <span className="text-gray-500 text-xs ml-1 hidden md:block mt-1">Sistema UGEL</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Link
                    to="/"
                    target="_blank"
                    className="px-3 py-1 text-xs font-medium flex items-center justify-center text-blue-900 border border-blue-900 rounded hover:bg-blue-50 transition"
                >
                    <FaGlobe className="inline mr-1 h-5 w-5 md:w-3 md:h-3" /> <span className='hidden md:block'>Ver Sitio Público</span>
                </Link>
                <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-blue-900 rounded-full">
                    {user?.nombre?.charAt(0)}
                    {user?.apellido?.charAt(0)}
                </div>
            </div>
        </header>
    );
}
