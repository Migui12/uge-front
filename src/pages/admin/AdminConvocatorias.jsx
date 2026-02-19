import { useState, useEffect } from 'react';
import { convocatoriaAdminService } from '../../services/api';
import { formatFechaCorta, getBadgeClaseConvocatoria, ESTADO_CONVOCATORIA_LABELS, TIPO_CONVOCATORIA_LABELS } from '../../utils';
import {
  FaClipboardList,
  FaPlus,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";

const emptyForm = {
  titulo: '', descripcion: '', tipo: 'DOCENTE', estado: 'PROXIMA',
  plazas: 1, requisitos: '', beneficios: '',
  fechaInicio: '', fechaFin: '', fechaResultados: '',
  archivo: null, base: null
};

export default function AdminConvocatorias() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({ tipo: '', estado: '' });
  const [pagination, setPagination] = useState({ pagina: 1, totalPaginas: 1, total: 0 });
  const [confirmDel, setConfirmDel] = useState(null);

  const fetch = async (pagina = 1) => {
    setLoading(true);
    try {
      const params = { pagina, limite: 15, ...filtros };
      if (!params.tipo) delete params.tipo;
      if (!params.estado) delete params.estado;
      const res = await convocatoriaAdminService.listar(params);
      setItems(res.data.data);
      setPagination(res.data.pagination);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(1); }, [filtros]);

  const handleSave = async () => {
    if (!form.titulo || !form.descripcion || !form.tipo) { setError('Título, descripción y tipo son requeridos'); return; }
    setSaving(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if ((k === 'archivo' || k === 'base') && v) fd.append(k, v);
        else if (k !== 'archivo' && k !== 'base' && v !== null && v !== '') fd.append(k, String(v));
      });
      modal === 'crear' ? await convocatoriaAdminService.crear(fd) : await convocatoriaAdminService.actualizar(modal.id, fd);
      setModal(null); fetch(pagination.pagina);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await convocatoriaAdminService.eliminar(id); setConfirmDel(null); fetch(pagination.pagina); } catch (e) {}
  };

  const openEditar = (item) => {
    setForm({
      titulo: item.titulo, descripcion: item.descripcion, tipo: item.tipo,
      estado: item.estado, plazas: item.plazas, requisitos: item.requisitos || '',
      beneficios: item.beneficios || '', fechaInicio: item.fechaInicio?.split('T')[0] || '',
      fechaFin: item.fechaFin?.split('T')[0] || '', fechaResultados: item.fechaResultados?.split('T')[0] || '',
      archivo: null, base: null
    });
    setModal(item); setError('');
  };

  return (
    <div className="animate-fadeInUp space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-blue-900">
            <FaClipboardList />
           Convocatorias
          </h1>
          <p className="text-sm text-slate-500">{pagination.total} convocatoria{pagination.total !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setModal('crear'); setError(''); }}
          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <FaPlus />
          Nueva Convocatoria
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-4">
        <select 
          value={filtros.tipo} 
          onChange={e => setFiltros(f => ({ ...f, tipo: e.target.value }))}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
        >
          <option value="">Todos los tipos</option>
          {Object.entries(TIPO_CONVOCATORIA_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>

        <select   
          value={filtros.estado} 
          onChange={e => setFiltros(f => ({ ...f, estado: e.target.value }))}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
        >
          <option value="">Todos los estados</option>
          {Object.entries(ESTADO_CONVOCATORIA_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-b-gray-200">
            <tr>
              {['Título', 'Tipo', 'Estado', 'Plazas', 'Inicio', 'Cierre', 'Acciones'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? 
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-500">Cargando...</td>
              </tr>
            : items.length === 0 ? 
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-500">No hay convocatorias</td>
              </tr>
            : items.map(item => (
              <tr key={item.id} className="border-b border-b-gray-200 hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-semibold text-slate-800 truncate max-w-xs">
                  {item.titulo}
                </td>
                <td className="px-4 py-3">{TIPO_CONVOCATORIA_LABELS[item.tipo]}</td>
                <td className="px-4 py-3">
                  <span className={`${getBadgeClaseConvocatoria(item.estado)} text-xs`}>{ESTADO_CONVOCATORIA_LABELS[item.estado]}</span>
                </td>
                <td className="px-4 py-3 text-center">{item.plazas}</td>
                <td className="px-4 py-3 text-slate-500">{formatFechaCorta(item.fechaInicio)}</td>
                <td className="px-4 py-3 text-slate-500">{formatFechaCorta(item.fechaFin)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditar(item)} 
                      className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-md">
                        <FaEdit />
                      </button>
                    <button 
                      onClick={() => setConfirmDel(item)} 
                      className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-md">
                        <FaTrash />
                      </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 my-6">

            <h3 className="flex items-center gap-2 text-lg font-bold text-blue-900 mb-6">
              {modal === "crear" ? <FaPlus /> : <FaEdit />}
              {modal === "crear" ? "Nueva Convocatoria" : "Editar Convocatoria"}
            </h3>

            {error && (
              <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                <FaExclamationTriangle />
                {error}
              </div>
            )}

            {/* Título */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Título *</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                value={form.titulo}
                onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
              />
            </div>

            {/* Tipo / Estado / Plazas */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo *</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                  value={form.tipo}
                  onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                >
                  {Object.entries(TIPO_CONVOCATORIA_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                  value={form.estado}
                  onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
                >
                  {Object.entries(ESTADO_CONVOCATORIA_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Plazas</label>
                <input
                  type="number"
                  min="1"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                  value={form.plazas}
                  onChange={e => setForm(f => ({ ...f, plazas: e.target.value }))}
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Descripción *</label>
              <textarea
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                value={form.descripcion}
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
              />
            </div>

            {/* Requisitos */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Requisitos</label>
              <textarea
                rows={4}
                placeholder="Un requisito por línea..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                value={form.requisitos}
                onChange={e => setForm(f => ({ ...f, requisitos: e.target.value }))}
              />
            </div>

            {/* Fechas */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {[
                ["fechaInicio", "Fecha Inicio"],
                ["fechaFin", "Fecha Cierre"],
                ["fechaResultados", "Fecha Resultados"]
              ].map(([field, label]) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input
                    type="date"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                    value={form[field]}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  />
                </div>
              ))}
            </div>

            {/* Archivos */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Archivo convocatoria</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={e => setForm(f => ({ ...f, archivo: e.target.files[0] || null }))}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 file:mr-3 file:px-3 file:py-1 file:border-0 file:bg-blue-900 file:hover:bg-red-950 file:text-white file:rounded-md file:text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bases del proceso</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={e => setForm(f => ({ ...f, base: e.target.files[0] || null }))}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 file:mr-3 file:px-3 file:py-1 file:border-0 file:bg-blue-900 file:text-white file:rounded-md file:text-xs"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm"
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm"
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <FaCheck />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">

            <div className="flex justify-center mb-4 text-red-500 text-4xl">
              <FaExclamationTriangle />
            </div>

            <h3 className="text-lg font-semibold mb-2">
              ¿Eliminar convocatoria?
            </h3>

            <p className="text-sm text-slate-500 mb-6">
              "{confirmDel.titulo}"
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirmDel(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm"
              >
                Cancelar
              </button>

              <button
                onClick={() => handleDelete(confirmDel.id)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                <FaTrash />
                Eliminar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}