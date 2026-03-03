// src/pages/public/Noticias.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { noticiaService } from '../../services/api';
import { formatFecha } from '../../utils';
import {
  FaUniversity,
  FaBook,
  FaTheaterMasks,
  FaFutbol,
  FaHandshake,
  FaTrophy,
  FaNewspaper,
  FaCalendarAlt,
  FaEye,
  FaStar
} from 'react-icons/fa';

const CATEGORIAS = {
  INSTITUCIONAL: { label: 'Institucional', color: 'bg-blue-900', light: 'bg-blue-100', icon: FaUniversity },
  ACADEMICO:     { label: 'Académico',     color: 'bg-blue-700', light: 'bg-sky-100', icon: FaBook },
  CULTURAL:      { label: 'Cultural',      color: 'bg-violet-600', light: 'bg-violet-100', icon: FaTheaterMasks },
  DEPORTIVO:     { label: 'Deportivo',     color: 'bg-emerald-600', light: 'bg-emerald-100', icon: FaFutbol },
  SOCIAL:        { label: 'Social',        color: 'bg-amber-600', light: 'bg-amber-100', icon: FaHandshake },
  LOGRO:         { label: 'Logro',         color: 'bg-red-600', light: 'bg-red-100', icon: FaTrophy },
};

function NoticiaCard({ noticia }) {
  const cat = CATEGORIAS[noticia.categoria] || CATEGORIAS.INSTITUCIONAL;
  const Icon = cat.icon;

  return (
    <Link to={`/noticias/${noticia.id}`} className="group block">
      <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-slate-100 hover:-translate-y-1">
        
        {/* Imagen */}
        <div className="relative h-52 overflow-hidden">
          {noticia.imagenUrl ? (
            <>
              <img
                src={`http://localhost:5000${noticia.imagenUrl}`}
                alt={noticia.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
            </>
          ) : (
            <div className={`w-full h-full flex flex-col items-center justify-center text-white ${cat.color}`}>
              <Icon className="text-5xl opacity-90" />
              <span className="text-xs mt-2 tracking-widest uppercase opacity-80">
                {cat.label}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold text-white ${cat.color}`}>
              <Icon className="text-xs" />
              {cat.label}
            </span>

            {noticia.destacada && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-yellow-400 text-yellow-900">
                <FaStar className="text-xs" />
                Destacada
              </span>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-slate-800 text-base leading-snug mb-2 group-hover:text-blue-800 transition">
            {noticia.titulo}
          </h3>

          <p className="text-sm text-slate-500 line-clamp-2 mb-4">
            {noticia.resumen}
          </p>

          <div className="flex items-center justify-between mt-auto text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <FaCalendarAlt />
              {formatFecha(noticia.fechaPublicacion || noticia.createdAt)}
            </span>

            <span className="flex items-center gap-1">
              <FaEye />
              {noticia.vistas}
            </span>
          </div>

          {noticia.etiquetas && (
            <div className="flex flex-wrap gap-2 mt-4">
              {noticia.etiquetas.split(',').slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className={`text-[11px] font-medium px-2 py-1 rounded-full ${cat.light} text-slate-700`}
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState('');
  const [pagination, setPagination] = useState({ total: 0, pagina: 1, totalPaginas: 1 });

  const fetch = async (pagina = 1) => {
    setLoading(true);
    try {
      const params = { pagina, limite: 9 };
      if (categoria) params.categoria = categoria;
      const res = await noticiaService.listar(params);
      setNoticias(res.data.data);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(1); }, [categoria]);

  return (
    <div className="animate-fadeInUp px-4 md:px-10 lg:px-20">

      {/* HEADER MODERNO */}
      <div className="relative overflow-hidden rounded-3xl mb-10 p-5 bg-linear-to-br from-blue-900 via-blue-800 to-blue-700 text-white shadow-xl">
        <div className="flex items-center gap-6">
          <FaNewspaper className="text-5xl opacity-90" />
          <div>
            <h1 className="text-3xl font-extrabold mb-2">Noticias</h1>
            <p className="text-blue-100 max-w-xl">
              Entérate de los últimos logros, eventos.
            </p>
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="flex flex-wrap gap-3 items-center mb-8">
        <button
          onClick={() => setCategoria('')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            !categoria
              ? 'bg-blue-900 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Todas
        </button>

        {Object.entries(CATEGORIAS).map(([k, v]) => {
          const Icon = v.icon;
          const active = categoria === k;

          return (
            <button
              key={k}
              onClick={() => setCategoria(active ? '' : k)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
                active
                  ? `${v.color} text-white shadow-md`
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="text-xs" />
              {v.label}
            </button>
          );
        })}

        <div className="ml-auto text-sm text-slate-400">
          {pagination.total} noticia{pagination.total !== 1 ? 's' : ''}
        </div>
      </div>

      {/* CONTENIDO */}
      {loading ? (
        <div className="text-center py-24 text-slate-500">
          Cargando noticias...
        </div>
      ) : noticias.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-slate-300">
          <FaNewspaper className="text-4xl text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">
            No hay noticias disponibles en esta categoría
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {noticias.map(noticia => (
            <NoticiaCard key={noticia.id} noticia={noticia} />
          ))}
        </div>
      )}

      {/* PAGINACIÓN MODERNA */}
      {pagination.totalPaginas > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: pagination.totalPaginas }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => fetch(p)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                p === pagination.pagina
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}