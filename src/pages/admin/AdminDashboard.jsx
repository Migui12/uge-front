// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBullhorn, FaClipboardList, FaFolderOpen, FaFileAlt, FaArrowRight, FaInbox, FaCog, FaCheck, FaChartBar  } from "react-icons/fa";
import { tramiteAdminService, comunicadoAdminService, convocatoriaAdminService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { formatFechaCorta, ESTADO_TRAMITE_LABELS, getBadgeClaseTramite } from '../../utils';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [ultimosTramites, setUltimosTramites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, tramitesRes] = await Promise.all([
          tramiteAdminService.estadisticas(),
          tramiteAdminService.listar({ limite: 5 })
        ]);
        setStats(statsRes.data.data);
        setUltimosTramites(tramitesRes.data.data);
      } catch (e) {
        console.error('Error dashboard:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cards = [
    { label: 'Recibidos', value: stats?.RECIBIDO || 0, icon: <FaInbox size={20} className='text-blue-700' /> , color: '#1d4ed8', bg: '#dbeafe', to: '/admin/tramites?estado=RECIBIDO' },
    { label: 'En Proceso', value: stats?.EN_PROCESO || 0, icon: <FaCog size={20} className='text-yellow-800' />, color: '#854d0e', bg: '#fef9c3', to: '/admin/tramites?estado=EN_PROCESO' },
    { label: 'Atendidos', value: stats?.ATENDIDO || 0, icon: <FaCheck size={20} className='text-green-700' />, color: '#15803d', bg: '#dcfce7', to: '/admin/tramites?estado=ATENDIDO' },
    { label: 'Total', value: stats?.total || 0, icon: <FaChartBar size={20} className="text-blue-900" />, color: '#003087', bg: '#f0f9ff', to: '/admin/tramites' }
  ];

  const menuItems = [
    { to: '/admin/comunicados', icon: <FaBullhorn size={28} className='text-blue-500' />, label: 'Comunicados', desc: 'Gestionar anuncios' },
    { to: '/admin/convocatorias', icon: <FaClipboardList size={28} className='text-yellow-500' />, label: 'Convocatorias', desc: 'Procesos de selección' },
    { to: '/admin/tramites', icon: <FaFolderOpen size={28} className='text-green-500' />, label: 'Mesa de Partes', desc: 'Gestionar trámites' },
    { to: '/admin/documentos', icon: <FaFileAlt size={28} className='text-blue-500' />, label: 'Documentos', desc: 'Archivos institucionales' }
  ];

  return (
    <div className="animate-fadeInUp">
      <div className='mb-6'>
        <h1 className='text-blue-900 text-2xl mb-1'>
          Bienvenido, {user?.nombre}
        </h1>
        <p className='text-gray-500 text-sm'>
          Panel de control del sistema UGEL · {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Estadísticas de trámites */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        {cards.map(card => (
          <Link key={card.label} to={card.to}>
            <div className="bg-white border border-gray-200 rounded-xl shadow-md p-5">
              <div className='flex justify-between items-start'>
                <div>
                  <div className={`text-4xl font-extrabold`} style={{ color: card.color}}>
                    {loading ? '—' : card.value}
                  </div>
                  <div className='mt-1 text-xs text-gray-500'>
                    {card.label}
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl`} style={{ background: card.bg, color: card.color }}>
                  {card.icon}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Últimos trámites */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-5">
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-base m-0 text-blue-900 font-semibold'>Últimos Trámites</h2>
            <Link 
              to="/admin/tramites"
              className='text-blue-400 text-xs hover:text-blue-600 flex items-center gap-1'
            >
              Ver todos <FaArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className='text-center p-6 text-gray-500'>Cargando...</div>
          ) : ultimosTramites.length === 0 ? (
            <p className='text-center text-gray-500 text-sm'>No hay trámites aún</p>
          ) : (
            <div className='flex flex-col gap-2'>
              {ultimosTramites.map(t => (
                <div key={t.id} className='flex justify-between items-center py-2.5 px-3 bg-gray-50 rounded-md gap-2'>
                  <div className='flex-1 min-w-0'>
                    <div className='text-xs font-semibold text-slate-900'>
                      {t.nombre} {t.apellido}
                    </div>
                    <div className='text-xs text-gray-400 font-mono'>
                      {t.numeroExpediente}
                    </div>
                  </div>
                  <span className={`${getBadgeClaseTramite(t.estado)} text-xs`}>
                    {ESTADO_TRAMITE_LABELS[t.estado]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accesos rápidos */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-5" >
          <h2 className='mb-4 text-base font-semibold text-blue-900'>Accesos Rápidos</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {menuItems.map(item => (
              <Link 
                key={item.to} 
                to={item.to} 
                className='flex flex-col bg-gray-50 p-4 rounded-xl border border-gray-200 gap-1 hover:bg-blue-50 hover:border-blue-600 transition-all duration-200'
              >
                <span className='text-2xl'>{item.icon}</span>
                <span className='text-sm font-semibol text-blue-800'>{item.label}</span>
                <span className='text-xs text-gray-400'>{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
