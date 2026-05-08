import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Alarms() {
  const [alarms, setAlarms] = useState([]);
  const [form, setForm] = useState({ meter_id: '', message: '', type: 'high_consumption' });
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => { fetchAlarms(); }, []);

  const fetchAlarms = async () => {
    const res = await axios.get('http://localhost:5000/api/alarms', config);
    setAlarms(res.data);
  };

  const addAlarm = async () => {
    await axios.post('http://localhost:5000/api/alarms', form, config);
    fetchAlarms();
    setForm({ meter_id: '', message: '', type: 'high_consumption' });
  };

  const closeAlarm = async (id) => {
    await axios.put(`http://localhost:5000/api/alarms/${id}/close`, {}, config);
    fetchAlarms();
  };

  const deleteAlarm = async (id) => {
    await axios.delete(`http://localhost:5000/api/alarms/${id}`, config);
    fetchAlarms();
  };

  const typeLabel = (type) => {
    const map = { high_consumption: '⚡ Yüksek Tüketim', low_voltage: '🔋 Düşük Voltaj', connection_lost: '📡 Bağlantı Kesildi', leak: '💧 Kaçak' };
    return map[type] || type;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Alarm Yönetimi</h2>

      <div style={styles.form}>
        <h3 style={styles.formTitle}>Yeni Alarm Oluştur</h3>
        <input style={styles.input} placeholder="Sayaç ID" value={form.meter_id} onChange={e => setForm({...form, meter_id: e.target.value})} />
        <input style={styles.input} placeholder="Mesaj" value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
        <select style={styles.input} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
          <option value="high_consumption">Yüksek Tüketim</option>
          <option value="low_voltage">Düşük Voltaj</option>
          <option value="connection_lost">Bağlantı Kesildi</option>
          <option value="leak">Kaçak</option>
        </select>
        <button style={styles.button} onClick={addAlarm}>Alarm Oluştur</button>
      </div>

      <div style={styles.list}>
        {alarms.map(a => (
          <div key={a.id} style={{...styles.card, borderLeft: `4px solid ${a.status === 'active' ? '#e94560' : '#4caf50'}`}}>
            <div style={styles.cardHeader}>
              <span style={styles.alarmType}>{typeLabel(a.type)}</span>
              <span style={{...styles.badge, backgroundColor: a.status === 'active' ? '#e94560' : '#4caf50'}}>
                {a.status === 'active' ? 'Aktif' : 'Kapalı'}
              </span>
            </div>
            <p style={styles.message}>{a.message}</p>
            <p style={styles.time}>🕐 {new Date(a.created_at).toLocaleString('tr-TR')}</p>
            <div style={styles.actions}>
              {a.status === 'active' && ['admin', 'region_manager'].includes(user.role) && (
                <button style={styles.closeBtn} onClick={() => closeAlarm(a.id)}>Kapat</button>
              )}
              {user.role === 'admin' && (
                <button style={styles.deleteBtn} onClick={() => deleteAlarm(a.id)}>Sil</button>
              )}
            </div>
          </div>
        ))}
        {alarms.length === 0 && <p style={styles.empty}>Alarm yok</p>}
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
  list: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' },
  card: { backgroundColor: '#16213e', padding: '20px', borderRadius: '12px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  alarmType: { color: '#fff', fontWeight: 'bold' },
  badge: { padding: '4px 10px', borderRadius: '12px', fontSize: '12px', color: '#fff' },
  message: { color: '#aaa', fontSize: '13px', marginBottom: '8px' },
  time: { color: '#666', fontSize: '12px', marginBottom: '12px' },
  actions: { display: 'flex', gap: '8px' },
  closeBtn: { padding: '6px 16px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  deleteBtn: { padding: '6px 16px', backgroundColor: 'transparent', color: '#e94560', border: '1px solid #e94560', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  empty: { color: '#aaa' }
};

export default Alarms;