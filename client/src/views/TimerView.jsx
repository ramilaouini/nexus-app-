import { useState, useEffect, useRef } from 'react';
import { api } from '../api';

const MODES = {
  focus: { label: 'FOCUS', duration: 25 * 60, color: 'var(--cyan)',   shadow: 'var(--cyan-glow)' },
  short: { label: 'SHORT BREAK', duration: 5 * 60,  color: 'var(--green)',  shadow: 'rgba(0,230,118,0.35)' },
  long:  { label: 'LONG BREAK',  duration: 15 * 60, color: 'var(--purple)', shadow: 'rgba(168,85,247,0.35)' },
};

const RADIUS = 105;
const CIRC   = 2 * Math.PI * RADIUS; // 659.7

export default function TimerView() {
  const [modeKey,   setModeKey]   = useState('focus');
  const [timeLeft,  setTimeLeft]  = useState(MODES.focus.duration);
  const [running,   setRunning]   = useState(false);
  const [sessions,  setSessions]  = useState(0);
  const [subject,   setSubject]   = useState('');
  const [subjects,  setSubjects]  = useState([]);
  const [history,   setHistory]   = useState([]);
  const [pulse,     setPulse]     = useState(false);
  const intervalRef = useRef(null);
  const audioRef    = useRef(null);

  useEffect(() => {
    api.subjects.list().then(setSubjects).catch(() => {});
    api.sessions.list().then(setHistory).catch(() => {});
  }, []);

  // Keyboard shortcut: Space = start/pause
  useEffect(() => {
    const onKey = (e) => { if (e.code === 'Space' && e.target === document.body) { e.preventDefault(); toggleTimer(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [running]);

  const mode = MODES[modeKey];

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            handleComplete();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, modeKey]);

  const handleComplete = async () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 2000);
    if (modeKey === 'focus') {
      setSessions(s => s + 1);
      const sid = subjects.find(s => s.name === subject)?.id;
      await api.sessions.create({ subject_id: sid || null, duration: 25, mode: 'focus' }).catch(() => {});
      const h = await api.sessions.list().catch(() => []);
      setHistory(h);
    }
  };

  const switchMode = (key) => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setModeKey(key);
    setTimeLeft(MODES[key].duration);
  };

  const toggleTimer = () => setRunning(r => !r);

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setTimeLeft(mode.duration);
  };

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const progress  = timeLeft / mode.duration;
  const dashOffset = CIRC * (1 - progress);

  const todayFocus = history.filter(s =>
    s.mode === 'focus' && new Date(s.completed_at).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="view">
      <div className="page-header">
        <div className="page-eyebrow">Knowledge OS · Focus</div>
        <h1 className="page-title">Focus Timer</h1>
        <p className="page-subtitle">Press Space to start · Pomodoro technique</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Left — Timer */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 32px' }}>

          {/* Mode tabs */}
          <div className="flex gap-2 mb-6">
            {Object.entries(MODES).map(([key, m]) => (
              <button key={key}
                className={`btn ${modeKey === key ? 'btn-cyan' : 'btn-ghost'}`}
                style={{ fontSize: 10, ...(modeKey === key ? { '--cyan': m.color, '--cyan-dim': m.color + '22' } : {}) }}
                onClick={() => switchMode(key)}>
                {m.label}
              </button>
            ))}
          </div>

          {/* SVG Ring */}
          <div className="timer-ring" style={{
            filter: pulse ? `drop-shadow(0 0 30px ${mode.shadow})` : 'none',
            transition: 'filter 0.6s'
          }}>
            <svg className="timer-svg" width="240" height="240" viewBox="0 0 240 240">
              {/* Outer decorative ring */}
              <circle cx="120" cy="120" r="116" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              {/* Tick marks */}
              {Array.from({ length: 60 }, (_, i) => {
                const a = (i / 60) * 2 * Math.PI;
                const r1 = i % 5 === 0 ? 108 : 111;
                return (
                  <line key={i}
                    x1={120 + r1 * Math.cos(a)} y1={120 + r1 * Math.sin(a)}
                    x2={120 + 114 * Math.cos(a)} y2={120 + 114 * Math.sin(a)}
                    stroke={i % 5 === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}
                    strokeWidth={i % 5 === 0 ? 1.5 : 0.8}
                  />
                );
              })}
              {/* Track */}
              <circle className="timer-track" cx="120" cy="120" r={RADIUS} />
              {/* Progress */}
              <circle
                className={`timer-prog ${modeKey === 'focus' ? 'focus' : 'break'}`}
                cx="120" cy="120" r={RADIUS}
                strokeDashoffset={dashOffset}
                style={{ stroke: mode.color, filter: `drop-shadow(0 0 10px ${mode.shadow})` }}
              />
              {/* Dot at progress end */}
              {progress > 0.01 && (
                <circle
                  cx={120 + RADIUS * Math.cos(-Math.PI / 2 + (1 - progress) * 2 * Math.PI)}
                  cy={120 + RADIUS * Math.sin(-Math.PI / 2 + (1 - progress) * 2 * Math.PI)}
                  r="5" fill={mode.color}
                  style={{ filter: `drop-shadow(0 0 8px ${mode.color})` }}
                />
              )}
            </svg>
            <div className="timer-center">
              <div className="timer-time" style={{ color: mode.color, textShadow: `0 0 30px ${mode.shadow}` }}>
                {fmt(timeLeft)}
              </div>
              <div className="timer-mode-label" style={{ color: mode.color }}>{mode.label}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6, letterSpacing: 1 }}>
                {Math.round(progress * 100)}% remaining
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 items-center mb-6">
            <button className="btn btn-ghost btn-icon" style={{ width: 40, height: 40 }} onClick={reset} title="Reset">↺</button>
            <button
              className="btn"
              style={{
                width: 130, height: 46, fontSize: 13, letterSpacing: 2,
                background: running ? 'rgba(255,69,58,0.12)' : `${mode.color}22`,
                color: running ? '#ff453a' : mode.color,
                borderColor: running ? 'rgba(255,69,58,0.3)' : mode.color,
                boxShadow: running ? '' : `0 0 20px ${mode.color}33`,
              }}
              onClick={toggleTimer}
            >
              {running ? '⏸ PAUSE' : '▶ START'}
            </button>
            <button className="btn btn-ghost btn-icon" style={{ width: 40, height: 40 }} onClick={() => switchMode(modeKey === 'focus' ? 'short' : 'focus')} title="Skip">⏭</button>
          </div>

          {/* Subject selector */}
          <div style={{ width: '100%', maxWidth: 280 }}>
            <div className="input-label" style={{ textAlign: 'center', marginBottom: 8 }}>Studying</div>
            <select className="input" value={subject} onChange={e => setSubject(e.target.value)}>
              <option value="">— Select subject —</option>
              {subjects.map(s => <option key={s.id} value={s.name}>{s.icon} {s.name}</option>)}
            </select>
          </div>
        </div>

        {/* Right — Stats & History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Session stats */}
          <div className="card">
            <div className="page-eyebrow" style={{ marginBottom: 14 }}>Today's Stats</div>
            {[
              { label: 'Sessions Completed', val: todayFocus,            icon: '◎', color: 'var(--cyan)'   },
              { label: 'This Session',       val: sessions,              icon: '⟡', color: 'var(--purple)' },
              { label: 'Minutes Focused',    val: `${todayFocus * 25}`,  icon: '⏱', color: 'var(--orange)' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 20, opacity: 0.7 }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase' }}>{s.label}</div>
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: s.color, textShadow: `0 0 16px ${s.color}55` }}>{s.val}</span>
              </div>
            ))}
          </div>

          {/* Technique guide */}
          <div className="card">
            <div className="page-eyebrow" style={{ marginBottom: 12 }}>Pomodoro Method</div>
            {[
              { step: '01', text: 'Pick a task to work on', color: 'var(--cyan)'   },
              { step: '02', text: '25 min deep focus session', color: 'var(--cyan)' },
              { step: '03', text: '5 min short break', color: 'var(--green)'       },
              { step: '04', text: 'Every 4 sessions → 15 min break', color: 'var(--purple)' },
            ].map(s => (
              <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: s.color, width: 20 }}>{s.step}</span>
                <span style={{ fontSize: 12, color: 'var(--text)' }}>{s.text}</span>
              </div>
            ))}
          </div>

          {/* Recent sessions */}
          <div className="card" style={{ flex: 1 }}>
            <div className="page-eyebrow" style={{ marginBottom: 12 }}>Recent Sessions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflowY: 'auto' }}>
              {history.slice(0, 8).length > 0 ? history.slice(0, 8).map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.subject_color || 'var(--cyan)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, flex: 1, color: 'var(--text)' }}>{s.subject_name || 'General'}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>{s.duration}m</span>
                </div>
              )) : <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No sessions yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
