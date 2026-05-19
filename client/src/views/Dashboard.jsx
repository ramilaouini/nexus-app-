import { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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
  const [aiInsight, setAiInsight] = useState('');

  const subjects_n  = useCountUp(stats?.totalSubjects);
  const cards_n     = useCountUp(stats?.totalCards);
  const minutes_n   = useCountUp(stats?.totalMinutes);
  const reviewed_n  = useCountUp(stats?.cardsReviewed);

  useEffect(() => {
    api.stats().then(setStats).catch(console.error);
    api.subjects.list().then(setSubjects).catch(console.error);
    api.sessions.list().then(setSessions).catch(console.error);
    
    // Fetch AI Insight
    api.ai.chat([{ role: 'user', content: 'Give me one very short, highly motivating 1-sentence quote or insight about deep learning, knowledge, and brain power. Do not use quotes, just tell me directly.' }])
       .then(res => setAiInsight(res.response))
       .catch(() => setAiInsight("Knowledge is power. Keep pushing your limits."));
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

  const subjectData = subjects.map(s => ({
    name: s.name,
    accuracy: s.card_count > 0 ? Math.round(s.accuracy || 0) : 0,
    color: s.color
  }));

  return (
    <div className="view" style={{ overflowY: 'auto', paddingBottom: 60, paddingRight: 10 }}>
      {/* Banner */}
      <div style={{
        width: '100%', height: 220, borderRadius: 24, marginBottom: 30,
        backgroundImage: 'url(/ai_learning_banner.png)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #040b14, transparent)' }} />
        <div style={{ position: 'absolute', bottom: 30, left: 30, right: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ color: 'var(--cyan)', fontSize: 14, fontWeight: 'bold', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8, opacity: 0.8 }}>Knowledge OS</p>
            <h1 style={{ fontSize: 42, fontWeight: 800, color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>{greeting()}, Scholar</h1>
          </div>
          {stats?.streak > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,0,0,0.6)', padding: '12px 24px', borderRadius: 20, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,112,67,0.3)' }}>
              <span style={{ fontSize: 28 }}>🔥</span>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--orange)', lineHeight: 1 }}>{stats.streak} <span style={{ fontSize: 12, color: '#aaa', fontWeight: 'normal', letterSpacing: 1, textTransform: 'uppercase' }}>Day Streak</span></div>
            </div>
          )}
        </div>
      </div>

      {/* AI Insight */}
      <div className="card mb-8" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(0,229,255,0.1))', border: '1px solid rgba(0,229,255,0.3)', display: 'flex', alignItems: 'center', gap: 24, padding: '24px 30px', borderRadius: 20 }}>
        <div style={{ fontSize: 48, filter: 'drop-shadow(0 0 10px var(--cyan))' }}>🤖</div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--cyan)', fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>AI Co-Pilot Insight</div>
          <div style={{ fontSize: 18, color: 'var(--text-bright)', fontStyle: 'italic', lineHeight: 1.5 }}>"{aiInsight || 'Analyzing cognitive patterns and calculating optimal learning paths...'}"</div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row mb-8">
        {[
          { label:'Subjects',  val: subjects_n,  icon:'◈', ac:'var(--cyan)'   },
          { label:'Flashcards',val: cards_n,      icon:'⟡', ac:'var(--purple)' },
          { label:'Min Studied',val:minutes_n,    icon:'◎', ac:'var(--orange)' },
          { label:'Reviewed',  val: reviewed_n,   icon:'✓', ac:'var(--green)'  },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ '--ac': s.ac, padding: '24px' }}>
            <div className="stat-icon" style={{ fontSize: 28 }}>{s.icon}</div>
            <div className="stat-number" style={{ fontSize: 36, marginTop: 8 }}>{s.val.toLocaleString()}</div>
            <div className="stat-label" style={{ fontSize: 14 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid-2" style={{ gridTemplateColumns:'1fr 1fr', alignItems:'start', gap: 24 }}>

        {/* Activity Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
            <div>
              <div className="page-eyebrow" style={{ marginBottom:4 }}>Last 7 Days</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:16, color:'var(--text-bright)', letterSpacing:0.5 }}>Study Activity</div>
            </div>
            <div className="badge badge-cyan" style={{ fontSize: 12, padding: '6px 12px' }}>{stats?.todaySessions || 0} today</div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top:5, right:5, bottom:0, left:-20 }}>
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00e5ff" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill:'#385a7a', fontSize:12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill:'#385a7a', fontSize:12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background:'#0e1d32', border:'1px solid rgba(0,229,255,0.3)', borderRadius:12, color:'#fff', padding: '12px' }} />
                <Area type="monotone" dataKey="minutes" stroke="#00e5ff" strokeWidth={4} fill="url(#cyanGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height:220, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)' }}>
              No sessions yet — start a Focus Timer!
            </div>
          )}
        </div>

        {/* Mastery Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
            <div>
              <div className="page-eyebrow" style={{ marginBottom:4 }}>Analytics</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:16, color:'var(--text-bright)', letterSpacing:0.5 }}>Subject Mastery</div>
            </div>
            <button className="btn btn-ghost" onClick={() => onNav('subjects')} style={{ fontSize:12 }}>View All →</button>
          </div>
          {subjectData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={subjectData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill:'#385a7a', fontSize:12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill:'#385a7a', fontSize:12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background:'#0e1d32', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, color:'#fff', padding: '12px' }} />
                <Bar dataKey="accuracy" radius={[8, 8, 0, 0]} maxBarSize={50}>
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height:220, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)' }}>
              No subjects yet.
            </div>
          )}
        </div>

        {/* Recent Sessions List */}
        <div className="card" style={{ gridColumn: '1 / -1', padding: '24px' }}>
          <div className="page-eyebrow" style={{ marginBottom:4 }}>History</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:16, color:'var(--text-bright)', letterSpacing:0.5, marginBottom:20 }}>Recent Study Sessions</div>
          <div className="activity-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {sessions.slice(0, 6).length > 0 ? sessions.slice(0, 6).map(s => (
              <div key={s.id} className="activity-item" style={{ background: 'var(--surface)', padding: '20px', borderRadius: 16, display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div className="activity-dot" style={{ background: s.subject_color || 'var(--cyan)', width: 12, height: 12, marginRight: 16 }} />
                <div className="activity-text" style={{ flex: 1, fontSize: 16, color: 'var(--text-bright)', fontWeight: 600 }}>
                  {s.subject_name || 'General Focus'} 
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--cyan)', marginTop: 6, fontWeight: 'normal' }}>{s.duration} minutes studied</div>
                </div>
                <div className="activity-time" style={{ opacity: 0.5, fontSize: 12 }}>{new Date(s.completed_at).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
              </div>
            )) : (
              <p style={{ color:'var(--text-muted)', fontSize:14, padding:'8px 0' }}>No sessions yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
