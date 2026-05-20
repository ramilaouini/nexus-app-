import { useState } from 'react';

export default function LogView() {
  const [logs, setLogs] = useState([
    { id: 1, date: new Date().toLocaleDateString(), text: "Installed new multi-dimensional drives in the ship. Ready for the next study session." },
    { id: 2, date: new Date(Date.now() - 86400000).toLocaleDateString(), text: "Discovered an ancient ruin while reviewing Calculus. Found a rare badge." }
  ]);
  const [newLog, setNewLog] = useState('');

  const addLog = () => {
    if (!newLog.trim()) return;
    setLogs([{ id: Date.now(), date: new Date().toLocaleDateString(), text: newLog }, ...logs]);
    setNewLog('');
  };

  return (
    <div className="view-container" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--text-bright)', letterSpacing: '2px', fontFamily: 'monospace', textShadow: '0 0 15px rgba(255,255,255,0.2)' }}>CAPTAIN'S LOG</h1>
        <div style={{ height: '2px', width: '100px', background: 'var(--cyan)', margin: '20px auto', boxShadow: '0 0 10px var(--cyan)' }} />
      </header>

      <div className="card" style={{ padding: '20px', marginBottom: '30px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid var(--border)' }}>
        <textarea 
          value={newLog}
          onChange={e => setNewLog(e.target.value)}
          placeholder="Record your thoughts, discoveries, or progress..."
          style={{ width: '100%', height: '120px', background: 'transparent', border: 'none', color: 'var(--text-bright)', resize: 'none', fontSize: '1.1rem', outline: 'none' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button className="btn btn-primary" onClick={addLog} style={{ letterSpacing: '1px' }}>LOG ENTRY</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingRight: '10px' }}>
        {logs.map(log => (
          <div key={log.id} style={{ position: 'relative', paddingLeft: '30px', borderLeft: '2px solid var(--cyan)' }}>
            <div style={{ position: 'absolute', left: '-6px', top: '0', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 10px var(--cyan)' }} />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>Stardate: {log.date}</span>
            <p style={{ margin: '10px 0 0 0', fontSize: '1.2rem', color: 'var(--text-bright)', lineHeight: 1.6 }}>
              {log.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}