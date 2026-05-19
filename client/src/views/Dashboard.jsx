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

const CITIES = [
  { name: 'Tunisia (Tunis)', lat: 36.8065, lon: 10.1815, flag: '🇹🇳' },
  { name: 'France (Paris)', lat: 48.8566, lon: 2.3522, flag: '🇫🇷' },
  { name: 'Japan (Tokyo)', lat: 35.6762, lon: 139.6503, flag: '🇯🇵' },
  { name: 'USA (New York)', lat: 40.7128, lon: -74.0060, flag: '🇺🇸' },
  { name: 'UK (London)', lat: 51.5074, lon: -0.1278, flag: '🇬🇧' }
];

const t = {
  en: {
    hub: "HUB",
    dashboard: "Dashboard",
    scholar: "Scholar",
    activity: "Study Activity",
    mastery: "Subject Mastery",
    sessions: "Recent Study Sessions",
    lofi: "Lofi Radio",
    streak: "Day Streak",
    subjects: "Subjects",
    flashcards: "Flashcards",
    minutes: "Min Studied",
    reviewed: "Reviewed",
    aiInsight: "AI Co-Pilot Insight",
    history: "History",
    today: "today",
    viewAll: "View All",
    weather: "Live Weather",
    time: "Local Time",
    morning: "Good Morning",
    afternoon: "Good Afternoon",
    evening: "Good Evening",
    noSessions: "No sessions yet — start a Focus Timer!",
    noSubjects: "No subjects yet."
  },
  fr: {
    hub: "PANEL",
    dashboard: "Tableau de bord",
    scholar: "Étudiant",
    activity: "Activité d'Étude",
    mastery: "Maîtrise des Sujets",
    sessions: "Sessions d'Étude Récentes",
    lofi: "Radio Lofi",
    streak: "Jours de Suite",
    subjects: "Sujets",
    flashcards: "Cartes",
    minutes: "Min Étudiées",
    reviewed: "Révisé",
    aiInsight: "Aperçu de l'AI Co-Pilote",
    history: "Historique",
    today: "aujourd'hui",
    viewAll: "Voir Tout",
    weather: "Météo en Direct",
    time: "Heure Locale",
    morning: "Bon matin",
    afternoon: "Bon après-midi",
    evening: "Bonsoir",
    noSessions: "Aucune session pour l'instant — lancez un minuteur !",
    noSubjects: "Aucun sujet."
  }
};

export default function Dashboard({ onNav, lang = 'en' }) {
  const [stats, setStats] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [aiInsight, setAiInsight] = useState('');
  
  // Real-time Date and Time
  const [time, setTime] = useState(new Date());

  // Weather States
  const [selectedCityIdx, setSelectedCityIdx] = useState(0);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

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

  // Update Clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Weather when City changes
  useEffect(() => {
    const fetchWeather = async () => {
      setLoadingWeather(true);
      try {
        const city = CITIES[selectedCityIdx];
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`);
        const data = await res.json();
        setWeather(data.current_weather);
      } catch (err) {
        console.error("Error fetching weather: ", err);
      }
      setLoadingWeather(false);
    };
    fetchWeather();
  }, [selectedCityIdx]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return t[lang].morning;
    if (h < 17) return t[lang].afternoon;
    return t[lang].evening;
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

  // Weather codes mapping to premium scenes
  const getWeatherScene = (code) => {
    if (code === undefined || code === null) return { icon: '🌤️', type: 'sunny' };
    if ([0].includes(code)) return { icon: '☀️', type: 'sunny' };
    if ([1, 2, 3].includes(code)) return { icon: '⛅', type: 'cloudy' };
    if ([45, 48].includes(code)) return { icon: '🌫️', type: 'foggy' };
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { icon: '🌧️', type: 'rainy' };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: '❄️', type: 'snowy' };
    if ([95, 96, 99].includes(code)) return { icon: '⛈️', type: 'stormy' };
    return { icon: '🌤️', type: 'sunny' };
  };

  const scene = getWeatherScene(weather?.weathercode);

  return (
    <div className="view" style={{ overflowY: 'auto', paddingBottom: 60, paddingRight: 10 }}>
      {/* Styles for Weather Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatCloud {
          0% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(-10px); }
        }
        @keyframes fallRain {
          0% { transform: translateY(-20px); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(40px); opacity: 0; }
        }
        @keyframes rotateSun {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-cloud {
          animation: floatCloud 4s ease-in-out infinite;
        }
        .animate-rain {
          animation: fallRain 1s linear infinite;
        }
        .animate-sun {
          animation: rotateSun 12s linear infinite;
        }
      `}} />

      {/* Banner */}
      <div style={{
        width: '100%', height: 220, borderRadius: 24, marginBottom: 30,
        backgroundImage: 'url(/ai_learning_banner.png)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg), transparent)' }} />
        <div style={{ position: 'absolute', bottom: 30, left: 30, right: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ color: 'var(--cyan)', fontSize: 14, fontWeight: 'bold', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8, opacity: 0.8 }}>Knowledge OS</p>
            <h1 style={{ fontSize: 42, fontWeight: 800, color: 'var(--text-bright)', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>{greeting()}, {t[lang].scholar}</h1>
          </div>
          {stats?.streak > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,0,0,0.6)', padding: '12px 24px', borderRadius: 20, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,112,67,0.3)' }}>
              <span style={{ fontSize: 28 }}>🔥</span>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--orange)', lineHeight: 1 }}>{stats.streak} <span style={{ fontSize: 12, color: '#aaa', fontWeight: 'normal', letterSpacing: 1, textTransform: 'uppercase' }}>{t[lang].streak}</span></div>
            </div>
          )}
        </div>
      </div>

      {/* LIVE DATA SECTION (Weather, Time, Translation indicators) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 30 }}>
        {/* Dynamic Real-time Date and Time */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 30px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, fontSize: 100, opacity: 0.05 }}>🕒</div>
          <div style={{ fontSize: 12, color: 'var(--cyan)', fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>{t[lang].time}</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--text-bright)', fontFamily: 'var(--font-mono)' }}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
            {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Real-time Weather in Tunisia / Other Countries */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 30px', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ zIndex: 2 }}>
            <div style={{ fontSize: 12, color: 'var(--cyan)', fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>{t[lang].weather}</div>
            
            {/* City Selector */}
            <select 
              value={selectedCityIdx} 
              onChange={e => setSelectedCityIdx(Number(e.target.value))} 
              className="input" 
              style={{ width: 180, padding: '4px 8px', fontSize: 13, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-bright)', marginBottom: 12 }}
            >
              {CITIES.map((c, i) => (
                <option key={c.name} value={i}>{c.flag} {c.name}</option>
              ))}
            </select>

            {loadingWeather ? (
              <div style={{ fontSize: 16, color: 'var(--text-muted)' }}>Updating metrics...</div>
            ) : (
              <div>
                <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-bright)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  {weather ? `${weather.temperature}°C` : '—'}
                  <span style={{ fontSize: 24 }}>{scene.icon}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Windspeed: {weather ? `${weather.windspeed} km/h` : '—'}
                </div>
              </div>
            )}
          </div>

          {/* Animated Weather Visual Section */}
          <div style={{ width: 100, height: 100, position: 'relative', overflow: 'hidden', borderRadius: 16, background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            
            {/* SUNNY VISUAL */}
            {scene.type === 'sunny' && (
              <div className="animate-sun" style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, #ffd700, #ff8c00)', boxShadow: '0 0 20px #ffd700' }} />
            )}

            {/* CLOUDY / STORMY VISUAL */}
            {(scene.type === 'cloudy' || scene.type === 'stormy' || scene.type === 'rainy') && (
              <div className="animate-cloud" style={{ position: 'relative', width: 60, height: 30, background: 'rgba(255,255,255,0.2)', borderRadius: 20, backdropFilter: 'blur(4px)' }}>
                <div style={{ position: 'absolute', top: -15, left: 10, width: 30, height: 30, background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', top: -10, left: 30, width: 20, height: 20, background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }} />
              </div>
            )}

            {/* RAIN DROPS */}
            {(scene.type === 'rainy' || scene.type === 'stormy') && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div className="animate-rain" style={{ position: 'absolute', left: '20%', width: 2, height: 15, background: 'var(--cyan)', opacity: 0.6 }} />
                <div className="animate-rain" style={{ position: 'absolute', left: '50%', width: 2, height: 12, background: 'var(--cyan)', opacity: 0.6, animationDelay: '0.3s' }} />
                <div className="animate-rain" style={{ position: 'absolute', left: '80%', width: 2, height: 18, background: 'var(--cyan)', opacity: 0.6, animationDelay: '0.6s' }} />
              </div>
            )}

            {/* SNOW */}
            {scene.type === 'snowy' && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div className="animate-rain" style={{ position: 'absolute', left: '25%', width: 4, height: 4, borderRadius: '50%', background: '#fff', opacity: 0.8 }} />
                <div className="animate-rain" style={{ position: 'absolute', left: '55%', width: 4, height: 4, borderRadius: '50%', background: '#fff', opacity: 0.8, animationDelay: '0.4s' }} />
                <div className="animate-rain" style={{ position: 'absolute', left: '75%', width: 4, height: 4, borderRadius: '50%', background: '#fff', opacity: 0.8, animationDelay: '0.8s' }} />
              </div>
            )}

          </div>

        </div>
      </div>

      {/* AI Insight */}
      <div className="card mb-8" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(0,229,255,0.1))', border: '1px solid var(--border-hi)', display: 'flex', alignItems: 'center', gap: 24, padding: '24px 30px', borderRadius: 20 }}>
        <div style={{ fontSize: 48, filter: 'drop-shadow(0 0 10px var(--cyan))' }}>🤖</div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--cyan)', fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>{t[lang].aiInsight}</div>
          <div style={{ fontSize: 18, color: 'var(--text-bright)', fontStyle: 'italic', lineHeight: 1.5 }}>"{aiInsight || 'Analyzing cognitive patterns and calculating optimal learning paths...'}"</div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row mb-8">
        {[
          { label: t[lang].subjects,    val: subjects_n,  icon: '◈', ac: 'var(--cyan)'   },
          { label: t[lang].flashcards,  val: cards_n,     icon: '⟡', ac: 'var(--purple)' },
          { label: t[lang].minutes,     val: minutes_n,   icon: '◎', ac: 'var(--orange)' },
          { label: t[lang].reviewed,    val: reviewed_n,  icon: '✓', ac: 'var(--green)'  },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ '--ac': s.ac, padding: '24px' }}>
            <div className="stat-icon" style={{ fontSize: 28 }}>{s.icon}</div>
            <div className="stat-number" style={{ fontSize: 36, marginTop: 8 }}>{s.val.toLocaleString()}</div>
            <div className="stat-label" style={{ fontSize: 14 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'start', gap: 24 }}>

        {/* Activity Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <div className="page-eyebrow" style={{ marginBottom: 4 }}>Last 7 Days</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-bright)', letterSpacing: 0.5 }}>{t[lang].activity}</div>
            </div>
            <div className="badge badge-cyan" style={{ fontSize: 12, padding: '6px 12px' }}>{stats?.todaySessions || 0} {t[lang].today}</div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--cyan)" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="var(--cyan)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text-bright)', padding: '12px' }} />
                <Area type="monotone" dataKey="minutes" stroke="var(--cyan)" strokeWidth={4} fill="url(#cyanGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              {t[lang].noSessions}
            </div>
          )}
        </div>

        {/* Mastery Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <div className="page-eyebrow" style={{ marginBottom: 4 }}>Analytics</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-bright)', letterSpacing: 0.5 }}>{t[lang].mastery}</div>
            </div>
            <button className="btn btn-ghost" onClick={() => onNav('subjects')} style={{ fontSize: 12 }}>{t[lang].viewAll} →</button>
          </div>
          {subjectData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={subjectData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text-bright)', padding: '12px' }} />
                <Bar dataKey="accuracy" radius={[8, 8, 0, 0]} maxBarSize={50}>
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              {t[lang].noSubjects}
            </div>
          )}
        </div>

        {/* Recent Sessions List */}
        <div className="card" style={{ gridColumn: '1 / -1', padding: '24px' }}>
          <div className="page-eyebrow" style={{ marginBottom: 4 }}>{t[lang].history}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-bright)', letterSpacing: 0.5, marginBottom: 20 }}>{t[lang].sessions}</div>
          <div className="activity-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {sessions.slice(0, 6).length > 0 ? sessions.slice(0, 6).map(s => (
              <div key={s.id} className="activity-item" style={{ background: 'var(--surface)', padding: '20px', borderRadius: 16, display: 'flex', alignItems: 'center', border: '1px solid var(--border)' }}>
                <div className="activity-dot" style={{ background: s.subject_color || 'var(--cyan)', width: 12, height: 12, marginRight: 16 }} />
                <div className="activity-text" style={{ flex: 1, fontSize: 16, color: 'var(--text-bright)', fontWeight: 600 }}>
                  {s.subject_name || 'General Focus'} 
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--cyan)', marginTop: 6, fontWeight: 'normal' }}>{s.duration} minutes studied</div>
                </div>
                <div className="activity-time" style={{ opacity: 0.5, fontSize: 12 }}>{new Date(s.completed_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' })}</div>
              </div>
            )) : (
              <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: '8px 0' }}>{t[lang].noSessions}</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
