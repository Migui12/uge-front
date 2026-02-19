import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaCalendarAlt, FaUser, FaEye, FaPaperclip } from 'react-icons/fa';
import { comunicadoService } from '../../services/api';
import { formatFechaCorta } from '../../utils';

const CATEGORIAS = ['GENERAL', 'ACADEMICO', 'ADMINISTRATIVO', 'URGENTE'];

export default function Comunicados() {
  const [comunicados, setComunicados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState('');
  const [pagination, setPagination] = useState({ total: 0, pagina: 1, totalPaginas: 1 });

  const fetch = async (pagina = 1) => {
    setLoading(true);
    try {
      const params = { pagina, limite: 10 };
      if (categoria) params.categoria = categoria;
      const res = await comunicadoService.listar(params);
      setComunicados(res.data.data);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(1); }, [categoria]);

  const getCategoriaColor = (cat) => {
    const colors = {
      URGENTE: 'bg-red-600 text-white',
      ACADEMICO: 'bg-blue-500 text-white',
      ADMINISTRATIVO: 'bg-green-600 text-white',
      GENERAL: 'bg-gray-600 text-white'
    };
    return colors[cat] || 'bg-gray-100 text-gray-700';
  };

  const getBorderColor = (cat) => {
    const colors = {
      URGENTE: 'border-red-600',
      ACADEMICO: 'border-blue-600',
      ADMINISTRATIVO: 'border-green-600',
      GENERAL: 'border-gray-400'
    };
    return colors[cat] || 'border-gray-400';
  };

  return (
    <div className="animate-fadeInUp px-4 md:px-10 lg:px-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-900 mb-1">Comunicados Oficiales</h1>
        <p className="text-gray-500">Información y anuncios de la Unidad de Gestión Educativa Local</p>
      </div>

      {/* Filtro de categorías */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setCategoria('')}
          className={`px-4 py-1 rounded-full font-medium text-sm ${
            !categoria ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          Todos
        </button>
        {CATEGORIAS.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoria(cat === categoria ? '' : cat)}
            className={`px-4 py-1 rounded-full font-medium text-sm ${
              categoria === cat ? 'text-white ' + getCategoriaColor(cat).split(' ')[0] : 'bg-gray-100 text-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando...</div>
      ) : comunicados.length === 0 ? (
        <div className="card py-12 text-center text-gray-400">No hay comunicados disponibles</div>
      ) : (
        <div className="flex flex-col gap-4">
          {comunicados.map(com => (
            <Link key={com.id} to={`/comunicados/${com.id}`}>
              <div className={`bg-white rounded-2xl p-4 border-l-4 ${com.destacado ? 'border-red-600' : getBorderColor(com.categoria)} hover:shadow-lg transition-shadow`}>
                <div className="flex justify-between gap-4 items-start">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      {com.destacado && (
                        <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                          <FaStar /> Destacado
                        </span>
                      )}
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${getCategoriaColor(com.categoria)}`}>
                        {com.categoria}
                      </span>
                    </div>
                    <h2 className="text-gray-900 text-lg font-semibold mb-1">{com.titulo}</h2>
                    {com.resumen && (
                      <p className="text-gray-500 text-sm leading-relaxed mb-2">{com.resumen}</p>
                    )}
                    <div className="flex gap-4 text-gray-400 text-xs">
                      <span className="flex items-center gap-1"><FaCalendarAlt /> {formatFechaCorta(com.fechaPublicacion || com.createdAt)}</span>
                      {com.autor && <span className="flex items-center gap-1"><FaUser /> {com.autor.nombre} {com.autor.apellido}</span>}
                      <span className="flex items-center gap-1"><FaEye /> {com.vistas} vistas</span>
                    </div>
                  </div>
                  {com.archivoUrl && (
                    <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"><FaPaperclip /> Adjunto</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Paginación */}
      {pagination.totalPaginas > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pagination.totalPaginas }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => fetch(p)}
              className={`px-3 py-1 rounded-md font-semibold border ${
                p === pagination.pagina
                  ? 'bg-blue-900 text-white border-blue-900'
                  : 'bg-white text-blue-900 border-gray-300'
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
