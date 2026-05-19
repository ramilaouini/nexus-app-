import { useState, useRef } from 'react';
import { api } from '../api';

export default function ProfileView({ user, setUser }) {
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const fileRef = useRef(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/update-password', { username: user.username, newPassword });
      setMsg('Password updated successfully.');
      setNewPassword('');
    } catch(err) { setMsg('Error: ' + err.message); }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const b64 = ev.target.result;
      try {
        const res = await api.post('/auth/update-avatar', { username: user.username, avatar: b64 });
        const updated = { ...user, avatar: res.avatar };
        setUser(updated);
        localStorage.setItem('nexus_user', JSON.stringify(updated));
        setMsg('Avatar updated successfully.');
      } catch(err) { setMsg('Error: ' + err.message); }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="view">
      <div className="page-header">
        <div className="page-eyebrow">Knowledge OS · Account</div>
        <h1 className="page-title">Profile Settings</h1>
        <p className="page-subtitle">Manage your account and avatar.</p>
      </div>

      <div className="card" style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Avatar Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%', background: 'var(--surface)', border: '2px solid var(--cyan)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer',
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.2)'
          }} onClick={() => fileRef.current.click()}>
            {user.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 32 }}>👤</span>}
          </div>
          <div>
            <h2 style={{ fontSize: 24, color: 'var(--text-bright)', textTransform: 'capitalize' }}>{user.username}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>Click your avatar to upload a new image.</p>
            <input type="file" ref={fileRef} style={{ display: 'none' }} accept="image/*" onChange={handleAvatarUpload} />
            <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => fileRef.current.click()}>Upload Image</button>
          </div>
        </div>

        {msg && <div style={{ color: 'var(--cyan)' }}>{msg}</div>}

        {/* Password Reset */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24 }}>
          <h3 style={{ fontSize: 18, color: 'var(--text-bright)', marginBottom: 16 }}>Change Password</h3>
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', gap: 12 }}>
            <input className="input" style={{ flex: 1 }} type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            <button className="btn btn-cyan" type="submit">Update Password</button>
          </form>
        </div>

      </div>
    </div>
  );
}
