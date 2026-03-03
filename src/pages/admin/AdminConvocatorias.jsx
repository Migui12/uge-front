import { useState, useEffect } from 'react';
import { convocatoriaAdminService } from '../../services/api';
import { formatFechaCorta, getBadgeClaseConvocatoria, ESTADO_CONVOCATORIA_LABELS, TIPO_CONVOCATORIA_LABELS } from '../../utils';
import {
  FaClipboardList,
  FaPlus,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";

import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { useToast } from '../../components/ui/Toaster';

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
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();

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

      const esCrear = modal === "crear"

      if(esCrear) {
        await convocatoriaAdminService.crear(fd);
      } else {
        await convocatoriaAdminService.actualizar(modal.id, fd);
      }
      setModal(null); fetch(pagination.pagina);

      addToast(esCrear ? "Nueva convocatoria agregada" : "Convocatoria actualizada", "success")
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await convocatoriaAdminService.eliminar(id);
      setConfirmDel(null);
      fetch(pagination.pagina);
      addToast("Convocatoria eliminada", "success");
    } finally {
      setDeleting(false);
    }
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

  const columns = [
    { key: "titulo", label: "Titulo" },
    { key: "tipo", label: "Tipo" },
    { key: "estado", label: "Estado" },
    { key: "plazas", label: "Plazas" },
    { key: "inicio", label: "Inicio" },
    { key: "cierre", label: "Cierre" },
    { key: "acciones", label: "Acciones" },
  ]

  return (
    <div className="animate-fadeInUp space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-blue-900">
            <FaClipboardList />
            Convocatorias
          </h1>
          <p className="text-sm text-slate-500">{pagination?.total ?? 0} convocatoria{(pagination?.total ?? 0) !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setModal('crear'); setError(''); }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
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

      <Table
        columns={columns}
        data={items}
        loading={loading}
        emptyMessage='No hay convocatorias'
        renderRow={(item) => (
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
        )}
      />

      <Modal
        open={!!modal}
        title={modal === "crear" ? "Nueva Convocatoria" : "Editar Convocatoria"}
        onClose={() => setModal(null)}
        onSubmit={handleSave}
        loading={saving}
      >
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm flex items-center gap-2">
            <FaExclamationTriangle /> {error}
          </div>
        )}

        <label className="block text-sm font-medium mb-1">Título *</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
          placeholder='Título'
          value={form.titulo}
          onChange={(e) =>
            setForm((f) => ({ ...f, titulo: e.target.value }))
          }
        />

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo *</label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
              value={form.tipo}
              onChange={(e) =>
                setForm((f) => ({ ...f, tipo: e.target.value }))
              }
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
              onChange={(e) =>
                setForm((f) => ({ ...f, estado: e.target.value }))
              }
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
              onChange={(e) =>
                setForm((f) => ({ ...f, plazas: e.target.value }))
              }
            />
          </div>
        </div>

        <label className="block text-sm font-medium mb-1">Descripción *</label>
        <textarea
          rows={4}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
          value={form.descripcion}
          onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
        />

        <label className="block text-sm font-medium mb-1">Requisitos</label>
        <textarea
          rows={4}
          placeholder="Un requisito por línea..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
          value={form.requisitos}
          onChange={(e) => setForm((f) => ({ ...f, requisitos: e.target.value }))}
        />

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

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className='flex items-center mb-1'>
              <label className="block text-sm font-medium">Archivo convocatoria</label>
              <span className="text-slate-400 font-normal ml-1">
                (.pdf)
              </span>
            </div>

            <input
              type="file"
              accept=".pdf"
              onChange={e => setForm(f => ({ ...f, archivo: e.target.files[0] || null }))}
              className="border border-slate-300 rounded-lg block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
            />
          </div>

          <div>
            <div className='flex items-center mb-1'>
              <label className="block text-sm font-medium">Bases del proceso</label>
              <span className="text-slate-400 font-normal ml-1">
                (.pdf)
              </span>
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={e => setForm(f => ({ ...f, base: e.target.files[0] || null }))}
              className="border border-slate-300 rounded-lg block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
            />
          </div>
        </div>

      </Modal>

      <ConfirmModal
        open={!!confirmDel}
        title="¿Eliminar convocatoria?"
        message={`Estás a pundo de eliminar "${confirmDel?.titulo}"`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant='danger'
        loading={deleting}
        onClose={() => setConfirmDel(null)}
        onConfirm={() => handleDelete(confirmDel.id)}
      />
    </div>
  );
}