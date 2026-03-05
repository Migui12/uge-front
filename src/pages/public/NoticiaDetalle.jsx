// src/pages/public/NoticiaDetalle.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BACKEND_URL, noticiaService } from '../../services/api';
import { formatFecha } from '../../utils';
import {
  FaUniversity,
  FaBook,
  FaTheaterMasks,
  FaFutbol,
  FaHandshake,
  FaTrophy,
  FaTimesCircle,
  FaArrowLeft,
  FaStar,
  FaPen,
  FaCalendarAlt,
  FaEye,
  FaNewspaper
} from 'react-icons/fa';

const CATEGORIAS = {
  INSTITUCIONAL: { label: 'Institucional', color: 'bg-blue-900', icon: FaUniversity },
  ACADEMICO:     { label: 'Académico',     color: 'bg-blue-700', icon: FaBook },
  CULTURAL:      { label: 'Cultural',      color: 'bg-violet-600', icon: FaTheaterMasks },
  DEPORTIVO:     { label: 'Deportivo',     color: 'bg-emerald-600', icon: FaFutbol },
  SOCIAL:        { label: 'Social',        color: 'bg-amber-600', icon: FaHandshake },
  LOGRO:         { label: 'Logro',         color: 'bg-red-600', icon: FaTrophy },
};

export default function NoticiaDetalle() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relacionadas, setRelacionadas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await noticiaService.obtener(id);
        setNoticia(res.data.data);

        const rel = await noticiaService.listar({
          limite: 3,
          categoria: res.data.data.categoria
        });

        setRelacionadas(
          rel.data.data.filter(n => n.id !== parseInt(id))
        );
      } catch {
        setNoticia(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-20 text-slate-500">
        Cargando...
      </div>
    );

  if (!noticia)
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <FaTimesCircle className="text-5xl text-red-600 mx-auto mb-4" />
        <p className="text-red-600 mb-4 font-semibold">
          Noticia no encontrada
        </p>
        <Link
          to="/noticias"
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg transition"
        >
          <FaArrowLeft />
          Volver a noticias
        </Link>
      </div>
    );

  const cat = CATEGORIAS[noticia.categoria] || CATEGORIAS.INSTITUCIONAL;
  const IconCategoria = cat.icon;

  return (
    <div className="animate-fadeInUp px-4 md:px-10 lg:px-20">
      <Link
        to="/noticias"
        className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 text-sm mb-6 transition"
      >
        <FaArrowLeft />
        Volver a noticias
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* ARTÍCULO */}
        <article className='bg-white p-4 rounded-2xl shadow'>
          {/* Imagen */}
          <div
            className={`w-full h-80 rounded-xl overflow-hidden mb-6 flex items-center justify-center ${!noticia.imagenUrl ? cat.color : ''}`}
            style={
              noticia.imagenUrl
                ? {
                    backgroundImage: `url(${BACKEND_URL}${noticia.imagenUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : {}
            }
          >
            {!noticia.imagenUrl && (
              <div className="text-center text-white">
                <IconCategoria className="text-6xl mx-auto" />
                <div className="font-semibold mt-2 opacity-90">
                  {cat.label}
                </div>
              </div>
            )}
          </div>

          {/* Meta badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`inline-flex items-center gap-2 ${cat.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
              <IconCategoria />
              {cat.label}
            </span>

            {noticia.destacada && (
              <span className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                <FaStar />
                Noticia Destacada
              </span>
            )}
          </div>

          <h1 className="text-2xl font-extrabold text-blue-900 mb-4 leading-tight">
            {noticia.titulo}
          </h1>

          <p className="italic text-slate-600 border-l-4 border-blue-700 pl-4 mb-6 leading-relaxed font-medium">
            {noticia.resumen}
          </p>

          {/* Autor */}
          <div className="flex flex-wrap gap-6 text-xs border-b border-b-gray-300 pb-5 mb-6">
            {noticia.autor && (
              <span className="flex items-center gap-2">
                <FaPen />
                {noticia.autor.nombre} {noticia.autor.apellido}
              </span>
            )}
            <span className="flex items-center gap-2">
              <FaCalendarAlt />
              {formatFecha(noticia.fechaPublicacion || noticia.createdAt)}
            </span>
            <span className="flex items-center gap-2">
              <FaEye />
              {noticia.vistas} lecturas
            </span>
          </div>

          {/* Contenido */}
          <div
            className="prose max-w-none prose-slate"
            dangerouslySetInnerHTML={{ __html: noticia.contenido }}
          />

          {/* Etiquetas */}
          {noticia.etiquetas && (
            <div className="mt-8 pt-4 border-t border-t-gray-300">
              <span className="text-xs text-slate-500 mr-2">
                Etiquetas:
              </span>
              {noticia.etiquetas.split(',').map(tag => (
                <span
                  key={tag}
                  className="inline-block bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full mr-2 mt-2"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* SIDEBAR */}
        <aside className="sticky top-10 h-fit">
          <div className="bg-white rounded-xl shadow-md p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-blue-900 border-b pb-2 mb-4">
              <FaNewspaper />
              Noticias relacionadas
            </h3>

            {relacionadas.length === 0 ? (
              <p className="text-xs text-slate-400">
                No hay noticias relacionadas
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {relacionadas.slice(0, 3).map(n => (
                  <Link key={n.id} to={`/noticias/${n.id}`}>
                    <div className="p-3 bg-slate-50 hover:bg-sky-50 rounded-lg transition">
                      <div className="text-xs font-semibold text-slate-800 mb-1 leading-snug">
                        {n.titulo}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <FaCalendarAlt />
                        {formatFecha(n.fechaPublicacion || n.createdAt)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <Link
              to="/noticias"
              className="flex justify-center mt-4 text-sm bg-slate-200 hover:bg-slate-300 py-2 rounded-lg transition"
            >
              Ver todas las noticias
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}