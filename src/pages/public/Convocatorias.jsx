import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { convocatoriaService } from '../../services/api';
import { formatFechaCorta, ESTADO_CONVOCATORIA_LABELS, TIPO_CONVOCATORIA_LABELS, getBadgeClaseConvocatoria } from '../../utils';
import { FaClipboardList, FaClock, FaUsers, FaCalendarAlt, FaFlagCheckered, FaFileDownload, FaTimes } from 'react-icons/fa';

export default function Convocatorias() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ tipo: '', estado: '' });
  const [pagination, setPagination] = useState({ total: 0, pagina: 1, totalPaginas: 1 });

  const fetchConvocatorias = async (pagina = 1) => {
    setLoading(true);
    try {
      const params = { pagina, limite: 10, ...filtros };
      if (!params.tipo) delete params.tipo;
      if (!params.estado) delete params.estado;
      const res = await convocatoriaService.listar(params);
      setConvocatorias(res.data.data);
      setPagination(res.data.pagination);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConvocatorias(1); }, [filtros]);

  return (
    <div className="animate-fadeInUp px-8 md:px-10 lg:px-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-blue-800 text-2xl mb-2 flex items-center gap-2">
          <FaClipboardList /> Convocatorias
        </h1>
        <p className="text-gray-500 m-0">Listado de convocatorias de contratación docente y administrativa</p>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded-2xl p-4 mb-6 flex flex-wrap gap-4 items-center">
        <select
          className="border border-gray-300 rounded-[10px] px-3 py-2 min-w-40"
          value={filtros.tipo}
          onChange={e => setFiltros(f => ({ ...f, tipo: e.target.value }))}
        >
          <option value="">Todos los tipos</option>
          {Object.entries(TIPO_CONVOCATORIA_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>

        <select
          className="border border-gray-300 rounded-[10px] px-3 py-2 min-w-40"
          value={filtros.estado}
          onChange={e => setFiltros(f => ({ ...f, estado: e.target.value }))}
        >
          <option value="">Todos los estados</option>
          {Object.entries(ESTADO_CONVOCATORIA_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>

        {(filtros.tipo || filtros.estado) && (
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded px-3 py-1 text-sm flex items-center gap-1"
            onClick={() => setFiltros({ tipo: '', estado: '' })}
          >
            <FaTimes /> Limpiar filtros
          </button>
        )}

        <div className="ml-auto text-gray-500 text-sm flex items-center">
          {pagination.total} convocatoria{pagination.total !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 flex flex-col items-center gap-2">
          <FaClock className="text-2xl" />
          Cargando convocatorias...
        </div>
      ) : convocatorias.length === 0 ? (
        <div className="bg-white shadow rounded p-12 text-center text-gray-500 flex flex-col items-center gap-4">
          <FaClipboardList className="text-3xl" />
          <p>No se encontraron convocatorias con los filtros seleccionados</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {convocatorias.map(conv => (
            <div key={conv.id} className="bg-white hover:shadow-lg transition-shadow rounded-2xl p-5">
              <div className="flex flex-wrap justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 items-center mb-2">
                    <span className={getBadgeClaseConvocatoria(conv.estado)}>
                      {ESTADO_CONVOCATORIA_LABELS[conv.estado]}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {TIPO_CONVOCATORIA_LABELS[conv.tipo] || conv.tipo}
                    </span>
                  </div>

                  <h2 className="text-blue-900 text-[1.05rem] mb-2 leading-snug">
                    {conv.titulo}
                  </h2>

                  <p className="text-gray-500 text-sm mb-3 leading-relaxed">
                    {conv.descripcion?.substring(0, 200)}
                    {conv.descripcion?.length > 200 ? '...' : ''}
                  </p>

                  <div className="flex flex-wrap gap-6 text-gray-400 text-xs">
                    <span className="flex items-center gap-1"><FaUsers /> {conv.plazas} plaza{conv.plazas > 1 ? 's' : ''}</span>
                    {conv.fechaInicio && <span className="flex items-center gap-1"><FaCalendarAlt /> Inicio: {formatFechaCorta(conv.fechaInicio)}</span>}
                    {conv.fechaFin && <span className="flex items-center gap-1"><FaFlagCheckered /> Cierre: {formatFechaCorta(conv.fechaFin)}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    to={`/convocatorias/${conv.id}`}
                    className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded text-sm text-center flex items-center justify-center gap-1"
                  >
                    Ver Detalle →
                  </Link>
                  {conv.baseUrl && (
                    <a
                      href={`http://localhost:5000${conv.baseUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm text-center no-underline flex items-center justify-center gap-1"
                    >
                      <FaFileDownload /> Bases
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination.totalPaginas > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pagination.totalPaginas }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => fetchConvocatorias(p)}
              className={`px-3 py-1 rounded border font-semibold ${
                p === pagination.pagina
                  ? 'bg-blue-800 text-white border-blue-800'
                  : 'bg-white text-blue-800 border-gray-300'
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