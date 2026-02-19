// src/pages/admin/AdminUsuarios.jsx
import { useState, useEffect } from 'react';
import { usuarioAdminService } from '../../services/api';
import { formatFechaCorta } from '../../utils';
import { useAuth } from '../../hooks/useAuth';

export default function AdminUsuarios() {
  const { user: currentUser } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '', dni: '', telefono: '', rolId: '2', activo: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmDel, setConfirmDel] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try { const res = await usuarioAdminService.listar(); setUsuarios(res.data.data); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (!form.nombre || !form.apellido || !form.email || !form.rolId) { setError('Nombre, apellido, email y rol son requeridos'); return; }
    if (modal === 'crear' && (!form.password || form.password.length < 8)) { setError('La contraseña debe tener mínimo 8 caracteres'); return; }
    setSaving(true); setError('');
    try {
      const data = { ...form, rolId: parseInt(form.rolId) };
      if (!data.password) delete data.password;
      modal === 'crear' ? await usuarioAdminService.crear(data) : await usuarioAdminService.actualizar(modal.id, data);
      setModal(null); fetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await usuarioAdminService.eliminar(id); setConfirmDel(null); fetch(); } catch (e) {}
  };

  const openEditar = (item) => {
    setForm({ nombre: item.nombre, apellido: item.apellido, email: item.email, password: '', dni: item.dni || '', telefono: item.telefono || '', rolId: String(item.rolId), activo: item.activo });
    setModal(item); setError('');
  };

  return (
    <div className="animate-fadeInUp">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.25rem', color: '#003087', fontSize: '1.4rem' }}>👥 Usuarios</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.875rem' }}>{usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''} registrado{usuarios.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={() => { setForm({ nombre: '', apellido: '', email: '', password: '', dni: '', telefono: '', rolId: '2', activo: true }); setModal('crear'); setError(''); }}>
          + Nuevo Usuario
        </button>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              {['Usuario', 'Email', 'Rol', 'Estado', 'Último Acceso', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.8rem' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Cargando...</td></tr>
            : usuarios.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', opacity: u.activo ? 1 : 0.5 }}>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '34px', height: '34px', background: u.id === currentUser?.id ? '#003087' : '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: u.id === currentUser?.id ? 'white' : '#64748b', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
                      {u.nombre?.charAt(0)}{u.apellido?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{u.nombre} {u.apellido}</div>
                      {u.dni && <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>DNI: {u.dni}</div>}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>{u.email}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ background: u.rol?.nombre === 'ADMIN' ? '#003087' : '#f1f5f9', color: u.rol?.nombre === 'ADMIN' ? 'white' : '#475569', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {u.rol?.nombre}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ background: u.activo ? '#dcfce7' : '#fee2e2', color: u.activo ? '#15803d' : '#b91c1c', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#64748b' }}>{u.ultimoAcceso ? formatFechaCorta(u.ultimoAcceso) : 'Nunca'}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => openEditar(u)} style={{ background: '#003087', color: 'white', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.8rem' }}>✏️</button>
                    {u.id !== currentUser?.id && (
                      <button onClick={() => setConfirmDel(u)} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.8rem' }}>🗑️</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', width: '100%', maxWidth: '520px' }}>
            <h3 style={{ margin: '0 0 1.25rem', color: '#003087' }}>{modal === 'crear' ? '+ Nuevo Usuario' : '✏️ Editar Usuario'}</h3>
            {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem', fontSize: '0.875rem' }}>⚠️ {error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div><label className="form-label">Nombre *</label><input className="form-input" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} /></div>
              <div><label className="form-label">Apellido *</label><input className="form-input" value={form.apellido} onChange={e => setForm(f => ({ ...f, apellido: e.target.value }))} /></div>
            </div>
            <div style={{ marginBottom: '1rem' }}><label className="form-label">Email *</label><input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div style={{ marginBottom: '1rem' }}><label className="form-label">{modal === 'crear' ? 'Contraseña *' : 'Nueva contraseña (dejar vacío para mantener)'}</label><input className="form-input" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Mínimo 8 caracteres" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div><label className="form-label">DNI</label><input className="form-input" value={form.dni} onChange={e => setForm(f => ({ ...f, dni: e.target.value }))} maxLength={8} /></div>
              <div><label className="form-label">Teléfono</label><input className="form-input" value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '1.5rem', alignItems: 'end' }}>
              <div>
                <label className="form-label">Rol *</label>
                <select className="form-select" value={form.rolId} onChange={e => setForm(f => ({ ...f, rolId: e.target.value }))}>
                  <option value="1">ADMIN</option>
                  <option value="2">OPERADOR</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.1rem' }}>
                <input type="checkbox" id="act" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} />
                <label htmlFor="act" className="form-label" style={{ margin: 0 }}>Activo</label>
              </div>
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
            <h3>¿Eliminar usuario?</h3>
            <p style={{ color: '#64748b', marginBottom: '1.25rem', fontSize: '0.875rem' }}>{confirmDel.nombre} {confirmDel.apellido}</p>
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
