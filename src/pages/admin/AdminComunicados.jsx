import { useState, useEffect } from "react";
import { comunicadoAdminService } from "../../services/api";
import { formatFechaCorta, getBadgeClaseComunicado } from "../../utils";
import {
  FaBullhorn,
  FaPlus,
  FaEdit,
  FaTrash,
  FaStar,
  FaExclamationTriangle,
} from "react-icons/fa";

import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import InputField from "../../components/ui/Input";
import { useToast } from "../../components/ui/Toaster";

const emptyForm = {
  titulo: "",
  contenido: "",
  resumen: "",
  categoria: "GENERAL",
  estado: "BORRADOR",
  destacado: false,
  archivo: null,
};

const ESTADO_LABELS = {
  BORRADOR: "Borrador",
  PUBLICADO: "Publicado",
  ARCHIVADO: "Archivado",
};

const CATEGORIA_LABELS = {
  GENERAL: "General",
  ACADEMICO: "Académico",
  ADMINISTRATIVO: "Administrativo",
  URGENTE: "Urgente",
};

export default function AdminComunicados() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [pagination, setPagination] = useState({
    pagina: 1,
    totalPaginas: 1,
    total: 0,
  });
  const [confirmDel, setConfirmDel] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();

  const fetch = async (pagina = 1) => {
    setLoading(true);
    try {
      const params = { pagina, limite: 15 };
      if (filtroEstado) params.estado = filtroEstado;
      const res = await comunicadoAdminService.listar(params);
      setItems(res.data.data);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch(1);
  }, [filtroEstado]);

  const handleSave = async () => {
    if (!form.titulo || !form.contenido) {
      setError("Título y contenido son requeridos");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "archivo" && v) fd.append("archivo", v);
        else if (k !== "archivo") fd.append(k, String(v));
      });

      const esCrear = modal === "crear";

      if (esCrear) {
        await comunicadoAdminService.crear(fd)
      } else {
        await comunicadoAdminService.actualizar(modal.id, fd);
      }

      setModal(null);
      fetch(pagination.pagina);
      addToast(esCrear ? "Comunicado creado" : "Comunicado actualizado", "success");

    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await comunicadoAdminService.eliminar(id);
      setConfirmDel(null);
      fetch(pagination.pagina);
      addToast("Comunicado eliminado", "success");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: "titulo", label: "Titulo" },
    { key: "categoria", label: "Categoría" },
    { key: "estado", label: "Estado" },
    { key: "destacado", label: "Destacado" },
    { key: "fecha", label: "Fecha" },
    { key: "vistas", label: "Vistas" },
    { key: "acciones", label: "Acciones" },
  ]

  return (
    <div className="animate-fadeInUp space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-blue-900">
            <FaBullhorn /> Comunicados
          </h1>
          <p className="text-sm text-slate-500">
            {pagination.total} comunicado
            {pagination.total !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={() => {
            setForm(emptyForm);
            setModal("crear");
            setError("");
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
        >
          <FaPlus /> Nuevo Comunicado
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 flex flex-wrap gap-2 shadow-sm">
        {[["", "Todos"], ...Object.entries(ESTADO_LABELS)].map(
          ([k, v]) => (
            <button
              key={k}
              onClick={() => setFiltroEstado(k)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition
                ${filtroEstado === k
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              {v}
            </button>
          )
        )}
      </div>

      {/* Tabla */}
      <Table
        columns={columns}
        data={items}
        loading={loading}
        emptyMessage="No hay Comunicaciones"
        renderRow={(item) => (
          <tr key={item.id} className="border-b border-b-gray-200 hover:bg-slate-50 transition">
            <td className="px-4 py-3 max-w-xs">
              <div className="font-semibold text-slate-800 truncate">
                {item.titulo}
              </div>
              {item.resumen && (
                <div className="text-xs text-slate-400 truncate">
                  {item.resumen}
                </div>
              )}
            </td>
            <td className="px-4 py-3">
              {CATEGORIA_LABELS[item.categoria]}
            </td>
            <td className="px-4 py-3">
              <span
                className={`${getBadgeClaseComunicado(
                  item.estado
                )} text-xs`}
              >
                {ESTADO_LABELS[item.estado]}
              </span>
            </td>

            <td className="px-4 py-3 text-center">
              {item.destacado && (
                <FaStar className="text-yellow-400 mx-auto" />
              )}
            </td>

            <td className="px-4 py-3 text-slate-500">
              {formatFechaCorta(item.createdAt)}
            </td>

            <td className="px-4 py-3 text-slate-500">
              {item.vistas}
            </td>
            <td>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setForm({
                      titulo: item.titulo,
                      contenido: item.contenido,
                      resumen: item.resumen || "",
                      categoria: item.categoria,
                      estado: item.estado,
                      destacado: item.destacado,
                      archivo: null,
                    });
                    setModal(item);
                    setError("");
                  }}
                  className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-md text-xs"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => setConfirmDel(item)}
                  className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-md text-xs"
                >
                  <FaTrash />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* Modal Crear / Editar */}
      <Modal
        open={!!modal}
        title={modal === "crear" ? "Nuevo Comunicado" : "Editar Comunicado"}
        onClose={() => setModal(null)}
        onSubmit={handleSave}
        loading={saving}
      >
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm flex items-center gap-2">
            <FaExclamationTriangle /> {error}
          </div>
        )}

        <InputField
          label="Título"
          name="titulo"
          value={form.titulo}
          onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
          placeholder="Título"
        />

        <div className="grid md:grid-cols-2 gap-4">
          <InputField
            label="Categoría"
            name="categoria"
            type="select"
            value={form.categoria} 
            onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
            options={Object.entries(CATEGORIA_LABELS).map(([k, v]) => ({
              label: v,
              value: k,
            }))}
          />

          <InputField
            label="Estado"
            name="estado"
            type="select"
            value={form.estado} 
            onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
            options={Object.entries(ESTADO_LABELS).map(([k, v]) => ({
              label: v,
              value: k,
            }))}
          />
        </div>

        <InputField
          label="Resumen"
          name="resumen"
          type="textarea"
          value={form.resumen} onChange={e => setForm(f => ({ ...f, resumen: e.target.value }))}
          placeholder="Breve descripción..."
        />

        <InputField
          label="Contenido *"
          name="contenido"
          type="textarea"
          rows={6}
          value={form.contenido}
          onChange={(e) => setForm((f) => ({ ...f, contenido: e.target.value }))}
          placeholder="Contenido"
        />

        <div className="mb-6 flex items-center gap-2">
          <input
            type="checkbox"
            id="destacado"
            checked={form.destacado}
            onChange={e => setForm(f => ({ ...f, destacado: e.target.checked }))}
            className="w-4 h-4 accent-blue-600"
          />
          <label
            htmlFor="dest"
            className="flex items-center gap-1 text-sm font-medium text-slate-700 cursor-pointer"
          >
            <FaStar className="text-amber-400" />
            Marcar como destacado
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Archivo adjunto (PDF)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="border border-slate-300 rounded-lg block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
            onChange={e => setForm(f => ({ ...f, archivo: e.target.files[0] || null }))}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!confirmDel}
        title="¿Eliminar comunicado?"
        message={`Estas a punto de eliminar "${confirmDel?.titulo}"`}
        loading={deleting}
        onClose={() => setConfirmDel(null)}
        onConfirm={() => handleDelete(confirmDel.id)}
      />
    </div>
  );
}