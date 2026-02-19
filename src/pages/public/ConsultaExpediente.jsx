import { useState } from 'react';
import { FaSearch, FaClock, FaTimes, FaCheck, FaFileAlt, FaArrowRight } from 'react-icons/fa';
import { tramiteService } from '../../services/api';
import { ESTADO_TRAMITE_LABELS, TIPO_TRAMITE_LABELS, formatFecha, getBadgeClaseTramite } from '../../utils';

export default function ConsultaExpediente() {
  const [codigo, setCodigo] = useState('');
  const [tramite, setTramite] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!codigo.trim()) return;
    setLoading(true);
    setError('');
    setTramite(null);
    try {
      const res = await tramiteService.consultar(codigo.trim().toUpperCase());
      setTramite(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'No se encontró ningún expediente con ese código');
    } finally {
      setLoading(false);
    }
  };

  const estadoSteps = ['RECIBIDO', 'EN_PROCESO', 'ATENDIDO'];

  return (
    <div className="animate-fadeInUp max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl text-blue-800 mb-2 flex justify-center items-center gap-2">
          <FaSearch /> Consulta de Expediente
        </h1>
        <p className="text-gray-500">Ingrese su número de expediente para conocer el estado de su trámite</p>
      </div>

      {/* Formulario */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <form onSubmit={handleBuscar}>
          <label className="block text-sm text-gray-700 mb-1">Número de Expediente</label>
          <div className="flex gap-3 mt-1">
            <input
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm font-mono uppercase tracking-widest"
              value={codigo}
              onChange={e => setCodigo(e.target.value.toUpperCase())}
              placeholder="UGEL-2024-000001"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded flex items-center gap-2 text-sm whitespace-nowrap"
            >
              {loading ? <FaClock /> : <><FaSearch /> Consultar</>}
            </button>
          </div>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-center p-6 rounded mb-6">
          <div className="text-3xl mb-3 text-red-600 flex justify-center"><FaTimes /></div>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Resultado */}
      {tramite && (
        <div className="bg-white shadow rounded-2xl p-6 animate-fadeInUp">
          {/* Encabezado */}
          <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
            <div>
              <div className="text-xs text-gray-500">NÚMERO DE EXPEDIENTE</div>
              <div className="font-mono font-bold text-xl text-blue-800 tracking-widest">{tramite.numeroExpediente}</div>
            </div>
            <span className={`${getBadgeClaseTramite(tramite.estado)} text-xs px-3 py-1 rounded`}>
              {ESTADO_TRAMITE_LABELS[tramite.estado]}
            </span>
          </div>

          {/* Barra de progreso */}
          {tramite.estado !== 'RECHAZADO' && (
            <div className="mb-6 relative">
              <div className="absolute top-3 left-10 right-10 h-0.5 bg-gray-300 z-0"></div>
              <div className="flex justify-between relative z-10">
                {estadoSteps.map((step, i) => {
                  const currentIdx = estadoSteps.indexOf(tramite.estado);
                  const done = i <= currentIdx;
                  return (
                    <div key={step} className="flex-1 text-center relative">
                      <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-sm font-bold ${done ? 'bg-blue-800 text-white' : 'bg-gray-300 text-gray-400'}`}>
                        {done ? <FaCheck /> : i + 1}
                      </div>
                      <div className={`mt-1 text-[0.65rem] ${done ? 'text-blue-800 font-semibold' : 'text-gray-400 font-normal'}`}>
                        {ESTADO_TRAMITE_LABELS[step]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Información */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Solicitante', value: `${tramite.nombre} ${tramite.apellido}` },
              { label: 'Tipo de Trámite', value: TIPO_TRAMITE_LABELS[tramite.tipoTramite] },
              { label: 'Fecha de Registro', value: formatFecha(tramite.createdAt) },
              { label: 'Última Actualización', value: formatFecha(tramite.updatedAt) }
            ].map(item => (
              <div key={item.label} className="bg-gray-100 p-3 rounded">
                <div className="text-[0.65rem] text-gray-400">{item.label}</div>
                <div className="text-sm font-semibold text-gray-800">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Asunto */}
          <div className="bg-gray-100 p-3 rounded mb-3">
            <div className="text-[0.65rem] text-gray-400 mb-1">Asunto</div>
            <div className="text-sm text-gray-800">{tramite.asunto}</div>
          </div>

          {/* Observaciones */}
          {tramite.observaciones && (
            <div className="bg-yellow-50 border border-yellow-300 p-3 rounded">
              <div className="text-[0.7rem] font-semibold text-yellow-800 mb-1 flex items-center gap-1">
                <FaFileAlt /> Observaciones del operador:
              </div>
              <div className="text-sm text-yellow-900">{tramite.observaciones}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}