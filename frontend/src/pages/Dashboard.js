import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Meters from './Meters';
import Users from './Users';
import Alarms from './Alarms';
import Charts from './Charts';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [meters, setMeters] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [page, setPage] = useState('dashboard');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const metersRes = await axios.get('http://localhost:5000/api/meters', config);
      setMeters(metersRes.data);
      const alarmsRes = await axios.get('http://localhost:5000/api/alarms', config);
      setAlarms(alarmsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const renderPage = () => {
    if (page === 'meters') return <Meters />;
    if (page === 'users') return <Users />;
    if (page === 'alarms') return <Alarms />;
    if (page === 'charts') return <Charts />;
    return (
      <div>
        <h1 style={styles.pageTitle}>Dashboard</h1>
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Toplam Sayaç</h3>
            <p style={styles.cardValue}>{meters.length}</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Aktif Alarm</h3>
            <p style={styles.cardValue}>{alarms.filter(a => a.status === 'active').length}</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Toplam Alarm</h3>
            <p style={styles.cardValue}>{alarms.length}</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Rol</h3>
            <p style={styles.cardValue}>{user?.role}</p>
          </div>
        </div>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Son Sayaçlar</h2>
          {meters.length === 0 ? <p style={styles.empty}>Henüz sayaç yok</p> : meters.slice(0,5).map(m => (
            <div key={m.id} style={styles.item}>
              <span style={styles.itemName}>{m.name}</span>
              <span style={styles.itemType}>{m.type}</span>
              <span style={styles.itemLocation}>{m.location}</span>
            </div>
          ))}
        </div>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Son Alarmlar</h2>
          {alarms.length === 0 ? <p style={styles.empty}>Alarm yok</p> : alarms.slice(0,5).map(a => (
            <div key={a.id} style={styles.alarmItem}>
              <span style={styles.itemName}>{a.message}</span>
              <span style={{...styles.status, backgroundColor: a.status === 'active' ? '#e94560' : '#4caf50'}}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>⚡ SCADA</h2>
        <p style={styles.userInfo}>{user?.name}</p>
        <p style={styles.role}>{user?.role}</p>
        <nav>
          <p style={{...styles.navItem, color: page === 'dashboard' ? '#e94560' : '#ccc'}} onClick={() => setPage('dashboard')}>📊 Dashboard</p>
          <p style={{...styles.navItem, color: page === 'meters' ? '#e94560' : '#ccc'}} onClick={() => setPage('meters')}>🔌 Sayaçlar</p>
          <p style={{...styles.navItem, color: page === 'alarms' ? '#e94560' : '#ccc'}} onClick={() => setPage('alarms')}>🔔 Alarmlar</p>
          <p style={{...styles.navItem, color: page === 'charts' ? '#e94560' : '#ccc'}} onClick={() => setPage('charts')}>📈 Grafikler</p>
          {user?.role === 'admin' && (
            <p style={{...styles.navItem, color: page === 'users' ? '#e94560' : '#ccc'}} onClick={() => setPage('users')}>👥 Kullanıcılar</p>
          )}
        </nav>
        <button style={styles.logout} onClick={handleLogout}>Çıkış Yap</button>
      </div>
      <div style={styles.main}>
        {renderPage()}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#1a1a2e', color: '#fff' },
  sidebar: { width: '220px', backgroundColor: '#16213e', padding: '24px', display: 'flex', flexDirection: 'column' },
  logo: { color: '#e94560', marginBottom: '24px' },
  userInfo: { color: '#fff', fontWeight: 'bold', marginBottom: '4px' },
  role: { color: '#aaa', fontSize: '12px', marginBottom: '32px', textTransform: 'uppercase' },
  navItem: { padding: '10px 0', cursor: 'pointer', borderBottom: '1px solid #0f3460', transition: 'color 0.2s' },
  logout: { marginTop: 'auto', padding: '10px', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  main: { flex: 1, padding: '32px', overflowY: 'auto' },
  pageTitle: { color: '#e94560', marginBottom: '24px' },
  cards: { display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' },
  card: { flex: 1, minWidth: '150px', backgroundColor: '#16213e', padding: '24px', borderRadius: '12px', textAlign: 'center' },
  cardTitle: { color: '#aaa', fontSize: '14px', marginBottom: '8px' },
  cardValue: { color: '#e94560', fontSize: '32px', fontWeight: 'bold' },
  section: { backgroundColor: '#16213e', padding: '24px', borderRadius: '12px', marginBottom: '24px' },
  sectionTitle: { color: '#fff', marginBottom: '16px' },
  empty: { color: '#aaa' },
  item: { display: 'flex', gap: '16px', padding: '12px 0', borderBottom: '1px solid #0f3460' },
  itemName: { flex: 1, color: '#fff' },
  itemType: { color: '#aaa', fontSize: '13px' },
  itemLocation: { color: '#aaa', fontSize: '13px' },
  alarmItem: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #0f3460' },
  status: { padding: '4px 10px', borderRadius: '12px', fontSize: '12px', color: '#fff' }
};

export default Dashboard;