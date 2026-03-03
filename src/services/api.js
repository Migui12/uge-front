import axios from 'axios';

/* const API_URL = import.meta.env.VITE_API_URL || 'https://ugel-api.onrender.com/api'; */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de request: agregar token JWT automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ugel_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response: manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expirado o inválido - limpiar sesión
      localStorage.removeItem('ugel_token');
      localStorage.removeItem('ugel_user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }

    if (status === 403) {
      
      alert(error.response.data.message || 'No tienes permisos para realizar esta acción');
    }
    return Promise.reject(error);
  }
);

// ============================================================
// SERVICIOS
// ============================================================

// AUTH
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  cambiarPassword: (data) => api.post('/auth/cambiar-password', data)
};

//CONFIGURACION
export const configService = {
  obtener: () => api.get('/configuracion'),
  actualizar: (data) => api.put('/admin/configuracion/1', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

// COMUNICADOS (público)
export const comunicadoService = {
  listar: (params) => api.get('/comunicados', { params }),
  obtener: (id) => api.get(`/comunicados/${id}`)
};

// COMUNICADOS (admin)
export const comunicadoAdminService = {
  listar: (params) => api.get('/admin/comunicados', { params }),
  crear: (formData) => api.post('/admin/comunicados', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  actualizar: (id, formData) => api.put(`/admin/comunicados/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  eliminar: (id) => api.delete(`/admin/comunicados/${id}`)
};

// CONVOCATORIAS (público)
export const convocatoriaService = {
  listar: (params) => api.get('/convocatorias', { params }),
  obtener: (id) => api.get(`/convocatorias/${id}`)
};

// CONVOCATORIAS (admin)
export const convocatoriaAdminService = {
  listar: (params) => api.get('/admin/convocatorias', { params }),
  crear: (formData) => api.post('/admin/convocatorias', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  actualizar: (id, formData) => api.put(`/admin/convocatorias/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  eliminar: (id) => api.delete(`/admin/convocatorias/${id}`)
};

// TRÁMITES (público)
export const tramiteService = {
  registrar: (formData) => api.post('/tramites', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  consultar: (codigo) => api.get(`/tramites/consultar/${codigo}`)
};

// TRÁMITES (admin)
export const tramiteAdminService = {
  listar: (params) => api.get('/admin/tramites', { params }),
  obtener: (id) => api.get(`/admin/tramites/${id}`),
  cambiarEstado: (id, data) => api.patch(`/admin/tramites/${id}/estado`, data),
  estadisticas: () => api.get('/admin/tramites/estadisticas')
};

// DOCUMENTOS (público)
export const documentoService = {
  listar: (params) => api.get('/documentos', { params }),
  getDownloadUrl: (id) => `${API_URL}/documentos/${id}/descargar`
};

// DOCUMENTOS (admin)
export const documentoAdminService = {
  listar: (params) => api.get('/admin/documentos', { params }),
  crear: (formData) => api.post('/admin/documentos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  actualizar: (id, formData) => api.put(`/admin/documentos/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  eliminar: (id) => api.delete(`/admin/documentos/${id}`)
};

// NOTICIAS (público)
export const noticiaService = {
  listar: (params) => api.get('/noticias', { params }),
  obtener: (id) => api.get(`/noticias/${id}`)
};

// NOTICIAS (admin)
export const noticiaAdminService = {
  listar: (params) => api.get('/admin/noticias', { params }),
  crear: (formData) => api.post('/admin/noticias', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  actualizar: (id, formData) => api.put(`/admin/noticias/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  eliminar: (id) => api.delete(`/admin/noticias/${id}`)
};

// USUARIOS (admin)
export const usuarioAdminService = {
  listar: () => api.get('/admin/usuarios'),
  crear: (data) => api.post('/admin/usuarios', data),
  actualizar: (id, data) => api.put(`/admin/usuarios/${id}`, data),
  eliminar: (id) => api.delete(`/admin/usuarios/${id}`)
};

export default api;
