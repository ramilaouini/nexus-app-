import { useEffect, useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../api';

function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) { setVal(0); return; }
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return val;
}

const COLORS = ['#00e5ff', '#a855f7', '#ff7043', '#00e676', '#ffd740', '#40c4ff'];

export default function Dashboard({ onNav }) {
  const [stats, setStats] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);

  const subjects_n  = useCountUp(stats?.totalSubjects);
  const cards_n     = useCountUp(stats?.totalCards);
  const minutes_n   = useCountUp(stats?.totalMinutes);
  const reviewed_n  = useCountUp(stats?.cardsReviewed);

  useEffect(() => {
    api.stats().then(setStats).catch(console.error);
    api.subjects.list().then(setSubjects).catch(console.error);
    api.sessions.list().then(setSessions).catch(console.error);
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const chartData = stats?.activity?.map(d => ({
    day: d.day.slice(5),
    sessions: d.sessions,
    minutes: d.minutes,
  })) || [];

  return (
    <div className="view">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="page-eyebrow">Knowledge OS · Dashboard</p>
          <h1 className="page-title">{greeting()}, Scholar</h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}
          </p>
        </div>
        {stats?.streak > 0 && (
          <div style={{
            display:'flex', alignItems:'center', gap:10,
            background:'rgba(255,112,67,0.08)', border:'1px solid rgba(255,112,67,0.25)',
            borderRadius:14, padding:'12px 20px'
          }}>
            <span style={{ fontSize:26 }}>🔥</span>
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:900, color:'var(--orange)', textShadow:'0 0 20px rgba(255,112,67,0.4)', lineHeight:1 }}>
                {stats.streak}
              </div>
              <div style={{ fontSize:9, letterSpacing:2, color:'var(--text-muted)', textTransform:'uppercase', marginTop:2 }}>Day Streak</div>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { label:'Subjects',  val: subjects_n,  icon:'◈', ac:'var(--cyan)'   },
          { label:'Flashcards',val: cards_n,      icon:'⟡', ac:'var(--purple)' },
          { label:'Min Studied',val:minutes_n,    icon:'◎', ac:'var(--orange)' },
          { label:'Reviewed',  val: reviewed_n,   icon:'✓', ac:'var(--green)'  },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ '--ac': s.ac }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-number">{s.val.toLocaleString()}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid-2" style={{ gridTemplateColumns:'1fr 1fr', alignItems:'start' }}>

        {/* Activity Chart */}
        <div className="card mb-4">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
            <div>
              <div className="page-eyebrow" style={{ marginBottom:3 }}>Last 7 Days</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:13, color:'var(--text-bright)', letterSpacing:0.5 }}>Study Activity</div>
            </div>
            <div className="badge badge-cyan">{stats?.todaySessions || 0} today</div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={chartData} margin={{ top:5, right:5, bottom:0, left:-20 }}>
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00e5ff" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill:'#385a7a', fontSize:10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'#385a7a', fontSize:10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background:'#0e1d32', border:'1px solid rgba(0,229,255,0.2)', borderRadius:10, fontSize:12, color:'#b8cfe0' }}
                  cursor={{ stroke:'rgba(0,229,255,0.15)' }}
                />
                <Area type="monotone" dataKey="minutes" stroke="#00e5ff" strokeWidth={2} fill="url(#cyanGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height:140, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)', fontSize:13 }}>
              No sessions yet — start a Focus Timer!
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        <div className="card mb-4">
          <div className="page-eyebrow" style={{ marginBottom:3 }}>Recent</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:13, color:'var(--text-bright)', letterSpacing:0.5, marginBottom:16 }}>Sessions</div>
          <div className="activity-list">
            {sessions.slice(0, 6).length > 0 ? sessions.slice(0, 6).map(s => (
              <div key={s.id} className="activity-item">
                <div className="activity-dot" style={{ background: s.subject_color || 'var(--cyan)' }} />
                <div className="activity-text">
                  {s.subject_name || 'General'} · <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-muted)' }}>{s.duration}min</span>
                </div>
                <div className="activity-time">{new Date(s.completed_at).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
              </div>
            )) : (
              <p style={{ color:'var(--text-muted)', fontSize:13, padding:'8px 0' }}>No sessions yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Subject Progress Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="page-eyebrow" style={{ marginBottom:3 }}>Overview</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:13, color:'var(--text-bright)', letterSpacing:0.5 }}>Subject Progress</div>
          </div>
          <button className="btn btn-ghost" onClick={() => onNav('subjects')} style={{ fontSize:11 }}>View All →</button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {subjects.slice(0, 5).map((s, i) => {
            const pct = s.card_count > 0 ? Math.round((s.accuracy || 0)) : 0;
            return (
              <div key={s.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize:16 }}>{s.icon}</span>
                    <span style={{ fontSize:13, color:'var(--text-bright)', fontFamily:'var(--font-display)', letterSpacing:0.3 }}>{s.name}</span>
                    <span className="badge badge-cyan" style={{ fontSize:9 }}>{s.card_count} cards</span>
                  </div>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color: COLORS[i % COLORS.length] }}>{pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width:`${pct}%`, '--sc': COLORS[i % COLORS.length] }} />
                </div>
              </div>
            );
          })}
          {subjects.length === 0 && (
            <p style={{ color:'var(--text-muted)', fontSize:13 }}>Add subjects to track your progress.</p>
          )}
        </div>
      </div>
    </div>
  );
}
