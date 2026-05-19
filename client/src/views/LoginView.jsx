import { useState } from 'react';
import api from '../api';

export default function LoginView({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isForgot) {
        await api.post('/auth/update-password', { username, newPassword });
        setIsForgot(false);
        setPassword('');
        alert('Password updated! Please login.');
      } else if (isRegister) {
        const res = await api.post('/auth/register', { username, password });
        onLogin(res.user);
      } else {
        const res = await api.post('/auth/login', { username, password });
        onLogin(res.user);
      }
    } catch(err) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', width: '100vw' }}>
      <div className="card" style={{ width: 400, padding: 40, textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, marginBottom: 8, color: 'var(--text-bright)' }}>NEXUS</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
          {isForgot ? 'Reset your password' : isRegister ? 'Create your account' : 'Login to your knowledge OS'}
        </p>

        {error && <div style={{ color: '#ef4444', marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input className="input" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required />
          
          {!isForgot ? (
            <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          ) : (
            <input className="input" type="password" placeholder="New Password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required />
          )}

          <button className="btn btn-cyan" type="submit" style={{ marginTop: 8 }}>
            {isForgot ? 'Update Password' : isRegister ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          {isForgot ? (
            <button className="btn btn-ghost" onClick={() => setIsForgot(false)}>Back to Login</button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ cursor: 'pointer', color: 'var(--cyan)' }} onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
              </span>
              <span style={{ cursor: 'pointer' }} onClick={() => setIsForgot(true)}>Forgot Password?</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
