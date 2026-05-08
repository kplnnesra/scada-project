import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'subscriber' });
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5000/api/users', config);
    setUsers(res.data);
  };

  const addUser = async () => {
    await axios.post('http://localhost:5000/api/auth/register', form, config);
    fetchUsers();
    setForm({ name: '', email: '', password: '', role: 'subscriber' });
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5000/api/users/${id}`, config);
    fetchUsers();
  };

  const roleLabel = (role) => {
    const map = { admin: '👑 Admin', region_manager: '🗺️ Bölge Sorumlusu', subscriber: '👤 Abone', meter: '🔌 Sayaç' };
    return map[role] || role;
  };

  const roleColor = (role) => {
    const map = { admin: '#e94560', region_manager: '#f59e0b', subscriber: '#3b82f6', meter: '#4caf50' };
    return map[role] || '#aaa';
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Kullanıcı Yönetimi</h2>

      <div style={styles.form}>
        <h3 style={styles.formTitle}>Yeni Kullanıcı Ekle</h3>
        <input style={styles.input} placeholder="Ad Soyad" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input style={styles.input} placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input style={styles.input} placeholder="Şifre" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <select style={styles.input} value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
          <option value="subscriber">Abone</option>
          <option value="region_manager">Bölge Sorumlusu</option>
          <option value="admin">Admin</option>
          <option value="meter">Sayaç</option>
        </select>
        <button style={styles.button} onClick={addUser}>Kullanıcı Ekle</button>
      </div>

      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Ad</span>
          <span>Email</span>
          <span>Rol</span>
          <span>İşlem</span>
        </div>
        {users.map(u => (
          <div key={u.id} style={styles.tableRow}>
            <span style={styles.userName}>{u.name}</span>
            <span style={styles.userEmail}>{u.email}</span>
            <span style={{...styles.badge, backgroundColor: roleColor(u.role)}}>{roleLabel(u.role)}</span>
            <button style={styles.deleteBtn} onClick={() => deleteUser(u.id)}>Sil</button>
          </div>
        ))}
        {users.length === 0 && <p style={styles.empty}>Kullanıcı yok</p>}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '24px' },
  title: { color: '#e94560', marginBottom: '24px' },
  form: { backgroundColor: '#16213e', padding: '24px', borderRadius: '12px', marginBottom: '24px' },
  formTitle: { color: '#fff', marginBottom: '16px' },
  input: { width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#0f3460', color: '#fff', fontSize: '14px', boxSizing: 'border-box' },
  button: { padding: '10px 24px', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  table: { backgroundColor: '#16213e', borderRadius: '12px', overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 80px', padding: '16px 20px', backgroundColor: '#0f3460', color: '#aaa', fontSize: '13px', fontWeight: 'bold' },
  tableRow: { display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 80px', padding: '16px 20px', borderBottom: '1px solid #0f3460', alignItems: 'center' },
  userName: { color: '#fff', fontWeight: 'bold' },
  userEmail: { color: '#aaa', fontSize: '13px' },
  badge: { padding: '4px 10px', borderRadius: '12px', fontSize: '12px', color: '#fff', display: 'inline-block' },
  deleteBtn: { padding: '6px 12px', backgroundColor: 'transparent', color: '#e94560', border: '1px solid #e94560', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' },
  empty: { color: '#aaa', padding: '20px' }
};

export default Users;