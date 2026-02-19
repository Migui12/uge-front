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
  FaCheck,
  FaSpinner,
} from "react-icons/fa";

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

      modal === "crear"
        ? await comunicadoAdminService.crear(fd)
        : await comunicadoAdminService.actualizar(modal.id, fd);

      setModal(null);
      fetch(pagination.pagina);
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await comunicadoAdminService.eliminar(id);
    setConfirmDel(null);
    fetch(pagination.pagina);
  };

  return (
    <div className="animate-fadeInUp p-4 space-y-6">

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
          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <FaPlus /> Nuevo Comunicado
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-2">
        {[["", "Todos"], ...Object.entries(ESTADO_LABELS)].map(
          ([k, v]) => (
            <button
              key={k}
              onClick={() => setFiltroEstado(k)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition
                ${
                  filtroEstado === k
                    ? "bg-blue-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              {v}
            </button>
          )
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-b-gray-200">
            <tr>
              {[
                "Título",
                "Categoría",
                "Estado",
                "Destacado",
                "Fecha",
                "Vistas",
                "Acciones",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-500">
                  Cargando...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-500">
                  No hay comunicados
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-b-gray-200 hover:bg-slate-50 transition"
                >
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

                  <td className="px-4 py-3">
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
              ))
            )}
          </tbody>
        </table>

        {pagination.totalPaginas > 1 && (
          <div className="flex justify-center gap-2 p-4">
            {Array.from(
              { length: pagination.totalPaginas },
              (_, i) => i + 1
            ).map((p) => (
              <button
                key={p}
                onClick={() => fetch(p)}
                className={`px-3 py-1 rounded-md text-sm transition
                  ${
                    p === pagination.pagina
                      ? "bg-blue-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal Crear / Editar */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">

            <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
              {modal === "crear" ? <FaPlus /> : <FaEdit />}
              {modal === "crear"
                ? "Nuevo Comunicado"
                : "Editar Comunicado"}
            </h3>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm flex items-center gap-2">
                <FaExclamationTriangle /> {error}
              </div>
            )}

            <input
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
              placeholder="Título *"
              value={form.titulo}
              onChange={(e) =>
                setForm((f) => ({ ...f, titulo: e.target.value }))
              }
            />

            <textarea
              rows={6}
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
              placeholder="Contenido *"
              value={form.contenido}
              onChange={(e) =>
                setForm((f) => ({ ...f, contenido: e.target.value }))
              }
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-sm"
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm"
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
    </div>
  );
}