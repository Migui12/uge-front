import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { comunicadoService } from "../../services/api";
import { formatFecha } from "../../utils";
import {
  FaArrowLeft,
  FaStar,
  FaCalendarAlt,
  FaUserEdit,
  FaEye,
  FaPaperclip,
  FaDownload,
} from "react-icons/fa";

export default function ComunicadoDetalle() {
  const { id } = useParams();
  const [com, setCom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    comunicadoService
      .obtener(id)
      .then((res) => setCom(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-16 text-slate-500 text-sm">
        Cargando...
      </div>
    );

  if (!com)
    return (
      <div className="bg-white rounded-xl shadow p-12 text-center max-w-2xl mx-auto mt-10">
        <p className="text-red-600 font-medium mb-4">
          Comunicado no encontrado
        </p>
        <Link
          to="/comunicados"
          className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          <FaArrowLeft />
          Volver
        </Link>
      </div>
    );

  return (
    <div className="animate-fadeInUp px-4 md:px-10 lg:px-50">

      {/* Volver */}
      <Link
        to="/comunicados"
        className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 text-sm font-medium mb-6 transition"
      >
        <FaArrowLeft />
        Volver a comunicados
      </Link>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md p-8">

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {com.destacado && (
            <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
              <FaStar className="text-yellow-500" />
              Destacado
            </span>
          )}

          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
            {com.categoria}
          </span>
        </div>

        {/* Título */}
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6 leading-snug">
          {com.titulo}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-6 text-xs text-slate-500 mb-8 pb-6 border-b">
          <span className="flex items-center gap-2">
            <FaCalendarAlt />
            {formatFecha(com.fechaPublicacion || com.createdAt)}
          </span>

          {com.autor && (
            <span className="flex items-center gap-2">
              <FaUserEdit />
              {com.autor.nombre} {com.autor.apellido}
            </span>
          )}

          <span className="flex items-center gap-2">
            <FaEye />
            {com.vistas} visitas
          </span>
        </div>

        {/* Contenido */}
        <div
          className="prose max-w-none prose-slate leading-relaxed text-[15px]"
          dangerouslySetInnerHTML={{ __html: com.contenido }}
        />

        {/* Archivo adjunto */}
        {com.archivoUrl && (
          <div className="mt-10 p-6 bg-slate-50 rounded-xl border">
            <p className="flex items-center gap-2 font-semibold text-slate-700 mb-4">
              <FaPaperclip />
              Archivo adjunto
            </p>

            <a
              href={`http://localhost:5000${com.archivoUrl}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              <FaDownload />
              Descargar {com.archivoNombre}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}