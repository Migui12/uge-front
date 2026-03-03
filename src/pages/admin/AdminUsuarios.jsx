import { useState, useEffect } from "react";
import { usuarioAdminService } from "../../services/api";
import { formatFechaCorta } from "../../utils";
import { useAuth } from "../../hooks/useAuth";
import {
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useToast } from "../../components/ui/Toaster";
import InputField from "../../components/ui/Input";

export default function AdminUsuarios() {
  const { user: currentUser } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    dni: "",
    telefono: "",
    rolId: "2",
    activo: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmDel, setConfirmDel] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await usuarioAdminService.listar();
      setUsuarios(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleSave = async () => {
    if (!form.nombre || !form.apellido || !form.email || !form.rolId) {
      setError("Nombre, apellido, email y rol son requeridos");
      return;
    }
    if (modal === "crear" && (!form.password || form.password.length < 8)) {
      setError("La contraseña debe tener mínimo 8 caracteres");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const data = { ...form, rolId: parseInt(form.rolId) };
      if (!data.password) delete data.password;

      const esCrear = modal === "crear";

      if (esCrear) {
        await usuarioAdminService.crear(data);
      } else {
        await usuarioAdminService.actualizar(modal.id, data);
      }

      setModal(null);
      fetch();
      addToast(esCrear ? "Usuario agregado" : "Datos de usuario actualizado", "success");
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await usuarioAdminService.eliminar(id);
      setConfirmDel(null);
      fetch();
      addToast("Usuario eliminado", "success");
    } finally {
      setDeleting(false);
    }
  };

  const openEditar = (item) => {
    setForm({
      nombre: item.nombre,
      apellido: item.apellido,
      email: item.email,
      password: "",
      dni: item.dni || "",
      telefono: item.telefono || "",
      rolId: String(item.rolId),
      activo: item.activo,
    });
    setModal(item);
    setError("");
  };

  const columns = [
    { key: "Usuario", label: "Usuario" },
    { key: "email", label: "Email" },
    { key: "rol", label: "Rol" },
    { key: "estado", label: "Estado" },
    { key: "ultimoAcceso", label: "Último Acceso" },
    { key: "acciones", label: "Acciones" },

  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-blue-900">
            <FaUsers />
            Usuarios
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {usuarios.length} usuario
            {usuarios.length !== 1 && "s"} registrado
            {usuarios.length !== 1 && "s"}
          </p>
        </div>

        <button
          onClick={() => {
            setForm({
              nombre: "",
              apellido: "",
              email: "",
              password: "",
              dni: "",
              telefono: "",
              rolId: "2",
              activo: true,
            });
            setModal("crear");
            setError("");
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900"
        >
          <FaPlus />
          Nuevo Usuario
        </button>
      </div>

      <Table
        columns={columns}
        data={usuarios}
        loading={loading}
        emptyMessage="No hay usuarios"
        renderRow={(u) => (
          <tr key={u.id} className="hover:bg-slate-50 transition">
            <td className="px-4 py-3">
              <div className="font-semibold text-slate-800">
                {u.nombre} {u.apellido}
              </div>
              {u.dni && (
                <div className="text-xs text-slate-400">
                  DNI: {u.dni}
                </div>
              )}
            </td>

            <td className="px-4 py-3">{u.email}</td>
            <td className="px-4 py-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold
                ${u.rol?.nombre === "ADMIN"
                    ? "bg-blue-900 text-white"
                    : "bg-slate-100 text-slate-600"
                  }`}
              >
                {u.rol?.nombre}
              </span>
            </td>

            <td className="px-4 py-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold
                ${u.activo
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                  }`}
              >
                {u.activo ? "Activo" : "Inactivo"}
              </span>
            </td>

            <td className="px-4 py-3 text-slate-500">
              {u.ultimoAcceso ?
                formatFechaCorta(u.ultimoAcceso) : "Nunca"}
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <button
                  onClick={() => openEditar(u)}
                  className="inline-flex items-center justify-center rounded-md bg-blue-900 p-2 text-white hover:bg-blue-800 transition"
                >
                  <FaEdit />
                </button>

                {u.id !== currentUser?.id && (
                  <button
                    onClick={() => setConfirmDel(u)}
                    className="inline-flex items-center justify-center rounded-md bg-red-100 p-2 text-red-700 hover:bg-red-200 transition"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </td>
          </tr>
        )}
      />

      <Modal
        open={!!modal}
        title={modal === "crear" ? "Nuevo Usuario" : "Editar Usuario"}
        onClose={() => setModal(null)}
        onSubmit={handleSave}
        loading={saving}
      >
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm flex items-center gap-2">
            <FaExclamationTriangle /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Nombre *"
            name="nombre"
            value={form.nombre}
            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
            placeholder="Nombre"
          />
          <InputField
            label="Apellido *"
            name="apellido"
            value={form.apellido}
            onChange={(e) => setForm((f) => ({ ...f, apellido: e.target.value }))}
            placeholder="Apellido"
          />
        </div>

        <InputField
          label="Correo *"
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="ejemplo@correo.com"
        />
        
        <InputField
          label="Contraseña *"
          name="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          placeholder={
            modal === "crear"
              ? "*****"
              : "Nueva contraseña (opcional)"
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="DNI"
            name="dni"
            value={form.dni}
            onChange={(e) => setForm((f) => ({ ...f, dni: e.target.value }))}
            placeholder="DNI"
          />
          <InputField
            label="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
            placeholder="Teléfono"
          />
        </div>

        <InputField
          label="Rol"
          name="rol"
          type="select"
          value={form.rolId}
          onChange={(e) => setForm((f) => ({ ...f, rolId: e.target.value }))}
          options={[
            { value: "1", label: "ADMIN"},
            { value: "2", label: "OPERADOR"},
          ]}
        />
        <div>
          <input
            className="hidden"
            type="checkbox"
            checked={form.activo}
            onChange={(e) =>
              setForm((f) => ({ ...f, activo: e.target.checked }))
            }
          />
        </div>

      </Modal>

      <ConfirmModal
        open={!!confirmDel}
        title="¿Eliminar usuario?"
        message={`Estas a pundo de eliminar a "${confirmDel?.nombre} ${confirmDel?.apellido}"`}
        loading={deleting}
        onClose={() => setConfirmDel(null)}
        onConfirm={() => handleDelete(confirmDel.id)}
      />
    </div>
  );
}