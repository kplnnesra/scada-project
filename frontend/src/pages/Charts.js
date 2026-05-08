import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

function Charts() {
  const [meters, setMeters] = useState([]);
  const [selectedMeter, setSelectedMeter] = useState(null);
  const [readings, setReadings] = useState([]);
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchMeters();
  }, []);

  const fetchMeters = async () => {
    const res = await axios.get('http://localhost:5000/api/meters', config);
    setMeters(res.data);
    if (res.data.length > 0) {
      setSelectedMeter(res.data[0].id);
      fetchReadings(res.data[0].id);
    }
  };

  const fetchReadings = async (meterId) => {
    const res = await axios.get(`http://localhost:5000/api/meters/${meterId}/readings`, config);
    const formatted = res.data.reverse().map((r, i) => ({
      name: new Date(r.recorded_at).toLocaleTimeString('tr-TR'),
      değer: parseFloat(r.value),
      birim: r.unit
    }));
    setReadings(formatted);
  };

  const handleMeterChange = (id) => {
    setSelectedMeter(id);
    fetchReadings(id);
  };

  const selectedMeterData = meters.find(m => m.id === selectedMeter);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Tüketim Grafikleri</h2>

      <div style={styles.selector}>
        {meters.map(m => (
          <button
            key={m.id}
            style={{...styles.selectorBtn, backgroundColor: selectedMeter === m.id ? '#e94560' : '#0f3460'}}
            onClick={() => handleMeterChange(m.id)}
          >
            {m.name}
          </button>
        ))}
      </div>

      {readings.length > 0 ? (
        <>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              {selectedMeterData?.name} — Zaman Serisi
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={readings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" />
                <XAxis dataKey="name" stroke="#aaa" fontSize={11} />
                <YAxis stroke="#aaa" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#16213e', border: '1px solid #e94560', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="değer" stroke="#e94560" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              {selectedMeterData?.name} — Bar Grafik
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={readings.slice(-20)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" />
                <XAxis dataKey="name" stroke="#aaa" fontSize={11} />
                <YAxis stroke="#aaa" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#16213e', border: '1px solid #e94560', color: '#fff' }} />
                <Legend />
                <Bar dataKey="değer" fill="#e94560" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.stats}>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Min</p>
              <p style={styles.statValue}>{Math.min(...readings.map(r => r.değer)).toFixed(2)}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Max</p>
              <p style={styles.statValue}>{Math.max(...readings.map(r => r.değer)).toFixed(2)}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Ortalama</p>
              <p style={styles.statValue}>{(readings.reduce((a,b) => a + b.değer, 0) / readings.length).toFixed(2)}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Okuma Sayısı</p>
              <p style={styles.statValue}>{readings.length}</p>
            </div>
          </div>
        </>
      ) : (
        <p style={styles.empty}>Henüz okuma verisi yok</p>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '24px' },
  title: { color: '#e94560', marginBottom: '24px' },
  selector: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' },
  selectorBtn: { padding: '8px 16px', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  chartCard: { backgroundColor: '#16213e', padding: '24px', borderRadius: '12px', marginBottom: '24px' },
  chartTitle: { color: '#fff', marginBottom: '16px' },
  stats: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: '120px', backgroundColor: '#16213e', padding: '20px', borderRadius: '12px', textAlign: 'center' },
  statLabel: { color: '#aaa', fontSize: '13px', marginBottom: '8px' },
  statValue: { color: '#e94560', fontSize: '24px', fontWeight: 'bold' },
  empty: { color: '#aaa' }
};

export default Charts;