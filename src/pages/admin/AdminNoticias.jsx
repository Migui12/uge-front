// src/pages/admin/AdminNoticias.jsx
import { useState, useEffect } from 'react';
import { noticiaAdminService } from '../../services/api';
import { formatFechaCorta } from '../../utils';
import {
  FaNewspaper,
  FaPlus,
  FaEdit,
  FaTrash,
  FaStar,
  FaExclamationTriangle,
  FaTimes,
  FaUniversity,
  FaBook,
  FaTheaterMasks,
  FaFutbol,
  FaHandshake,
  FaTrophy,
} from "react-icons/fa";
import InputField from '../../components/ui/Input';

import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { useToast } from '../../components/ui/Toaster';

const CATEGORIAS = {
  INSTITUCIONAL: { label: 'Institucional', icon: FaUniversity },
  ACADEMICO: { label: 'Académico', icon: FaBook },
  CULTURAL: { label: "Cultural", icon: FaTheaterMasks },
  DEPORTIVO: { label: "Deportivo", icon: FaFutbol },
  SOCIAL: { label: "Social", icon: FaHandshake },
  LOGRO: { label: "Logro", icon: FaTrophy }
};

const ESTADOS = { BORRADOR: 'Borrador', PUBLICADO: 'Publicado', ARCHIVADO: 'Archivado' };

const emptyForm = {
  titulo: '', resumen: '', contenido: '', categoria: 'INSTITUCIONAL',
  estado: 'BORRADOR', destacada: false, etiquetas: '', imagen: null
};

export default function AdminNoticias() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [pagination, setPagination] = useState({ pagina: 1, totalPaginas: 1, total: 0 });
  const [confirmDel, setConfirmDel] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();

  const fetch = async (pagina = 1) => {
    setLoading(true);
    try {
      const params = { pagina, limite: 15 };
      if (filtroEstado) params.estado = filtroEstado;
      const res = await noticiaAdminService.listar(params);
      setItems(res.data.data);
      setPagination(res.data.pagination);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(1); }, [filtroEstado]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm(f => ({ ...f, imagen: file || null }));
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewImg(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewImg(null);
    }
  };

  const handleSave = async () => {
    if (!form.titulo || !form.resumen || !form.contenido) {
      setError('Título, resumen y contenido son requeridos'); return;
    }
    setSaving(true); setError('');
    try {
      const fd = new FormData();
      if (form.imagen) fd.append('imagen', form.imagen);
      fd.append('titulo', form.titulo);
      fd.append('resumen', form.resumen);
      fd.append('contenido', form.contenido);
      fd.append('categoria', form.categoria);
      fd.append('estado', form.estado);
      fd.append('destacada', String(form.destacada));
      fd.append('etiquetas', form.etiquetas);

      const esCrear = modal === "crear";

      if (esCrear) {
        await noticiaAdminService.crear(fd)
      } else {
        await noticiaAdminService.actualizar(modal.id, fd);
      }

      setModal(null); 
      setPreviewImg(null); 
      fetch(pagination.pagina);

      addToast(esCrear ? "Noticia creada correctamente": "Noticia actualizada", "success");

    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await noticiaAdminService.eliminar(id);
      setConfirmDel(null);
      fetch(pagination.pagina);
      addToast("Noticia eliminada correctamente", "success")
    } finally {
      setDeleting(false);
    }
  };

  const openEditar = (item) => {
    setForm({
      titulo: item.titulo, resumen: item.resumen, contenido: item.contenido,
      categoria: item.categoria, estado: item.estado, destacada: item.destacada,
      etiquetas: item.etiquetas || '', imagen: null
    });
    setPreviewImg(item.imagenUrl ? `http://localhost:5173${item.imagenUrl}` : null);
    setModal(item); setError('');
  };

/*   const getBadgeColor = (estado) => {
    if (estado === 'PUBLICADO') return { bg: '#dcfce7', color: '#15803d' };
    if (estado === 'BORRADOR') return { bg: '#fef9c3', color: '#854d0e' };
    return { bg: '#f1f5f9', color: '#64748b' };
  }; */

  const columns = [
    { key: "titulo", label: "Título" },
    { key: "categoria", label: "Categoría" },
    { key: "estado", label: "Estado" },
    { key: "destacado", label: "Destacado" },
    { key: "fecha", label: "Fecha" },
    { key: "vistas", label: "Vistas" },
    { key: "acciones", label: "Acciones" },
  ]

  return (
    <div className="animate-fadeInUp space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-blue-900">
            <FaNewspaper /> Noticias
          </h1>
          <p className="text-sm text-slate-500">
            {pagination.total} noticia{pagination.total !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={() => {
            setForm(emptyForm);
            setPreviewImg(null);
            setModal("crear");
            setError("");
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
        >
          <FaPlus className="text-xs" />
          Nueva Noticia
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 flex flex-wrap gap-2 shadow-sm">
        {[["", "Todos"], ...Object.entries(ESTADOS)].map(([k, v]) => (
          <button
            key={k}
            onClick={() => setFiltroEstado(k)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition
        ${filtroEstado === k
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <Table
        columns={columns}
        data={items}
        loading={loading}
        emptyMessage='No hay noticias'
        renderRow={(item) => (
          <tr key={item.id} className="hover:bg-slate-50 transition">
            <td className="px-4 py-3">
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                {item.imagenUrl ? (
                  <img
                    src={`http://localhost:5173${item.imagenUrl}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaNewspaper className="text-blue-600" />
                )}
              </div>
            </td>
            <td className="px-4 py-3 max-w-xs">
              <div className="font-semibold text-slate-800 truncate">
                {item.titulo}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {item.resumen}
              </div>
            </td>
            <td className="px-4 py-3">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
                {(() => {
                  const Icon = CATEGORIAS[item.categoria].icon;
                  return <Icon className="text-blue-600 text-sm" />;
                })()}
                {CATEGORIAS[item.categoria]?.label}
              </span>
            </td>

            {/* Estado */}
            <td className="px-4 py-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${item.estado === "PUBLICADO"
                    ? "bg-green-100 text-green-700"
                    : item.estado === "BORRADOR"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
              >
                {ESTADOS[item.estado]}
              </span>
            </td>

            {/* Destacada */}
            <td className="px-4 py-3 text-center">
              {item.destacada ? (
                <FaStar className="text-amber-400 inline" />
              ) : (
                <span className="text-slate-300">—</span>
              )}
            </td>

            {/* Fecha */}
            <td className="px-4 py-3 text-slate-500 text-xs">
              {formatFechaCorta(item.createdAt)}
            </td>

            {/* Vistas */}
            <td className="px-4 py-3 text-slate-500 text-xs">
              {item.vistas}
            </td>

            {/* Acciones */}
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <button
                  onClick={() => openEditar(item)}
                  className="p-2 rounded-lg bg-blue-900 text-white hover:bg-blue-700 transition"
                >
                  <FaEdit className="text-xs" />
                </button>

                <button
                  onClick={() => setConfirmDel(item)}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      <Modal
        open={!!modal}
        title={modal === "crear" ? "Nueva Noticia" : "Editar Noticia"}
        onClose={() => setModal(null)}
        onSubmit={handleSave}
        loading={saving}
      >
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm flex items-center gap-2">
            <FaExclamationTriangle /> {error}
          </div>
        )}

        <div className="mb-2">
          <InputField
            label="Título *"
            name="titulo"
            value={form.titulo}
            onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
            placeholder ="Título de la noticia"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-2">
            <InputField 
              label="Categoría"
              name="categoria"
              type='select'
              value={form.categoria}
              onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
              options={Object.entries(CATEGORIAS).map(([k, v]) => ({
                label: k,
                value: v.label,
              }))}
            />

            <InputField
              label="Estado"
              name="estado"
              type='select'
              value={form.estado}
              onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
              options={Object.entries(ESTADOS).map(([k, v]) => ({
                label: k,
                value: v.label,
              }))}
            />
        </div>

        <div className="mb-2">
          <InputField 
              label={
                <>
                  Resumen * 
                  <span className="text-slate-400 font-normal ml-1">
                    (se muestra en las tarjetas)
                  </span>
                </>
              }
              name="resumen"
              type='textarea'
              value={form.resumen}
              onChange={e => setForm(f => ({ ...f, resumen: e.target.value }))}
              placeholder="Breve descripción de la noticia..."
            />
        </div>

        <div className="mb-2">
          <InputField 
            label="Contenido completo *"
            name="contenido"
            type='textarea'
            value={form.contenido}
            onChange={e => setForm(f => ({ ...f, contenido: e.target.value }))}
            placeholder="Contenido de la noticia..."
            rows={7}
          />
        </div>

        <div className="mb-2">
          <InputField 
            label={
              <>
                Etiquetas
                <span className="text-slate-400 font-normal ml-1">
                  (separadas por comas)
                </span>
              </>
            }
            name="etiquetas"
            value={form.etiquetas}
            onChange={e => setForm(f => ({ ...f, etiquetas: e.target.value }))}
            placeholder="educación, logro, regional"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Imagen de portada
          </label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="border border-slate-300 rounded-lg block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
          />

          {previewImg && (
            <div className="mt-4 relative inline-block">
              <img
                src={previewImg}
                alt="preview"
                className="w-full max-h-40 object-cover rounded-lg border border-slate-200"
              />
              <button
                onClick={() => {
                  setPreviewImg(null);
                  setForm(f => ({ ...f, imagen: null }));
                }}
                className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white rounded-full w-7 h-7 flex items-center justify-center text-xs transition"
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>

        <div className="mb-6 flex items-center gap-2">
          <input
            type="checkbox"
            id="dest"
            checked={form.destacada}
            onChange={e => setForm(f => ({ ...f, destacada: e.target.checked }))}
            className="w-4 h-4 accent-blue-600"
          />
          <label
            htmlFor="dest"
            className="flex items-center gap-1 text-sm font-medium text-slate-700 cursor-pointer"
          >
            <FaStar className="text-amber-400" />
            Marcar como noticia destacada
          </label>
        </div>
      </Modal>

      <ConfirmModal
        open={!!confirmDel}
        title='Eliminar noticia'
        message={`Estas apunto de eliminar "${confirmDel?.titulo}"`}
        confirmText='Eliminar'
        cancelText='Cancelar'
        variant='danger'
        loading={deleting}
        onClose={() => setConfirmDel(null)}
        onConfirm={() => handleDelete(confirmDel.id)}
      />
    </div>
  );
}