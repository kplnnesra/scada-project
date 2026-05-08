import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Email veya şifre hatalı');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>SCADA Sistemi</h2>
        <p style={styles.subtitle}>Giriş Yap</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button style={styles.button} type="submit">Giriş Yap</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1a1a2e' },
  card: { backgroundColor: '#16213e', padding: '40px', borderRadius: '12px', width: '360px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' },
  title: { color: '#e94560', textAlign: 'center', marginBottom: '8px' },
  subtitle: { color: '#aaa', textAlign: 'center', marginBottom: '24px' },
  input: { width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#0f3460', color: '#fff', fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
  error: { color: '#e94560', textAlign: 'center', marginBottom: '16px' }
};

export default Login;