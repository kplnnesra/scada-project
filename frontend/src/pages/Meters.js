import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Meters() {
  const [meters, setMeters] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'electricity', location: '', subscriber_id: '', region_id: '' });
  const [readings, setReadings] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => { fetchMeters(); }, []);

  const fetchMeters = async () => {
    const res = await axios.get('http://localhost:5000/api/meters', config);
    setMeters(res.data);
  };

  const addMeter = async () => {
    await axios.post('http://localhost:5000/api/meters', form, config);
    fetchMeters();
    setForm({ name: '', type: 'electricity', location: '', subscriber_id: '', region_id: '' });
  };

  const deleteMeter = async (id) => {
    await axios.delete(`http://localhost:5000/api/meters/${id}`, config);
    fetchMeters();
  };

  const sendReading = async (id) => {
    await axios.post(`http://localhost:5000/api/meters/${id}/readings`, { value: readings[id], unit: 'kWh' }, config);
    alert('Okuma eklendi!');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sayaç Yönetimi</h2>

      {user.role === 'admin' && (
        <div style={styles.form}>
          <h3 style={styles.formTitle}>Yeni Sayaç Ekle</h3>
          <input style={styles.input} placeholder="Sayaç adı" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <select style={styles.input} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
            <option value="electricity">Elektrik</option>
            <option value="water">Su</option>
            <option value="gas">Doğalgaz</option>
          </select>
          <input style={styles.input} placeholder="Konum" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
          <input style={styles.input} placeholder="Abone ID" value={form.subscriber_id} onChange={e => setForm({...form, subscriber_id: e.target.value})} />
          <input style={styles.input} placeholder="Bölge ID" value={form.region_id} onChange={e => setForm({...form, region_id: e.target.value})} />
          <button style={styles.button} onClick={addMeter}>Ekle</button>
        </div>
      )}

      <div style={styles.list}>
        {meters.map(m => (
          <div key={m.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.meterName}>{m.name}</span>
              <span style={{...styles.badge, backgroundColor: m.type === 'electricity' ? '#e94560' : m.type === 'water' ? '#3b82f6' : '#f59e0b'}}>
                {m.type === 'electricity' ? '⚡ Elektrik' : m.type === 'water' ? '💧 Su' : '🔥 Gaz'}
              </span>
            </div>
            <p style={styles.location}>📍 {m.location || 'Konum belirtilmedi'}</p>
            <div style={styles.readingRow}>
              <input
                style={styles.readingInput}
                type="number"
                placeholder="Okuma değeri"
                onChange={e => setReadings({...readings, [m.id]: e.target.value})}
              />
              <button style={styles.readingBtn} onClick={() => sendReading(m.id)}>Kaydet</button>
            </div>
            {user.role === 'admin' && (
              <button style={styles.deleteBtn} onClick={() => deleteMeter(m.id)}>Sil</button>
            )}
          </div>
        ))}
        {meters.length === 0 && <p style={styles.empty}>Henüz sayaç yok</p>}
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
  list: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  card: { backgroundColor: '#16213e', padding: '20px', borderRadius: '12px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  meterName: { color: '#fff', fontWeight: 'bold' },
  badge: { padding: '4px 10px', borderRadius: '12px', fontSize: '12px', color: '#fff' },
  location: { color: '#aaa', fontSize: '13px', marginBottom: '12px' },
  readingRow: { display: 'flex', gap: '8px', marginBottom: '8px' },
  readingInput: { flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#0f3460', color: '#fff', fontSize: '13px' },
  readingBtn: { padding: '8px 12px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  deleteBtn: { width: '100%', padding: '8px', backgroundColor: 'transparent', color: '#e94560', border: '1px solid #e94560', borderRadius: '8px', cursor: 'pointer', marginTop: '8px' },
  empty: { color: '#aaa' }
};

export default Meters;