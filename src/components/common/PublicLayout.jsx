import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaClock, FaBars, FaTimes } from 'react-icons/fa';

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/comunicados', label: 'Comunicados' },
  { to: '/convocatorias', label: 'Convocatorias' },
  { to: '/mesa-de-partes', label: 'Mesa de Partes' },
  { to: '/consulta-expediente', label: 'Consulta Expediente' },
  { to: '/documentos', label: 'Documentos' }
];

export default function PublicLayout() {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header sticky */}
      <header className="bg-green-600 sticky top-0 z-50 shadow-md">
        <div className="max-w-300 mx-auto px-6 py-3 flex items-center justify-between gap-2">
          {/* Logo + slogan */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-15 h-15 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center">
              <img
                src="https://ugelsatipo.gob.pe/wp-content/uploads/2025/06/LOGOTIPO_UGEL-SATIPO-300x86-1-e1748892509866.png"
                alt="UGEL Satipo"
                className="object-contain max-h-16"
              />
            </div>

            <div className="flex flex-col text-center md:text-left max-w-55 md:max-w-200">
              <div className="text-white font-semibold text-xs md:text-xl leading-tight">
                "Año de la recuperación y consolidación de la economía peruana"
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
                <FaPhone size={13} className="text-red-800" /> 01 064-25238
              </div>
              <div className="flex items-center justify-end gap-1">
                <FaEnvelope size={13} /> info@drej.edu.pe
              </div>
            </div>

            <a
              href="https://www.transparencia.gob.pe/enlaces/pte_transparencia_enlaces.aspx?id_entidad=14186"
              target="_blank"
              rel="noreferrer"
              className="hidden md:block"
            >
              <img
                src="https://ugelsatipo.gob.pe/wp-content/uploads/2025/06/pte_log-1024x545-1.jpg"
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
                className={`px-4 py-3 text-sm transition-all duration-200 whitespace-nowrap
                  ${isActive(link.to)
                    ? 'text-green-600 font-semibold border-b-4 border-green-600'
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

      {/* Contenido principal */}
      <main className="flex-1 mx-auto px-2 py-8 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-green-600 text-white">
        <div className="max-w-300 mx-auto px-6 py-8">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 mb-6">
            {/* Logo y descripción */}
            <div>
              <img
                src="https://ugelsatipo.gob.pe/wp-content/uploads/2025/06/LOGOTIPO_UGEL-SATIPO-300x86-1-e1748892509866.png"
                alt="UGEL Satipo"
                className="w-20 bg-white p-2 rounded-2xl mb-4"
              />
              <p className="text-sm font-semibold text-gray-800">
                Unidad de Gestión Educativa Satipo comprometida con la calidad educativa de nuestra región.
              </p>
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h4 className="text-red-900 mb-3 font-semibold">ENLACES RÁPIDOS</h4>
              <div className="flex flex-col gap-2">
                {navLinks.map(l => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="text-white text-[0.8rem] hover:text-gray-300"
                  >
                    › {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="text-red-900 mb-3 font-semibold">CONTACTO</h4>
              <div className="text-[0.8rem] leading-loose">
                <div className="flex items-center gap-2"><FaMapMarkerAlt className="w-4 h-4" /> Santa Leonor N° 123, Satipo</div>
                <div className="flex items-center gap-2"><FaPhone className="w-4 h-4" /> 01 064-25238</div>
                <div className="flex items-center gap-2"><FaEnvelope className="w-4 h-4" /> info@drej.edu.pe</div>
                <div className="flex items-center gap-2"><FaClock className="w-4 h-4" /> Lun-Vie: 8:00am - 4:00pm</div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/30 pt-4 text-center text-[0.75rem] font-semibold text-gray-900">
            © {new Date().getFullYear()} Unidad de Gestión Educativa Satipo. Todos los derechos reservados. |
            <Link to="/admin/login" className="text-gray-200 ml-1 hover:text-white">Acceso Administrativo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
