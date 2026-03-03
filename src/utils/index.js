import { configService } from "../services/api";

// Formatear fecha en español
export const formatFecha = (fecha) => {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

// Formatear fecha corta
export const formatFechaCorta = (fecha) => {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Formatear tamaño de archivo
export const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Labels para los estados de trámites
export const ESTADO_TRAMITE_LABELS = {
  RECIBIDO: 'Recibido',
  EN_PROCESO: 'En Proceso',
  ATENDIDO: 'Atendido',
  RECHAZADO: 'Rechazado'
};

// Labels para tipo de trámite
export const TIPO_TRAMITE_LABELS = {
  CONTRATACION_DOCENTE: 'Contratación Docente',
  LICENCIA: 'Licencia',
  PERMISO: 'Permiso',
  REASIGNACION: 'Reasignación',
  PERMUTA: 'Permuta',
  CESE: 'Cese',
  REINCORPORACION: 'Reincorporación',
  PAGO_HABERES: 'Pago de Haberes',
  ESCALAFON: 'Escalafón',
  RECONOCIMIENTO: 'Reconocimiento',
  SUBSANACION: 'Subsanación',
  APELACION: 'Apelación',
  OTRO: 'Otro'
};

// Labels para estados de convocatoria
export const ESTADO_CONVOCATORIA_LABELS = {
  PROXIMA: 'Próxima',
  ABIERTA: 'Abierta',
  CERRADA: 'Cerrada',
  DESIERTA: 'Desierta',
  CONCLUIDA: 'Concluida'
};

// Labels para tipo de convocatoria
export const TIPO_CONVOCATORIA_LABELS = {
  DOCENTE: 'Docente',
  ADMINISTRATIVO: 'Administrativo',
  CAS: 'CAS',
  DIRECTIVO: 'Directivo',
  AUXILIAR: 'Auxiliar',
  OTRO: 'Otro'
};

// Obtener clase CSS para badge de estado de trámite
export const getBadgeClaseTramite = (estado) => {
  const clases = {
    RECIBIDO: 'badge-estado badge-recibido',
    EN_PROCESO: 'badge-estado badge-en-proceso',
    ATENDIDO: 'badge-estado badge-atendido',
    RECHAZADO: 'badge-estado badge-rechazado'
  };
  return clases[estado] || 'badge-estado';
};

// Obtener clase CSS para badge de estado de convocatoria
export const getBadgeClaseConvocatoria = (estado) => {
  const clases = {
    PROXIMA: 'badge-estado badge-proxima',
    ABIERTA: 'badge-estado badge-abierta',
    CERRADA: 'badge-estado badge-cerrada',
    DESIERTA: 'badge-estado badge-rechazado',
    CONCLUIDA: 'badge-estado badge-archivado'
  };
  return clases[estado] || 'badge-estado';
};

// Obtener clase CSS para badge de estado de comunicado
export const getBadgeClaseComunicado = (estado) => {
  const clases = {
    PUBLICADO: 'badge-estado badge-publicado',
    BORRADOR: 'badge-estado badge-borrador',
    ARCHIVADO: 'badge-estado badge-archivado'
  };
  return clases[estado] || 'badge-estado';
};

// Truncar texto
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

let configCache = null;
export const fetchHorario = async () => {
  if (!configCache) {
    const res = await configService.obtener();
    configCache = res.data.data;
  }
  return configCache;
};

// Obtener la fecha actual
export const getFechaPeru = () => {
  return new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/Lima' })
  );
};

// Validar si está dentro del horario hábil (Lun-Vie 8am - 4pm)
export const horarioHabil = async () => {
  const config = await fetchHorario();
  if (!config) return false;

  const fecha = new Date();
  const dia = fecha.getDay();
  const hora = fecha.getHours();
  const minuto = fecha.getMinutes();

  const diaInicio = Number(config.dia_inicio);
  const diaFin = Number(config.dia_fin);

  const [hiHoras, hiMinutos] = config.hora_inicio.split(":").map(Number);
  const [hfHoras, hfMinutos] = config.hora_fin.split(":").map(Number);

  const esLaborable = dia >= diaInicio && dia <= diaFin;
  const enHorario =
    (hora > hiHoras || (hora === hiHoras && minuto >= hiMinutos)) &&
    (hora < hfHoras || (hora === hfHoras && minuto <= hfMinutos));

  return esLaborable && enHorario;
};