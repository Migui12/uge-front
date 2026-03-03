// src/pages/admin/AdminTramites.jsx
import { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTimes, FaPaperclip, FaSave, FaSpinner, FaFolderOpen } from 'react-icons/fa';
import { tramiteAdminService } from '../../services/api';
import { ESTADO_TRAMITE_LABELS, TIPO_TRAMITE_LABELS, formatFechaCorta, getBadgeClaseTramite } from '../../utils';
import Table from '../../components/ui/Table';

export default function AdminTramites() {
  const [tramites, setTramites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ estado: '', tipoTramite: '', busqueda: '' });
  const [pagination, setPagination] = useState({ total: 0, pagina: 1, totalPaginas: 1 });
  const [selected, setSelected] = useState(null);
  const [modalEstado, setModalEstado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetch = async (pagina = 1) => {
    setLoading(true);
    try {
      const params = { pagina, limite: 15, ...filtros };
      if (!params.estado) delete params.estado;
      if (!params.tipoTramite) delete params.tipoTramite;
      if (!params.busqueda) delete params.busqueda;
      const res = await tramiteAdminService.listar(params);
      setTramites(res.data.data);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(1); }, [filtros]);

  const handleCambiarEstado = async () => {
    if (!nuevoEstado) return;
    setUpdating(true);
    try {
      await tramiteAdminService.cambiarEstado(modalEstado.id, {
        estado: nuevoEstado,
        observaciones
      });
      setModalEstado(null);
      setNuevoEstado('');
      setObservaciones('');
      fetch(pagination.pagina);
      if (selected?.id === modalEstado.id) {
        const res = await tramiteAdminService.obtener(modalEstado.id);
        setSelected(res.data.data);
      }
    } finally {
      setUpdating(false);
    }
  };

  const columns = [
    {key: "expediente", label: "Expediente"},
    {key: "solicitante", label: "Solicitante"},
    {key: "tipo", label: "Tipo"},
    {key: "asunto", label: "Asunto"},
    {key: "estado", label: "Estado"},
    {key: "fecha", label: "Fecha"},
    {key: "acciones", label: "Acciones"},
  ]

  return (
    <div className="animate-fadeInUp space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-blue-900">
            <FaFolderOpen />
            Mesa de Partes
          </h1>
          <p className="text-sm text-slate-500">
            {pagination.total} trámite{pagination.total !== 1 ? 's' : ''} registrado{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow p-4 mb-4 flex flex-wrap gap-3">
        <input 
          className="flex-1 min-w-45 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
          placeholder="Buscar por expediente, nombre, DNI..."
          value={filtros.busqueda}
          onChange={e => setFiltros(f => ({ ...f, busqueda: e.target.value }))}
        />

        <select 
          className="w-full sm:w-auto sm:min-w-35 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
          value={filtros.estado}
          onChange={e => setFiltros(f => ({ ...f, estado: e.target.value }))}
        >
          <option value="">Todos los estados</option>
          {Object.entries(ESTADO_TRAMITE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>

        <select 
          className="w-full sm:w-auto sm:min-w-35 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
          value={filtros.tipoTramite}
          onChange={e => setFiltros(f => ({ ...f, tipoTramite: e.target.value }))}
        >
          <option value="">Todos los tipos</option>
          {Object.entries(TIPO_TRAMITE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className={`grid gap-4 ${selected ? 'lg:grid-cols-[1fr_380px]' : 'grid-cols-1'}`}>
        {/* Tabla */}
        <Table 
          columns={columns}
          data={tramites}
          loading={loading}
          paginacion={pagination}
          onPageChange={(p) => fetch(p)}
          emptyMessage='No se encontraron trámites'
          renderRow={(t) => (
            <tr 
              key={t.id} 
              className={`hover:bg-slate-50 ${
                selected?.id === t.id ? "bg-blue-50" : ""
              }`} 
            >
              <td className="px-4 py-3 font-mono font-semibold text-blue-900 text-xs">
                {t.numeroExpediente}
              </td>
              <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">
                      {t.nombre} {t.apellido}
                    </div>
                    <div className="text-xs text-slate-400">{t.dni}</div>
                  </td>

                  <td className="px-4 py-3 text-xs text-slate-600">
                    {TIPO_TRAMITE_LABELS[t.tipoTramite] || t.tipoTramite}
                  </td>

                  <td className="px-4 py-3 max-w-50 truncate text-xs">
                    {t.asunto}
                  </td>

                  <td className="px-4 py-3">
                    <span className={getBadgeClaseTramite(t.estado)}>
                      {ESTADO_TRAMITE_LABELS[t.estado]}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                    {formatFechaCorta(t.createdAt)}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelected(selected?.id === t.id ? null : t)}
                        className="bg-slate-100 hover:bg-slate-200 p-2 rounded-lg text-slate-600"
                      >
                        <FaEye size={14} />
                      </button>

                      <button
                        onClick={() => { 
                          setModalEstado(t); 
                          setNuevoEstado(t.estado); 
                          setObservaciones(t.observaciones || ''); }}
                        className="bg-blue-900 hover:bg-blue-800 p-2 rounded-lg text-white"
                      >
                        <FaEdit size={14} />
                      </button>
                    </div>
                  </td>
            </tr>
          )}
        />

        {/* Panel detalle */}
        {selected && (
          <div className="bg-white rounded-xl shadow-sm p-5 sticky top-20 self-start">
            <div className="flex justify-between mb-4">
              <h3 className="text-sm font-semibold text-blue-900">Detalle del Trámite</h3>
              <button 
                onClick={() => setSelected(null)} 
                className="text-slate-500 hover:text-slate-700"
              >
                <FaTimes size={14} />
              </button>
            </div>

            <div className="font-mono font-bold text-blue-900 mb-3 text-sm">
              {selected.numeroExpediente}
            </div>
            <span className={`${getBadgeClaseTramite(selected.estado)} inline-block mb-4`}>
              {ESTADO_TRAMITE_LABELS[selected.estado]}
            </span>

            {[
              ['Nombre', `${selected.nombre} ${selected.apellido}`],
              ['DNI', selected.dni],
              ['Email', selected.email],
              ['Teléfono', selected.telefono || '—'],
              ['Tipo', TIPO_TRAMITE_LABELS[selected.tipoTramite]],
              ['Fecha', formatFechaCorta(selected.createdAt)]
            ].map(([k, v]) => (
              <div key={k} style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', minWidth: '70px' }}>{k}:</span>
                <span style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 500 }}>{v}</span>
              </div>
            ))}

            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '0.375rem', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Asunto</div>
              <div style={{ fontSize: '0.8rem', color: '#1e293b' }}>{selected.asunto}</div>
            </div>

            {selected.archivoUrl && (
              <a href={`http://localhost:5000${selected.archivoUrl}`} target="_blank" rel="noreferrer"
                style={{ color: '#0056b8', fontSize: '0.8rem', display: 'block', marginBottom: '0.75rem' }}>
                📎 Ver archivo adjunto
              </a>
            )}

            {selected.observaciones && (
              <div style={{ background: '#fefce8', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#854d0e', fontWeight: 600 }}>Observaciones:</div>
                <div style={{ fontSize: '0.8rem', color: '#713f12' }}>{selected.observaciones}</div>
              </div>
            )}

            <button
              onClick={() => { 
                setModalEstado(selected); 
                setNuevoEstado(selected.estado); 
                setObservaciones(selected.observaciones || ''); }}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              >
                <FaEdit size={14} />
                Cambiar Estado
            </button>
          </div>
        )}
      </div>

      {/* Modal cambio de estado */}
      {modalEstado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Actualizar Estado del Trámite</h3>

            <div className='text-xs font-semibold text-gray-600 mb-2'>
              {modalEstado.numeroExpediente} — {modalEstado.nombre} {modalEstado.apellido}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Nuevo Estado *</label>
              <select 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                value={nuevoEstado} 
                onChange={e => setNuevoEstado(e.target.value)}
              >
                {Object.entries(ESTADO_TRAMITE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Observaciones</label>
              <textarea 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                rows={3}
                placeholder="Notas internas sobre el trámite..."
                value={observaciones}
                onChange={e => setObservaciones(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setModalEstado(null)}
                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-sm"
              >
                Cancelar
              </button>

              <button
                onClick={handleCambiarEstado} 
                disabled={updating}
                className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-sm flex items-center gap-2"
              >
                {updating ? <FaSpinner className="animate-spin" /> : <FaSave />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}