// src/pages/admin/AdminDocumentos.jsx
import { useState, useEffect } from 'react';
import { documentoAdminService } from '../../services/api';
import { formatFechaCorta, formatFileSize } from '../../utils';

const CATEGORIAS = ['DIRECTIVA', 'RESOLUCION', 'OFICIO', 'MEMORANDO', 'INFORME', 'FORMATO', 'OTRO'];

export default function AdminDocumentos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ titulo: '', descripcion: '', categoria: 'OTRO', activo: true, archivo: null });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmDel, setConfirmDel] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await documentoAdminService.listar({ limite: 50 });
      setItems(res.data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (!form.titulo) { setError('El título es requerido'); return; }
    if (modal === 'crear' && !form.archivo) { setError('El archivo es requerido'); return; }
    setSaving(true); setError('');
    try {
      const fd = new FormData();
      if (form.archivo) fd.append('archivo', form.archivo);
      fd.append('titulo', form.titulo);
      fd.append('descripcion', form.descripcion || '');
      fd.append('categoria', form.categoria);
      fd.append('activo', String(form.activo));
      modal === 'crear' ? await documentoAdminService.crear(fd) : await documentoAdminService.actualizar(modal.id, fd);
      setModal(null); fetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await documentoAdminService.eliminar(id); setConfirmDel(null); fetch(); } catch (e) {}
  };

  const getCatIcon = (cat) => {
    const icons = { DIRECTIVA: '📌', RESOLUCION: '⚖️', OFICIO: '📬', MEMORANDO: '📝', INFORME: '📊', FORMATO: '📋', OTRO: '📄' };
    return icons[cat] || '📄';
  };

  return (
    <div className="animate-fadeInUp">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.25rem', color: '#003087', fontSize: '1.4rem' }}>📄 Documentos</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.875rem' }}>{items.length} documento{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={() => { setForm({ titulo: '', descripcion: '', categoria: 'OTRO', activo: true, archivo: null }); setModal('crear'); setError(''); }}>
          + Subir Documento
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Cargando...</div>
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No hay documentos</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {items.map(item => (
            <div key={item.id} className="card" style={{ padding: '1rem', opacity: item.activo ? 1 : 0.6 }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.8rem', flexShrink: 0, width: '44px', height: '44px', background: '#f0f9ff', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getCatIcon(item.categoria)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', color: '#1e293b' }}>{item.titulo}</h3>
                  {item.descripcion && <p style={{ margin: '0 0 0.4rem', fontSize: '0.78rem', color: '#64748b' }}>{item.descripcion}</p>}
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                    {item.categoria} · {formatFechaCorta(item.createdAt)}
                    {item.archivoTamanio ? ` · ${formatFileSize(item.archivoTamanio)}` : ''}
                    {!item.activo && ' · [Inactivo]'}
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <a href={`http://localhost:5000${item.archivoUrl}`} target="_blank" rel="noreferrer"
                      style={{ background: '#f1f5f9', color: '#475569', padding: '0.3rem 0.6rem', borderRadius: '0.375rem', fontSize: '0.78rem', textDecoration: 'none' }}>
                      👁️ Ver
                    </a>
                    <button onClick={() => { setForm({ titulo: item.titulo, descripcion: item.descripcion || '', categoria: item.categoria, activo: item.activo, archivo: null }); setModal(item); setError(''); }}
                      style={{ background: '#003087', color: 'white', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.78rem' }}>
                      ✏️
                    </button>
                    <button onClick={() => setConfirmDel(item)}
                      style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.78rem' }}>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', width: '100%', maxWidth: '520px' }}>
            <h3 style={{ margin: '0 0 1.25rem', color: '#003087' }}>{modal === 'crear' ? '+ Subir Documento' : '✏️ Editar Documento'}</h3>
            {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem', fontSize: '0.875rem' }}>⚠️ {error}</div>}

            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Título *</label>
              <input className="form-input" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Nombre del documento" />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Descripción</label>
              <input className="form-input" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} placeholder="Breve descripción..." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '1rem', alignItems: 'end' }}>
              <div>
                <label className="form-label">Categoría</label>
                <select className="form-select" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.1rem' }}>
                <input type="checkbox" id="activo" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} />
                <label htmlFor="activo" className="form-label" style={{ margin: 0 }}>Activo</label>
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Archivo {modal === 'crear' ? '*' : '(dejar vacío para mantener actual)'}</label>
              <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={e => setForm(f => ({ ...f, archivo: e.target.files[0] || null }))}
                style={{ display: 'block', width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? '⏳' : '✅ Guardar'}</button>
            </div>
          </div>
        </div>
      )}

      {confirmDel && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
            <h3>¿Eliminar documento?</h3>
            <p style={{ color: '#64748b', marginBottom: '1.25rem', fontSize: '0.875rem' }}>"{confirmDel.titulo}"</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setConfirmDel(null)}>Cancelar</button>
              <button className="btn-danger" onClick={() => handleDelete(confirmDel.id)}>🗑️ Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
