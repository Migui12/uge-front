import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { comunicadoService, convocatoriaService, noticiaService } from '../../services/api';
import { formatFechaCorta, ESTADO_CONVOCATORIA_LABELS, getBadgeClaseConvocatoria } from '../../utils';
import { FaFolderOpen, FaClipboardList, FaBullhorn, FaSearch, FaFileAlt, FaCalendarAlt, FaUserAlt, FaTag, FaNewspaper, FaStar,
  FaUniversity, FaBook, FaTheaterMasks, FaFutbol, FaHandshake, FaTrophy
 } from 'react-icons/fa';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { configService } from '../../services/api';

const CAT_COLORES = {
  INSTITUCIONAL: { color: '#003087', bg: '#dbeafe', icon: <FaUniversity /> },
  ACADEMICO: { color: '#0056b8', bg: '#e0f2fe', icon: <FaBook/> },
  CULTURAL: { color: '#7c3aed', bg: '#ede9fe', icon: <FaTheaterMasks/> },
  DEPORTIVO: { color: '#059669', bg: '#dcfce7', icon: <FaFutbol/> },
  SOCIAL: { color: '#d97706', bg: '#fef3c7', icon: <FaHandshake/> },
  LOGRO: { color: '#d01c1c', bg: '#fee2e2', icon: <FaTrophy/> },
};

const BG_FALLBACKS = ['#003087', '#0056b8', '#d01c1c', '#059669', '#7c3aed', '#d97706'];

export default function Inicio() {
  const [comunicados, setComunicados] = useState([]);
  const [convocatorias, setConvocatorias] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [com, conv, not, conf] = await Promise.all([
          comunicadoService.listar({ limite: 6, destacado: undefined }),
          convocatoriaService.listar({ estado: 'ABIERTA', limite: 4 }),
          noticiaService.listar({ limite: 6 }),
          configService.obtener()
        ]);

        setComunicados(com.data.data);
        setConvocatorias(conv.data.data);
        setNoticias(not.data.data);
        setBanner(conf.data.data);

      } catch (e) {
        console.error('Error cargando inicio:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const destacada = noticias.find(n => n.destacada) || noticias[0];
  const secundarias = noticias.filter(n => n !== destacada).slice(0, 4);

  const bannerUrl = banner?.imagen;

  return (
    <div className="animate-fadeInUp px-4 md:px-8 lg:px-16">
      {/* Hero Banner */}
      <div className="relative mb-8 rounded-xl overflow-hidden h-100 md:h-125 lg:h-137.5">
        {bannerUrl ? (
          <img src={bannerUrl} alt="Banner" className='w-full h-full object-cover' />
        ) : (
          <div
            className='w-full h-full bg-[#003087]'
          />
        )}
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
          { to: '/noticias', icon: <FaNewspaper className='w-6 h-6 text-blue-600' />, label: 'Noticias', color: '#003087' },
          { to: '/comunicados', icon: <FaBullhorn className="w-6 h-6 text-blue-700" />, label: 'Comunicados', color: '#003087' },
          { to: '/convocatorias', icon: <FaClipboardList className="w-6 h-6 text-blue-800" />, label: 'Convocatorias/CAS', color: '#0056b8' },
          { to: '/mesa-de-partes', icon: <FaFolderOpen className="w-6 h-6 text-red-700" />, label: 'Mesa de Partes', color: '#d01c1c' },
          { to: '/consulta-expediente', icon: <FaSearch className="w-6 h-6 text-green-600" />, label: 'Consultar Expediente', color: '#059669' },
          { to: '/documentos', icon: <FaFileAlt className="w-6 h-6 text-[#7c3aed]" />, label: 'Documentos', color: '#7c3aed' }
        ].map(item => (
          <Link key={item.to} to={item.to} className="flex flex-col items-center gap-2 bg-white p-5 rounded-md border border-gray-200 shadow-sm transform transition hover:-translate-y-1 hover:shadow-md">
            <div className="w-12 h-12 flex items-center justify-center rounded-full" style={{ background: item.color + '15' }}>
              {item.icon}
            </div>
            <span className="text-gray-800 text-[0.85rem] font-semibold">{item.label}</span>
          </Link>
        ))}
      </div>
      <section className="bg-white mb-6 p-6 rounded-3xl shadow-sm border border-slate-100">

        {/* Header sección */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <FaNewspaper className="text-blue-600" />
              Noticias
            </h2>
            <p className="text-sm text-slate-500">
              Logros, eventos e iniciativas de nuestra comunidad educativa
            </p>
          </div>

          <Link
            to="/noticias"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Ver todas →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-400">
            <div className="text-lg animate-pulse">Cargando noticias...</div>
          </div>
        ) : noticias.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <FaNewspaper className="w-12 h-12 mb-3" />
            <p>No hay noticias publicadas aún</p>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${secundarias.length > 0 ? "md:grid-cols-2" : "grid-cols-1"
              }`}
          >

            {/* NOTICIA DESTACADA */}
            {destacada && (
              <Link to={`/noticias/${destacada.id}`} className="group">
                <article className="h-full flex flex-col rounded-2xl overflow-hidden bg-gray-100 transition-all duration-300 hover:-translate-y-1 shadow-md border border-slate-100">

                  {/* Imagen */}
                  <div className="relative h-56 overflow-hidden">

                    <div
                      className="absolute inset-0 bg-center bg-cover"
                      style={{
                        backgroundImage: destacada.imagenUrl
                          ? `url(http://localhost:5000${destacada.imagenUrl})`
                          : `linear-gradient(135deg, ${BG_FALLBACKS[destacada.id % BG_FALLBACKS.length]
                          }, ${BG_FALLBACKS[destacada.id % BG_FALLBACKS.length]
                          }aa)`
                      }}
                    />

                    {/* Overlay oscuro si hay imagen */}
                    {destacada.imagenUrl && (
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className="text-white flex items-center justify-center gap-1 text-xs font-bold px-3 py-1 rounded-full shadow-md"
                        style={{
                          background:
                            (CAT_COLORES[destacada.categoria] ||
                              CAT_COLORES.INSTITUCIONAL).color
                        }}
                      >
                        {(CAT_COLORES[destacada.categoria] ||
                          CAT_COLORES.INSTITUCIONAL).icon}{" "}
                        {destacada.categoria}
                      </span>

                      {destacada.destacada && (
                        <span className="flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                          <FaStar /> Destacada
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-slate-800 mb-2 leading-snug group-hover:text-blue-700 transition-colors">
                      {destacada.titulo}
                    </h3>

                    <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">
                      {destacada.resumen}
                    </p>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 flex items-center gap-2">
                        <FaCalendarAlt /> {" "}
                        {formatFechaCorta(
                          destacada.fechaPublicacion || destacada.createdAt
                        )}
                      </span>

                      <span className="font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                        Leer más →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* NOTICIAS SECUNDARIAS */}
            {secundarias.length > 0 && (
              <div className="flex flex-col gap-4">

                {secundarias.map((noticia) => {
                  const cat =
                    CAT_COLORES[noticia.categoria] ||
                    CAT_COLORES.INSTITUCIONAL;

                  return (
                    <Link
                      key={noticia.id}
                      to={`/noticias/${noticia.id}`}
                      className="group"
                    >
                      <article className="flex rounded-xl overflow-hidden bg-gray-100 border border-slate-100 transition-all duration-300 hover:shadow-lg hover:translate-x-1">

                        {/* Thumbnail */}
                        <div
                          className="w-24 bg-center text-white bg-cover flex items-center justify-center text-2xl"
                          style={{
                            backgroundImage: noticia.imagenUrl
                              ? `url(http://localhost:5000${noticia.imagenUrl})`
                              : `linear-gradient(135deg, ${BG_FALLBACKS[
                              noticia.id % BG_FALLBACKS.length
                              ]
                              }, ${BG_FALLBACKS[
                              noticia.id % BG_FALLBACKS.length
                              ]
                              }aa)`
                          }}
                        >
                          {!noticia.imagenUrl && cat.icon}
                        </div>

                        {/* Info */}
                        <div className="p-4 flex-1 min-w-0">
                          <span
                            className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full mb-2"
                            style={{
                              background: cat.bg,
                              color: cat.color
                            }}
                          >
                            {cat.icon} {noticia.categoria}
                          </span>

                          <h4 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
                            {noticia.titulo}
                          </h4>

                          <span className="text-xs flex items-center gap-1 text-slate-400 mt-1">
                            <FaCalendarAlt/> {" "}
                            {formatFechaCorta(
                              noticia.fechaPublicacion ||
                              noticia.createdAt
                            )}
                          </span>
                        </div>
                      </article>
                    </Link>
                  );
                })}

                {/* Botón ver todas */}
                <Link
                  to="/noticias"
                  className="mt-auto flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-blue-600 font-semibold text-sm hover:bg-blue-50 hover:border-blue-200 transition-all"
                >
                  <FaNewspaper /> Ver todas las noticias →
                </Link>
              </div>
            )}
          </div>
        )}
      </section>


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
                  <div className="bg-white rounded-2xl p-4 border-l-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1" style={{ borderColor: com.destacado ? '#d01c1c' : '#003087' }}>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="m-0 text-[0.9rem] font-semibold leading-[1.4] flex items-center gap-1">{com.destacado && (<FaStar className='text-yellow-500'/>)}{com.titulo}</h3>
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
                  <div className="bg-white rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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