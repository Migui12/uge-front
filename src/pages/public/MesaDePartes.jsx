import { useEffect, useState } from 'react';
import { tramiteService } from '../../services/api';
import { TIPO_TRAMITE_LABELS, fetchHorario, horarioHabil } from '../../utils';
import { FaFolderOpen, FaSearch, FaCheckCircle, FaInfoCircle, FaSpinner, FaExclamationTriangle, FaPlus, FaCheck } from 'react-icons/fa';

const initialForm = {
  nombre: '', apellido: '', dni: '', email: '', telefono: '',
  tipoTramite: '', asunto: '', descripcion: '', archivo: null
};

export default function MesaDePartes() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [errores, setErrores] = useState({});
  const [fueraHorario, setFueraHorario] = useState(false);
  const [configHorario, setConfigHorario] = useState(null);

  useEffect(() => {
    const initHorario = async () => {
      const habil= await horarioHabil();
      setFueraHorario(!habil);
      const config = await fetchHorario();
      setConfigHorario(config);
    };
    initHorario();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'archivo') {
      setForm(f => ({ ...f, archivo: files[0] || null }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
      if (errores[name]) setErrores(e => ({ ...e, [name]: '' }));
    }
  };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'Requerido';
    if (!form.apellido.trim()) e.apellido = 'Requerido';
    if (!/^\d{8}$/.test(form.dni)) e.dni = 'Debe tener 8 dígitos';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido';
    if (!form.tipoTramite) e.tipoTramite = 'Seleccione un tipo';
    if (!form.asunto.trim()) e.asunto = 'Requerido';
    if (form.archivo && form.archivo.type !== 'application/pdf') e.archivo = 'Solo se acepta PDF';
    if (form.archivo && form.archivo.size > 10 * 1024 * 1024) e.archivo = 'Máximo 10MB';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k !== 'archivo' && v) formData.append(k, v);
      });
      if (form.archivo) formData.append('archivo', form.archivo);

      const res = await tramiteService.registrar(formData);
      setResultado(res.data.data);
      setForm(initialForm);
    } catch (err) {
      setErrores({ general: err.response?.data?.message || 'Error al registrar el trámite. Intente nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  if (fueraHorario) {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diaInicio = configHorario ? diasSemana[configHorario.dia_inicio] : 'Lunes';
    const diaFin = configHorario ? diasSemana[configHorario.dia_fin] : 'Viernes';
    const horaInicio = configHorario?.hora_inicio;
    const horaFin = configHorario?.hora_fin;

    return (
      <div className="animate-fadeInUp px-8 md:px-10 lg:px-50">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center">
          <h2 className='text-blue-900 font-bold text-xl mb-2'>
            Mesa de partes Virtual
          </h2>

          <p className="text-gray-600">
            La atención de mesa de partes virtual es de 
            <strong> {diaInicio} a {diaFin} de {horaInicio}am a {horaFin}pm</strong>.
          </p>

          <p className="text-gray-500 mt-3 text-sm">
            Actualmente estamos fuera del horario de atención.
          </p>
        </div>
      </div>
    );
  }

  if (resultado) {
    return (
      <div className="animate-fadeInUp px-8 md:px-10 lg:px-50">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center">
          <div className=" w-24 h-24 mx-auto text-6xl mb-4 flex items-center justify-center bg-green-200 rounded-full shadow-xl">
            <FaCheck className='text-green-600'/> 
          </div>
          <h2 className="text-blue-900 font-bold text-xl mb-2">¡Trámite Registrado!</h2>
          <p className="text-gray-500 mb-6">
            Su trámite ha sido recibido exitosamente. Guarde el número de expediente para hacer seguimiento.
          </p>

          <div className="bg-blue-50 border-2 border-blue-900 rounded-xl p-6 mb-6">
            <div className="text-gray-500 text-sm mb-1">NÚMERO DE EXPEDIENTE</div>
            <div className="text-blue-900 font-extrabold text-3xl tracking-wide">{resultado.numeroExpediente}</div>
            <div className="text-gray-400 mt-1 text-sm">
              Estado: <strong className="text-green-600">RECIBIDO</strong>
            </div>
          </div>

          <p className="text-gray-500 text-sm mb-6">
            Recibirá actualizaciones en su correo electrónico registrado.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <button className='flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900' onClick={() => setResultado(null)}>
              <FaPlus/> Nuevo Trámite
            </button>

            <a href="/consulta-expediente" className="bg-blue-400 gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg inline-flex items-center justify-center shadow-sm transition hover:bg-blue-500">
             <FaSearch/> Consultar Estado
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeInUp px-8 md:px-10 lg:px-50">
      <div className="mb-6">
        <h1 className="text-blue-900 text-2xl mb-1 flex items-center gap-2">
          <FaFolderOpen /> Mesa de Partes Virtual
        </h1>
        <p className="text-gray-500">Registre su trámite de manera virtual. Complete todos los campos requeridos.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Formulario */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-blue-900 text-lg font-semibold mb-4 border-b border-gray-200 pb-2">Datos del Solicitante</h2>

          {errores.general && (
            <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm shadow-sm">
              <FaExclamationTriangle className="shrink-0" />
              <span>{errores.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Nombre *</label>
                <input
                  name="nombre" value={form.nombre} onChange={handleChange}
                  placeholder="Juan"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                />
                {errores.nombre && <span className="text-red-600 text-xs">{errores.nombre}</span>}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Apellidos *</label>
                <input
                  name="apellido" value={form.apellido} onChange={handleChange}
                  placeholder="Pérez López"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                />
                {errores.apellido && <span className="text-red-600 text-xs">{errores.apellido}</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">DNI *</label>
                <input
                  name="dni" value={form.dni} onChange={handleChange} maxLength={8}
                  placeholder="12345678"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                />
                {errores.dni && <span className="text-red-600 text-xs">{errores.dni}</span>}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Teléfono</label>
                <input
                  name="telefono" value={form.telefono} onChange={handleChange}
                  placeholder="987654321"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Correo Electrónico *</label>
              <input
                name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="ejemplo@correo.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
              />
              {errores.email && <span className="text-red-600 text-xs">{errores.email}</span>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Tipo de Trámite *</label>
              <select
                name="tipoTramite" value={form.tipoTramite} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
              >
                <option value="">Seleccione el tipo...</option>
                {Object.entries(TIPO_TRAMITE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              {errores.tipoTramite && <span className="text-red-600 text-xs">{errores.tipoTramite}</span>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Asunto *</label>
              <input
                name="asunto" value={form.asunto} onChange={handleChange}
                placeholder="Describa brevemente el asunto del trámite"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
              />
              {errores.asunto && <span className="text-red-600 text-xs">{errores.asunto}</span>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Descripción / Detalle</label>
              <textarea
                name="descripcion" value={form.descripcion} onChange={handleChange}
                placeholder="Información adicional sobre su trámite..." rows={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Archivo PDF (opcional)</label>
              <input
                type="file" accept=".pdf"
                onChange={handleChange} name="archivo"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
              />
              <p className="text-gray-400 text-xs mt-1">Solo archivos PDF. Tamaño máximo: 10MB</p>
              {errores.archivo && <span className="text-red-600 text-xs">{errores.archivo}</span>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-800 text-white font-semibold px-6 py-3 rounded-2xl w-full flex items-center justify-center gap-2 shadow-md
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-900 transition transform duration-200'}
              `}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Registrando...
                </>
              ) : (
                <>
                  <FaCheckCircle /> Registrar Trámite
                </>
              )}
            </button>
          </form>
        </div>

        {/* Información */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-blue-900 font-semibold mb-2 flex items-center gap-2">
              <FaInfoCircle /> Información importante
            </h3>
            <ul className="text-gray-700 text-sm space-y-1 pl-4 list-disc">
              <li>El trámite se registra en horario hábil: Lun-Vie 8:00am - 4:00pm</li>
              <li>Guarde su número de expediente para hacer seguimiento</li>
              <li>Se le notificará al correo registrado sobre el estado</li>
              <li>Los documentos deben ser en formato PDF, máximo 10MB</li>
              <li>La atención presencial es en la misma oficina</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-900 rounded-xl p-6">
            <h3 className="text-blue-900 font-semibold mb-2 flex items-center gap-2">
              <FaInfoCircle /> ¿Ya tiene un expediente?
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Consulte el estado de su trámite ingresando su número de expediente.
            </p>
            <a
              href="/consulta-expediente"
              className="bg-white text-blue-800 font-semibold px-4 py-2 rounded-2xl inline-flex items-center gap-2 justify-center shadow-md hover:bg-blue-100 hover:scale-105 transition transform duration-200 w-auto"
            >
              <FaSearch /> Consultar Estado
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
