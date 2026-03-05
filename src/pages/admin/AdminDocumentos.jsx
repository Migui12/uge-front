import { useState, useEffect } from "react";
import { documentoAdminService } from "../../services/api";
import { formatFechaCorta, formatFileSize } from "../../utils";
import {
  FaFileAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaEye,
  FaFile
} from "react-icons/fa";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useToast } from "../../components/ui/Toaster";
import InputField from "../../components/ui/Input";
import { BACKEND_URL } from "../../services/api";

const CATEGORIAS = [
  "DIRECTIVA",
  "RESOLUCION",
  "OFICIO",
  "MEMORANDO",
  "INFORME",
  "FORMATO",
  "OTRO",
];

export default function AdminDocumentos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    categoria: "OTRO",
    activo: true,
    archivo: null,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmDel, setConfirmDel] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await documentoAdminService.listar({ limite: 50 });
      setItems(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleSave = async () => {
    if (!form.titulo) {
      setError("El título es requerido");
      return;
    }
    if (modal === "crear" && !form.archivo) {
      setError("El archivo es requerido");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const fd = new FormData();
      if (form.archivo) fd.append("archivo", form.archivo);
      fd.append("titulo", form.titulo);
      fd.append("descripcion", form.descripcion || "");
      fd.append("categoria", form.categoria);
      fd.append("activo", String(form.activo));

      const esCrear = modal === "crear";

      if (esCrear) {
        await documentoAdminService.crear(fd);
      } else {
        await documentoAdminService.actualizar(modal.id, fd);
      }

      setModal(null);
      fetch();
      addToast(esCrear ? "Documento agregado" : "Documento actualizado", "success")
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await documentoAdminService.eliminar(id);
      setConfirmDel(null);
      fetch();
      addToast("Docuemento eliminado", "success");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-blue-900">
            <FaFileAlt />
            Documentos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {items.length} documento{items.length !== 1 && "s"}
          </p>
        </div>

        <button
          onClick={() => {
            setForm({
              titulo: "",
              descripcion: "",
              categoria: "OTRO",
              activo: true,
              archivo: null,
            });
            setModal("crear");
            setError("");
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
        >
          <FaPlus />
          Subir Documento
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-500">
          Cargando...
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-16 text-center text-slate-500">
          No hay documentos
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border border-slate-200 bg-white shadow-sm p-4 flex flex-col justify-between transition hover:shadow-md ${!item.activo ? "opacity-60" : ""
                }`}
            >
              <div className="flex gap-3">
                <div className="h-11 w-11 flex items-center justify-center rounded-lg bg-blue-50 text-blue-900 text-lg">
                  <FaFile className="text-blue-500 w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-800 truncate">
                    {item.titulo}
                  </h3>

                  {item.descripcion && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {item.descripcion}
                    </p>
                  )}

                  <div className="text-xs text-slate-400 mt-2">
                    {item.categoria} ·{" "}
                    {formatFechaCorta(item.createdAt)}
                    {item.archivoTamanio &&
                      ` · ${formatFileSize(item.archivoTamanio)}`}
                    {!item.activo && " · Inactivo"}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <a
                  href={`${BACKEND_URL}${item.archivoUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 transition"
                >
                  <FaEye />
                  Ver
                </a>

                <button
                  onClick={() => {
                    setForm({
                      titulo: item.titulo,
                      descripcion: item.descripcion || "",
                      categoria: item.categoria,
                      activo: item.activo,
                      archivo: null,
                    });
                    setModal(item);
                    setError("");
                  }}
                  className="inline-flex items-center gap-1 rounded-md bg-blue-900 px-3 py-1.5 text-xs text-white hover:bg-blue-800 transition"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => setConfirmDel(item)}
                  className="inline-flex items-center gap-1 rounded-md bg-red-100 px-3 py-1.5 text-xs text-red-700 hover:bg-red-200 transition"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!modal}
        title={modal === "crear" ? "Subir Documento" : "Editar Documento"}
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
          placeholder="Título del documento"
        />
        
        <InputField
          label="Descripción"
          name="descripcion"
          type="textarea"
          value={form.descripcion}
          onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
          placeholder="Descripción del documento..."
        />
        
        <InputField
          label="Categoría"
          name="categoria"
          type="select"
          value={form.categoria}
          onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
          options={CATEGORIAS.map(c => ({
            label:c,
            value: c
          }))}
        />
        <input
          className="hidden"
          type="checkbox"
          checked={form.activo}
          onChange={(e) =>
            setForm((f) => ({ ...f, activo: e.target.checked }))
          }
        />

        <div className="flex items-center gap-1">
          <label className="block text-sm font-semibold text-slate-700">Documento </label>
          <span className="text-slate-500 text-sm">(pdf,.doc,.docx,.xls,.xlsx)</span>
        </div>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          className="border border-slate-300 rounded-lg block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              archivo: e.target.files[0] || null,
            }))
          }
        />
      </Modal>

      {/* Confirm Delete */}
      <ConfirmModal
        open={!!confirmDel}
        title="¿Eliminar documento?"
        message={`Estas a punto de eliminar "${confirmDel?.titulo}"`}
        loading={deleting}
        onClose={() => setConfirmDel(null)}
        onConfirm={() => handleDelete(confirmDel.id)}
      />
    </div>
  );
}