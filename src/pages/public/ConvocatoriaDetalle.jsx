import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { convocatoriaService } from '../../services/api';
import { formatFechaCorta, ESTADO_CONVOCATORIA_LABELS, TIPO_CONVOCATORIA_LABELS, getBadgeClaseConvocatoria } from '../../utils';
import { FaUsers, FaCalendarAlt, FaFlagCheckered, FaChartBar, FaFileAlt, FaClipboardList, FaCheck, FaBriefcase, FaArrowLeft } from 'react-icons/fa';

export default function ConvocatoriaDetalle() {
  const { id } = useParams();
  const [conv, setConv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    convocatoriaService.obtener(id)
      .then(res => setConv(res.data.data))
      .catch(() => setError('Convocatoria no encontrada'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="text-center py-12 text-gray-500 flex justify-center items-center">
      Cargando...
    </div>
  );

  if (error) return (
    <div className="bg-white shadow rounded p-12 text-center">
      <p className="text-red-600 mb-4">{error}</p>
      <Link to="/convocatorias" className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded inline-flex items-center gap-2">
        <FaArrowLeft /> Volver
      </Link>
    </div>
  );

  return (
    <div className="animate-fadeInUp px-8 md:px-10 lg:px-50">
      <Link
        to="/convocatorias"
        className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1 mb-4"
      >
        <FaArrowLeft /> Volver a convocatorias
      </Link>

      <div className="bg-white shadow rounded-2xl p-8">
        {/* Estado y tipo */}
        <div className="flex flex-wrap gap-3 mb-4">
          <span className={getBadgeClaseConvocatoria(conv.estado)}>{ESTADO_CONVOCATORIA_LABELS[conv.estado]}</span>
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">{TIPO_CONVOCATORIA_LABELS[conv.tipo]}</span>
        </div>

        {/* Título */}
        <h1 className="text-blue-800 text-2xl mb-6 leading-snug">{conv.titulo}</h1>

        {/* Información rápida */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 mb-8">
          {[
            { label: 'Plazas', value: conv.plazas, icon: <FaUsers className="mx-auto text-xl" /> },
            { label: 'Inicio', value: formatFechaCorta(conv.fechaInicio), icon: <FaCalendarAlt className="mx-auto text-xl" /> },
            { label: 'Cierre', value: formatFechaCorta(conv.fechaFin), icon: <FaFlagCheckered className="mx-auto text-xl" /> },
            { label: 'Resultados', value: formatFechaCorta(conv.fechaResultados), icon: <FaChartBar className="mx-auto text-xl" /> },
          ].map(info => (
            <div key={info.label} className="bg-gray-100 p-3 rounded-2xl text-center">
              {info.icon}
              <div className="text-gray-500 text-xs mt-1">{info.label}</div>
              <div className="font-semibold text-gray-800 text-sm">{info.value}</div>
            </div>
          ))}
        </div>

        {/* Descripción */}
        <div className="mb-6">
          <h2 className="text-blue-800 text-sm border-b-2 border-gray-200 pb-1 mb-2 flex items-center gap-1">
            <FaFileAlt /> Descripción
          </h2>
          <p className="text-gray-700 leading-relaxed">{conv.descripcion}</p>
        </div>

        {/* Requisitos */}
        {conv.requisitos && (
          <div className="mb-6">
            <h2 className="text-blue-800 text-sm border-b-2 border-gray-200 pb-1 mb-2 flex items-center gap-1">
              <FaCheck /> Requisitos
            </h2>
            <pre className="whitespace-pre-wrap leading-relaxed text-gray-700 font-sans m-0">{conv.requisitos}</pre>
          </div>
        )}

        {/* Beneficios */}
        {conv.beneficios && (
          <div className="mb-6">
            <h2 className="text-blue-800 text-sm border-b-2 border-gray-200 pb-1 mb-2 flex items-center gap-1">
              <FaBriefcase /> Beneficios
            </h2>
            <p className="text-gray-700 leading-relaxed">{conv.beneficios}</p>
          </div>
        )}

        {/* Archivos */}
        {(conv.archivoUrl || conv.baseUrl) && (
          <div className="flex flex-wrap gap-4 p-4 bg-gray-100 rounded-xl">
            {conv.archivoUrl && (
              <a
                href={`http://localhost:5000${conv.archivoUrl}`}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-[10px] inline-flex items-center gap-2 text-sm"
              >
                <FaFileAlt /> Ver Convocatoria
              </a>
            )}
            {conv.baseUrl && (
              <a
                href={`http://localhost:5000${conv.baseUrl}`}
                target="_blank"
                rel="noreferrer"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-[10px] inline-flex items-center gap-2 text-sm"
              >
                <FaClipboardList /> Ver Bases
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}