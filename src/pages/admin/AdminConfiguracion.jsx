import { useState, useCallback, useEffect } from "react";
import { FaCog, FaTimes } from "react-icons/fa";
import InputField from "../../components/ui/Input";
import { configService } from "../../services/api";
import { useToast } from "../../components/ui/Toaster";

const emptyForm = {
    titulo: "",
    telefono: "",
    direccion: "",
    correo: "",
    atencion: "",
    dia_inicio: 1,
    dia_fin: 5,
    hora_inicio: "08:00",
    hora_fin: "17:00",
    imagen: null,
};

export default function AdminConfiguracion() {
    const [form, setForm] = useState(emptyForm);
    const [previewImg, setPreviewImg] = useState(null);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await configService.obtener();
                const data = res.data.data;

                if (data) {
                    setForm({
                        titulo: data.titulo || "",
                        telefono: data.telefono || "",
                        direccion: data.direccion || "",
                        correo: data.correo || "",
                        atencion: data.atencion || "",
                        dia_inicio: data.dia_inicio ?? 1,
                        dia_fin: data.dia_fin ?? 5,
                        hora_inicio: data.hora_inicio || "08:00",
                        hora_fin: data.hora_fin || "17:00",
                        imagen: null,
                    });

                    if (data.imagen) {
                        setPreviewImg(data.imagen);
                    }
                }
            } catch (error) {
                console.error("Error cargando configuración:", error);
            }
        };

        fetchConfig();
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setForm(f => ({ ...f, imagen: file || null}));
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setPreviewImg(ev.target.result);
            reader.readAsDataURL(file);
        } else {
            setPreviewImg(null);
        }

        // Validación básica tamaño (2MB)
        if (file.size > 2 * 1024 * 1024) {
            addToast("La imagen no debe superar los 2MB");
            return;
        }
    };

    const handleRemoveImage = () => {
        setPreviewImg(null);
        setForm((prev) => ({ ...prev, imagen: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (form.dia_inicio > form.dia_fin) {
            addToast("El día de inicio no puede ser mayor al día fin", "error");
            setLoading(false);
            return;
        }

        if (form.hora_inicio >= form.hora_fin) {
            addToast("La hora de inicio debe ser menor a la hora fin", "error");
            setLoading(false);
            return;
        }

        try {
            const fd = new FormData();

            const diasMap = [
                { value: 1, label: "Lunes" },
                { value: 2, label: "Martes" },
                { value: 3, label: "Miércoles" },
                { value: 4, label: "Jueves" },
                { value: 5, label: "Viernes" },
                { value: 6, label: "Sábado" },
                { value: 0, label: "Domingo" },
            ];

            const diaInicioLabel = diasMap.find(d => d.value === Number(form.dia_inicio))?.label || "";
            const diaFinLabel = diasMap.find(d => d.value === Number(form.dia_fin))?.label || "";
            const atencionTexto = `${diaInicioLabel} - ${diaFinLabel}: ${form.hora_inicio} - ${form.hora_fin}`;

            fd.append("titulo", form.titulo);
            fd.append("telefono", form.telefono);
            fd.append("direccion", form.direccion);
            fd.append("correo", form.correo);
            fd.append("atencion", atencionTexto);
            fd.append("dia_inicio", form.dia_inicio);
            fd.append("dia_fin", form.dia_fin);
            fd.append("hora_inicio", form.hora_inicio);
            fd.append("hora_fin", form.hora_fin);

            if (form.imagen) {
                fd.append("imagen", form.imagen);
            }

            await configService.actualizar(fd);
            addToast("Configuración actualizada correctamente", "success");
        } catch (error) {
            console.error(error);
            addToast("Error al actualizar", "error");
        } finally {
            setLoading(false);
        }
    };

    const dias = [
        { value: 1, label: "Lunes" },
        { value: 2, label: "Martes" },
        { value: 3, label: "Miércoles" },
        { value: 4, label: "Jueves" },
        { value: 5, label: "Viernes" },
        { value: 6, label: "Sábado" },
        { value: 0, label: "Domingo" },
    ];

    const isDisabled =
        !form.titulo || !form.telefono || !form.direccion || !form.correo;

    return (
        <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => {if (e.key === "Enter") { e.preventDefault();}}}
            className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-xl font-bold text-blue-900">
                        <FaCog /> Configuración
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Configura la página principal de la institución</p>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Campo reutilizable */}
                    <InputField
                        label="Nombre del Año"
                        name="titulo"
                        value={form.titulo}
                        onChange={handleChange}
                        placeholder="Nombre del año"
                    />

                    <InputField
                        label="Número de teléfono institucional"
                        name="telefono"
                        type="tel"
                        value={form.telefono}
                        onChange={handleChange}
                        placeholder="Número de teléfono"
                    />

                    <InputField
                        label="Dirección"
                        name="direccion"
                        value={form.direccion}
                        onChange={handleChange}
                        placeholder="Av. 1° de Noviembre"
                    />

                    <InputField
                        label="Correo institucional"
                        name="correo"
                        type="email"
                        value={form.correo}
                        onChange={handleChange}
                        placeholder="ugel@correo.com"
                    />

                    <div className="md:col-span-2 p-2 border border-slate-300 rounded-xl">
                        <h1 className="text-sm font-semibold text-slate-700 mb-1">Horario de atención</h1>

                        <div className="grid md:grid-cols-4 gap-4">
                            <InputField 
                                label="Dia de Inicio"
                                name="dia_inicio"
                                type="select"
                                value={form.dia_inicio}
                                onChange={handleChange}
                                options={dias}
                            />

                            <InputField
                                label="Día fin"
                                name="dia_fin"
                                type="select"
                                value={form.dia_fin}
                                onChange={handleChange}
                                options={dias}
                            />

                            <InputField
                                label="Hora inicio"
                                name="hora_inicio"
                                type="time"
                                value={form.hora_inicio}
                                onChange={handleChange}
                            />
                        
                            <InputField
                                label="Hora fin"
                                name="hora_fin"
                                type="time"
                                value={form.hora_fin}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Imagen */}
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Foto de portada
                        </label>

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="border border-slate-300 rounded-lg block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-200 file:text-blue-700 hover:file:bg-blue-100 transition"
                        />

                        {previewImg && (
                            <div className="mt-4 relative inline-block">
                                <img
                                    src={previewImg}
                                    alt="Vista previa"
                                    className="w-full max-h-48 object-cover rounded-lg border border-slate-200"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white rounded-full w-7 h-7 flex items-center justify-center text-xs transition"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isDisabled || loading}
                    className="flex items-center w-full justify-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-md text-sm hover:shadow-lg transition-all"
                >
                    {loading ? "Guardando..." : "Guardar"}
                </button>
            </div>
        </form>
    );
}