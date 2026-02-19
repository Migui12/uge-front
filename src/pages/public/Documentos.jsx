import { useState, useEffect } from 'react';
import { FaThumbtack, FaBalanceScale, FaEnvelope, FaFileAlt, FaChartBar, FaClipboard, FaFileDownload } from 'react-icons/fa';
import { documentoService } from '../../services/api';
import { formatFechaCorta, formatFileSize } from '../../utils';

const CATEGORIAS = ['DIRECTIVA', 'RESOLUCION', 'OFICIO', 'MEMORANDO', 'INFORME', 'FORMATO', 'OTRO'];

export default function Documentos() {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState('');
  const [pagination, setPagination] = useState({ total: 0 });

  const fetch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoria) params.categoria = categoria;
      const res = await documentoService.listar(params);
      setDocumentos(res.data.data);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [categoria]);

  const getCatIcon = (cat) => {
    const icons = {
      DIRECTIVA: <FaThumbtack />,
      RESOLUCION: <FaBalanceScale />,
      OFICIO: <FaEnvelope />,
      MEMORANDO: <FaFileAlt />,
      INFORME: <FaChartBar />,
      FORMATO: <FaClipboard />,
      OTRO: <FaFileDownload />
    };
    return icons[cat] || <FaFileDownload />;
  };

  return (
    <div className="animate-fadeInUp px-8 md:px-10 lg:px-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl text-blue-800 mb-1 flex items-center gap-2">
          <FaFileDownload /> Documentos
        </h1>
        <p className="text-gray-500">Descargue directivas, resoluciones, formatos y otros documentos institucionales</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setCategoria('')}
          className={`px-4 py-1 rounded-full text-sm font-medium ${!categoria ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          Todos
        </button>
        {CATEGORIAS.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoria(cat === categoria ? '' : cat)}
            className={`px-4 py-1 rounded-full text-sm font-medium ${categoria === cat ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            <span className="inline-flex items-center gap-1">{getCatIcon(cat)} {cat}</span>
          </button>
        ))}
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : documentos.length === 0 ? (
        <div className="bg-white shadow rounded-2xl p-12 text-center text-gray-500">No hay documentos disponibles</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documentos.map(doc => (
            <div key={doc.id} className="bg-white shadow rounded-xl p-4 flex gap-3">
              <div className="shrink-0 w-12 h-12 bg-blue-50 rounded flex items-center justify-center text-2xl">
                {getCatIcon(doc.categoria)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-800 text-sm font-semibold truncate mb-1">{doc.titulo}</h3>
                {doc.descripcion && <p className="text-gray-500 text-xs mb-2 line-clamp-2">{doc.descripcion}</p>}
                <div className="text-gray-400 text-xs mb-2">
                  {formatFechaCorta(doc.createdAt)}
                  {doc.archivoTamanio ? ` · ${formatFileSize(doc.archivoTamanio)}` : ''}
                  {doc.descargas > 0 && ` · ${doc.descargas} descargas`}
                </div>
                <a
                  href={documentoService.getDownloadUrl(doc.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 bg-blue-800 hover:bg-blue-900 text-white text-xs px-3 py-1 rounded"
                >
                  <FaFileDownload /> Descargar
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}