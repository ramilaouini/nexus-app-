import { useState } from 'react';

// Simulated heatmap blocks for the last 30 days
const HEATMAP_CELLS = [
  4, 2, 0, 1, 3, 5, 0,
  2, 4, 1, 0, 2, 4, 3,
  0, 1, 5, 2, 0, 3, 1,
  4, 2, 0, 1, 3, 5, 2,
  1, 4
];

const WEEKLY_HOURS = [
  { day: 'Mon', hours: 4.5 },
  { day: 'Tue', hours: 6.0 },
  { day: 'Wed', hours: 3.5 },
  { day: 'Thu', hours: 5.0 },
  { day: 'Fri', hours: 8.0 },
  { day: 'Sat', hours: 2.0 },
  { day: 'Sun', hours: 1.5 }
];

export default function StatsView() {
  const [selectedDay, setSelectedDay] = useState(null);

  const getHeatmapColor = (val) => {
    if (val === 0) return 'rgba(255,255,255,0.02)';
    if (val === 1) return 'rgba(0, 229, 255, 0.2)';
    if (val === 2) return 'rgba(0, 229, 255, 0.4)';
    if (val === 3) return 'rgba(0, 229, 255, 0.6)';
    if (val === 4) return 'rgba(0, 229, 255, 0.8)';
    return 'var(--cyan)';
  };

  return (
    <div className="view" style={{ overflowY: 'auto' }}>
      
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div className="page-eyebrow">Knowledge OS · Performance Charts</div>
        <h1 className="page-title">📊 GitHub Study Heatmap & Analytics</h1>
        <p className="page-subtitle">Track your focus duration levels, study frequencies, and active subject statistics in real-time.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, paddingBottom: 40 }}>
        
        {/* Left Column: Heatmap & Subject Pie */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* GitHub Heatmap Card */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1 }}>📅 30-DAY FOCUS CONTRIBUTION HEATMAP</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>GitHub Layout Style</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {HEATMAP_CELLS.map((val, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedDay({ day: idx + 1, val })}
                  style={{ 
                    width: 28, height: 28, borderRadius: 4, cursor: 'pointer',
                    background: getHeatmapColor(val),
                    border: '1px solid var(--border)',
                    boxShadow: val > 3 ? '0 0 8px var(--cyan)44' : 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--cyan)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                />
              ))}
            </div>

            {selectedDay ? (
              <div className="animate-fade-in" style={{ marginTop: 16, fontSize: 12, padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: '#fff' }}>
                🗓️ **Day {selectedDay.day} Status**: Focused for **{selectedDay.val * 2} hours** & solved **{selectedDay.val * 3} tasks**!
              </div>
            ) : (
              <div style={{ marginTop: 16, fontSize: 11, color: 'var(--text-muted)' }}>Hover or click any contribution box block to display telemetry.</div>
            )}
          </div>

          {/* SVG Pie Chart / Subject distributions */}
          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--purple)', letterSpacing: 1 }}>🍩 SUBJECT STUDY DISTRIBUTION</span>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 40, justifyContent: 'center' }}>
              <svg width="150" height="150" viewBox="0 0 42 42">
                <circle cx="21" cy="21" r="15.915" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="4" />
                
                {/* Segment 1: C++ (40%) */}
                <circle 
                  cx="21" cy="21" r="15.915" fill="none" 
                  stroke="var(--cyan)" strokeWidth="4.5" 
                  strokeDasharray="40 60"
                  strokeDashoffset="25"
                />
                
                {/* Segment 2: Algorithms (30%) */}
                <circle 
                  cx="21" cy="21" r="15.915" fill="none" 
                  stroke="var(--purple)" strokeWidth="4.5" 
                  strokeDasharray="30 70"
                  strokeDashoffset="85"
                />

                {/* Segment 3: Databases (20%) */}
                <circle 
                  cx="21" cy="21" r="15.915" fill="none" 
                  stroke="var(--green)" strokeWidth="4.5" 
                  strokeDasharray="20 80"
                  strokeDashoffset="55"
                />
              </svg>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--cyan)' }} />
                  <span style={{ color: 'var(--text-bright)' }}>C++ systems (40%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--purple)' }} />
                  <span style={{ color: 'var(--text-bright)' }}>Algorithms lab (30%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--green)' }} />
                  <span style={{ color: 'var(--text-bright)' }}>SQL database (20%)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Weekly Bar Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1 }}>📊 WEEKLY STUDY HOURS</span>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 180, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
              {WEEKLY_HOURS.map(wh => {
                const heightPercentage = (wh.hours / 8) * 100;
                return (
                  <div key={wh.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 32 }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{wh.hours}h</div>
                    
                    <div style={{ 
                      width: 14, height: `${heightPercentage}%`, minHeight: 4,
                      background: wh.hours >= 6 ? 'var(--cyan)' : 'var(--purple)',
                      borderRadius: '4px 4px 0 0',
                      boxShadow: wh.hours >= 6 ? '0 0 10px var(--cyan)44' : 'none',
                      transition: 'height 0.6s'
                    }} />
                    
                    <span style={{ fontSize: 10, color: 'var(--text-bright)', fontWeight: 'bold' }}>{wh.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
