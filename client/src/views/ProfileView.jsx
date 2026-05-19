import { useState, useRef, useEffect } from 'react';
import { api } from '../api';

const BADGES = [
  { id: 'master', label: '🏆 C++ Master', desc: 'Unlocked the highest grade of systems compilations.', cost: 150 },
  { id: 'ai', label: '🧠 AI Oracle', desc: 'Mastered co-pilot dynamic prompts and integrations.', cost: 200 },
  { id: 'arcade', label: '👾 Arcade King', desc: 'Achieved ultimate scores across all 20 retro games.', cost: 250 }
];

const THEMES = [
  { id: 'default', label: '🔵 Standard Nexus', desc: 'Default premium deep-blue space layout.', cost: 0 },
  { id: 'synthwave', label: '🪐 Synthwave Grid', desc: 'Vibrant hot-pink and violet neon matrix.', cost: 300 },
  { id: 'forest', label: '🌲 Emerald Forest', desc: 'Soothing forest greens and dark wood accents.', cost: 300 },
  { id: 'hacker', label: '👾 Hacker Terminal', desc: 'Pure matrix terminal black and bright neon green.', cost: 300 }
];

export default function ProfileView({ user, setUser }) {
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const fileRef = useRef(null);

  // Store Wallet & Unlocks
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('nexus_coins') || '100'));
  const [unlockedBadges, setUnlockedBadges] = useState(() => JSON.parse(localStorage.getItem('unlocked_badges') || '[]'));
  const [unlockedThemes, setUnlockedThemes] = useState(() => JSON.parse(localStorage.getItem('unlocked_themes') || '["default"]'));
  const [activeTheme, setActiveTheme] = useState(() => localStorage.getItem('active_theme') || 'default');

  const applyTheme = (themeName) => {
    const root = document.documentElement;
    if (themeName === 'synthwave') {
      root.style.setProperty('--cyan', '#ff007f');
      root.style.setProperty('--purple', '#9d00ff');
      root.style.setProperty('--background', '#0b001a');
      root.style.setProperty('--surface', '#13002b');
    } else if (themeName === 'forest') {
      root.style.setProperty('--cyan', '#2ecc71');
      root.style.setProperty('--purple', '#27ae60');
      root.style.setProperty('--background', '#0a140f');
      root.style.setProperty('--surface', '#12251a');
    } else if (themeName === 'hacker') {
      root.style.setProperty('--cyan', '#00ff00');
      root.style.setProperty('--purple', '#009900');
      root.style.setProperty('--background', '#000000');
      root.style.setProperty('--surface', '#0a0a0a');
    } else {
      // Standard dark
      root.style.setProperty('--cyan', '#00e5ff');
      root.style.setProperty('--purple', '#a855f7');
      root.style.setProperty('--background', '#0b0f19');
      root.style.setProperty('--surface', '#131b2e');
    }
  };

  useEffect(() => {
    applyTheme(activeTheme);
  }, [activeTheme]);

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

  const buyBadge = (b) => {
    if (coins < b.cost) { alert('Not enough ByteCoins!'); return; }
    const nextCoins = coins - b.cost;
    const nextBadges = [...unlockedBadges, b.id];
    setCoins(nextCoins);
    setUnlockedBadges(nextBadges);
    localStorage.setItem('nexus_coins', nextCoins.toString());
    localStorage.setItem('unlocked_badges', JSON.stringify(nextBadges));
    alert(`🎉 Purchased and unlocked "${b.label}"!`);
  };

  const buyTheme = (t) => {
    if (coins < t.cost) { alert('Not enough ByteCoins!'); return; }
    const nextCoins = coins - t.cost;
    const nextThemes = [...unlockedThemes, t.id];
    setCoins(nextCoins);
    setUnlockedThemes(nextThemes);
    localStorage.setItem('nexus_coins', nextCoins.toString());
    localStorage.setItem('unlocked_themes', JSON.stringify(nextThemes));
    alert(`🎉 Purchased and unlocked "${t.label}"!`);
  };

  const selectTheme = (themeId) => {
    setActiveTheme(themeId);
    localStorage.setItem('active_theme', themeId);
  };

  return (
    <div className="view" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <div className="page-eyebrow">Knowledge OS · Profile Hub</div>
          <h1 className="page-title">Personal Center</h1>
          <p className="page-subtitle">Configure credentials, track visual productivity, and unlock aesthetic store custom designs!</p>
        </div>

        {/* Dynamic Balance */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,140,0,0.1))',
          border: '1px solid rgba(255,215,0,0.3)', padding: '10px 20px', borderRadius: 16,
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <span style={{ fontSize: 22 }}>🪙</span>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>WALLET</span>
            <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--yellow)', fontFamily: 'var(--font-mono)' }}>{coins} Coins</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, paddingBottom: 40 }}>
        
        {/* Left Column: Store & Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* PRODUCTIVITY ANALYSIS & HEATMAP */}
          <div className="card" style={{ padding: 24 }}>
            <div className="page-eyebrow" style={{ marginBottom: 14 }}>📈 Study Productivity Heatmap</div>
            
            {/* Heatmap matrix */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: 6 }}>
                {Array.from({ length: 42 }).map((_, i) => {
                  const level = (i % 3 === 0 && i % 2 === 0) ? 'high' : i % 3 === 0 ? 'med' : i % 5 === 0 ? 'low' : 'zero';
                  let bg = 'rgba(255,255,255,0.02)';
                  if (level === 'high') bg = 'var(--cyan)';
                  if (level === 'med') bg = 'var(--cyan-dim)';
                  if (level === 'low') bg = 'var(--purple-dim)';
                  return (
                    <div 
                      key={i} 
                      title={`Activity Level: ${level}`}
                      style={{ 
                        aspectRatio: '1', borderRadius: 4, background: bg, border: '1px solid var(--border)',
                        boxShadow: level === 'high' ? '0 0 6px var(--cyan)' : 'none'
                      }} 
                    />
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)' }}>
                <span>Less</span>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }} />
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--purple-dim)' }} />
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--cyan-dim)' }} />
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--cyan)' }} />
                </div>
                <span>More</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
              <div style={{ padding: 14, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>DAILY STREAK</span>
                <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--cyan)' }}>7 Days 🔥</div>
              </div>
              <div style={{ padding: 14, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>CONCEPTS REVISED</span>
                <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--purple)' }}>142 Modules 🚀</div>
              </div>
            </div>
          </div>

          {/* THE SHOP */}
          <div className="card" style={{ padding: 24 }}>
            <div className="page-eyebrow" style={{ marginBottom: 14 }}>🛍️ Theme & Badge Store</div>
            
            {/* Purchase Badges */}
            <h3 style={{ fontSize: 13, color: 'var(--cyan)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>1. Exclusive Badges</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {BADGES.map(b => {
                const unlocked = unlockedBadges.includes(b.id);
                return (
                  <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                    <div>
                      <strong style={{ fontSize: 13, color: 'var(--text-bright)' }}>{b.label}</strong>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.desc}</div>
                    </div>
                    {unlocked ? (
                      <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 'bold' }}>UNLOCKED</span>
                    ) : (
                      <button className="btn btn-cyan" onClick={() => buyBadge(b)} style={{ fontSize: 11, padding: '4px 10px' }}>
                        Buy {b.cost} 🪙
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Purchase Themes */}
            <h3 style={{ fontSize: 13, color: 'var(--purple)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>2. Workspace Themes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {THEMES.map(t => {
                const unlocked = unlockedThemes.includes(t.id);
                const active = activeTheme === t.id;
                return (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                    <div>
                      <strong style={{ fontSize: 13, color: 'var(--text-bright)' }}>{t.label}</strong>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.desc}</div>
                    </div>
                    {unlocked ? (
                      <button 
                        className={`btn ${active ? 'btn-purple' : 'btn-ghost'}`} 
                        onClick={() => selectTheme(t.id)}
                        style={{ fontSize: 11, padding: '4px 10px' }}
                      >
                        {active ? 'ACTIVE' : 'SELECT'}
                      </button>
                    ) : (
                      <button className="btn btn-cyan" onClick={() => buyTheme(t)} style={{ fontSize: 11, padding: '4px 10px' }}>
                        Buy {t.cost} 🪙
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* Right Column: Settings & Credentials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Avatar & Badges display */}
          <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 24, gap: 16 }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%', background: 'var(--surface)', border: '2px solid var(--cyan)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer',
              boxShadow: '0 0 20px rgba(0, 229, 255, 0.2)'
            }} onClick={() => fileRef.current.click()}>
              {user.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 32 }}>👤</span>}
            </div>
            
            <div>
              <h2 style={{ fontSize: 20, color: 'var(--text-bright)', textTransform: 'capitalize', fontWeight: 'bold' }}>{user.username}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 4 }}>Click avatar to upload new image.</p>
              <input type="file" ref={fileRef} style={{ display: 'none' }} accept="image/*" onChange={handleAvatarUpload} />
            </div>

            {/* Badges container */}
            {unlockedBadges.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, width: '100%' }}>
                <span style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>EARNED TITLES</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                  {unlockedBadges.map(bId => {
                    const match = BADGES.find(b => b.id === bId);
                    return match ? (
                      <span key={bId} className="badge badge-purple" style={{ fontSize: 10, padding: '4px 8px' }}>
                        {match.label.split(' ')[0]} {match.label.split(' ').slice(1).join(' ')}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Password Reset */}
          <div className="card">
            <h3 style={{ fontSize: 14, color: 'var(--text-bright)', marginBottom: 12, letterSpacing: 1, textTransform: 'uppercase' }}>Change Password</h3>
            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input className="input" type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              <button className="btn btn-cyan" type="submit" style={{ width: '100%' }}>Update Password</button>
            </form>
            {msg && <div style={{ color: 'var(--cyan)', fontSize: 12, marginTop: 10, textAlign: 'center' }}>{msg}</div>}
          </div>

        </div>

      </div>
    </div>
  );
}
