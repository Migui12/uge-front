import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { comunicadoService, convocatoriaService } from '../../services/api';
import { formatFechaCorta, ESTADO_CONVOCATORIA_LABELS, getBadgeClaseConvocatoria } from '../../utils';
import { FaFolderOpen, FaClipboardList, FaBullhorn, FaSearch, FaFileAlt, FaCalendarAlt, FaUserAlt, FaTag } from 'react-icons/fa';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function Inicio() {
  const [comunicados, setComunicados] = useState([]);
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [com, conv] = await Promise.all([
          comunicadoService.listar({ limite: 6, destacado: undefined }),
          convocatoriaService.listar({ estado: 'ABIERTA', limite: 4 })
        ]);
        setComunicados(com.data.data);
        setConvocatorias(conv.data.data);
      } catch (e) {
        console.error('Error cargando inicio:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const imagenes = [
    "https://scontent.fjau4-1.fna.fbcdn.net/v/t39.30808-6/634744602_1245236057744102_4465847345168611184_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=7b2446&_nc_ohc=Y5f2r7naUf0Q7kNvwFcuEbW&_nc_oc=AdmFD1bgHYsXPImc_k28Clp-WtkziDn0Q3E-BlzmqvjnfXwQozrl2coKlkeEhCO_ilw&_nc_zt=23&_nc_ht=scontent.fjau4-1.fna&_nc_gid=slyAUt5fCKxXgw8_InIbRQ&oh=00_AfttpXyT5KzGPCOBHB5QeDQHr9DU_2wCNWLR1EpLLnL-VA&oe=699BE9C2"
  ];

  return (
    <div className="animate-fadeInUp px-4 md:px-8 lg:px-16">
      {/* Hero Banner */}
      <div className="relative mb-8 rounded-xl overflow-hidden h-100 md:h-125 lg:h-137.5">
        <img src={imagenes} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>

        {/* <div className="absolute -top-12.5 -right-12.5 w-75 h-75 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 left-[30%] w-50 h-50 bg-yellow-400/6 rounded-full" /> */}

        <div className="absolute inset-0 flex flex-col justify-center items-start px-6 md:px-16">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Unidad de Gestión<br />Educativa Satipo
          </h1>
          <p className="text-white/90 text-base md:text-lg mb-6 max-w-lg">
            Bienvenido al sistema institucional. Acceda a convocatorias, realice trámites en línea y consulte comunicados oficiales.
          </p>

          {/* Botones */}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/mesa-de-partes"
              className="flex items-center gap-2 bg-red-700 px-6 py-3 rounded-md font-semibold text-white hover:bg-red-800 transition"
            >
              <FaFolderOpen /> Mesa de Partes Virtual
            </Link>
            <Link
              to="/convocatorias"
              className="flex items-center gap-2 bg-white/70 px-6 py-3 rounded-md font-semibold text-gray-900 border border-white/50 hover:bg-white/90 transition"
            >
              <FaClipboardList /> Ver Convocatorias
            </Link>
          </div>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 mb-8">
        {[
          { to: '/comunicados', icon: <FaBullhorn className="w-6 h-6" />, label: 'Comunicados', color: '#003087' },
          { to: '/convocatorias', icon: <FaClipboardList className="w-6 h-6" />, label: 'Convocatorias', color: '#0056b8' },
          { to: '/mesa-de-partes', icon: <FaFolderOpen className="w-6 h-6" />, label: 'Mesa de Partes', color: '#d01c1c' },
          { to: '/consulta-expediente', icon: <FaSearch className="w-6 h-6" />, label: 'Consultar Expediente', color: '#059669' },
          { to: '/documentos', icon: <FaFileAlt className="w-6 h-6" />, label: 'Documentos', color: '#7c3aed' }
        ].map(item => (
          <Link key={item.to} to={item.to} className="flex flex-col items-center gap-2 bg-white p-5 rounded-md border border-gray-200 shadow-sm transform transition hover:-translate-y-1 hover:shadow-md">
            <div className="w-12 h-12 flex items-center justify-center rounded-full" style={{ background: item.color + '15' }}>
              {item.icon}
            </div>
            <span className="text-gray-800 text-[0.85rem] font-semibold">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Comunicados y Convocatorias */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-8">
        {/* Últimos comunicados */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="m-0 text-[1.1rem] font-bold text-blue-900 flex items-center gap-2"><FaBullhorn /> Últimos Comunicados</h2>
            <Link to="/comunicados" className="text-blue-700 text-[0.85rem] hover:underline">Ver todos →</Link>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Cargando...</div>
          ) : comunicados.length === 0 ? (
            <div className="card p-8 text-center text-gray-400">No hay comunicados disponibles</div>
          ) : (
            <div className="flex flex-col gap-3">
              {comunicados.map(com => (
                <Link key={com.id} to={`/comunicados/${com.id}`} className="text-gray-900 no-underline">
                  <div className="bg-white rounded-2xl p-4 border-l-4 hover:shadow-lg transition-shadow" style={{ borderColor: com.destacado ? '#d01c1c' : '#003087' }}>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="m-0 text-[0.9rem] font-semibold leading-[1.4]">{com.destacado && '⭐ '}{com.titulo}</h3>
                      <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-[0.7rem] whitespace-nowrap">{com.categoria}</span>
                    </div>
                    {com.resumen && <p className="m-0 mt-1 text-[0.8rem] text-gray-500 leading-5">{com.resumen.substring(0, 100)}...</p>}
                    <div className="text-[0.75rem] text-gray-400 mt-1 flex items-center gap-1"><FaCalendarAlt /> {formatFechaCorta(com.fechaPublicacion || com.createdAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Convocatorias abiertas */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="m-0 text-[1.1rem] font-bold text-blue-900 flex items-center gap-2"><FaClipboardList /> Convocatorias Abiertas</h2>
            <Link to="/convocatorias" className="text-blue-700 text-[0.85rem] hover:underline">Ver todas →</Link>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Cargando...</div>
          ) : convocatorias.length === 0 ? (
            <div className="card p-8 text-center text-gray-400">No hay convocatorias abiertas actualmente</div>
          ) : (
            <div className="flex flex-col gap-3">
              {convocatorias.map(conv => (
                <Link key={conv.id} to={`/convocatorias/${conv.id}`} className="text-gray-900 no-underline">
                  <div className="bg-white rounded-xl p-4 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="m-0 text-[0.9rem] font-semibold leading-[1.4]">{conv.titulo}</h3>
                      <span className={getBadgeClaseConvocatoria(conv.estado)}>
                        {ESTADO_CONVOCATORIA_LABELS[conv.estado]}
                      </span>
                    </div>
                    <div className="flex gap-4 text-[0.75rem] text-gray-500">
                      <span className="flex items-center gap-1"><FaTag /> {conv.tipo}</span>
                      <span className="flex items-center gap-1"><FaUserAlt /> {conv.plazas} plaza{conv.plazas > 1 ? 's' : ''}</span>
                      {conv.fechaFin && <span className="flex items-center gap-1"><FaCalendarAlt /> Hasta {formatFechaCorta(conv.fechaFin)}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}