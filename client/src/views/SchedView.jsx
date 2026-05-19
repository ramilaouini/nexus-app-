import { useState, useEffect } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = ['08:00', '10:00', '12:00', '14:00', '16:00'];

const INITIAL_SCHEDULE = {
  'Monday-08:00': 'C++ Systems Lecture',
  'Monday-10:00': 'Algorithms Lab',
  'Tuesday-14:00': 'SQL Database Seminar',
  'Wednesday-08:00': 'Matrix Algebra Class',
  'Thursday-10:00': 'Computer Networks Lecture',
  'Friday-16:00': 'Pomodoro Focus Study'
};

const COLOR_MAPS = {
  'C++ Systems Lecture': 'var(--cyan)',
  'Algorithms Lab': 'var(--purple)',
  'SQL Database Seminar': 'var(--green)',
  'Matrix Algebra Class': 'var(--orange)',
  'Computer Networks Lecture': '#3b82f6',
  'Pomodoro Focus Study': '#ec4899',
  'Free Block': 'rgba(255,255,255,0.03)'
};

export default function SchedView() {
  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem('nexus_weekly_schedule');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [activeCell, setActiveCell] = useState(null); // 'Day-Time'
  const [blockText, setBlockText] = useState('');
  const [currentHour, setCurrentHour] = useState('');
  const [currentDay, setCurrentDay] = useState('');

  useEffect(() => {
    localStorage.setItem('nexus_weekly_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0') + ':00';
    const dayStr = DAYS[now.getDay() - 1] || 'Sunday';
    setCurrentHour(hrs);
    setCurrentDay(dayStr);
  }, []);

  const openEdit = (day, slot) => {
    const key = `${day}-${slot}`;
    setActiveCell(key);
    setBlockText(schedule[key] || '');
  };

  const saveCell = (e) => {
    e.preventDefault();
    if (!activeCell) return;
    const next = { ...schedule };
    if (!blockText.trim()) {
      delete next[activeCell];
    } else {
      next[activeCell] = blockText;
    }
    setSchedule(next);
    setActiveCell(null);
  };

  const checkInBonus = () => {
    const coins = Number(localStorage.getItem('nexus_coins') || '100');
    localStorage.setItem('nexus_coins', (coins + 20).toString());
    alert("🎉 Timetable Attendance Check-In! +20 ByteCoins earned!");
  };

  // Find active slot based on local time
  let activeSlot = null;
  const matchSlot = TIME_SLOTS.find(slot => {
    const sHr = Number(slot.split(':')[0]);
    const nowHr = new Date().getHours();
    return nowHr >= sHr && nowHr < sHr + 2;
  });
  if (matchSlot) {
    const activeKey = `${currentDay}-${matchSlot}`;
    activeSlot = schedule[activeKey] || null;
  }

  return (
    <div className="view" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      
      <div className="page-header" style={{ flexShrink: 0, marginBottom: 20 }}>
        <div className="page-eyebrow">Knowledge OS · Class Timetable</div>
        <h1 className="page-title">⏰ Time-Blocking Schedule Planner</h1>
        <p className="page-subtitle">Double click or click any grid cell to time-block your class schedules and focus modules!</p>
      </div>

      {/* Dynamic study radar banner */}
      <div className="card" style={{ padding: 20, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(168,85,247,0.06), rgba(0,229,255,0.06))', border: '1px solid var(--border-hi)' }}>
        <div>
          <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1 }}>📌 DYNAMIC STUDY RADAR</span>
          <h2 style={{ fontSize: 18, color: '#fff', fontWeight: 800, marginTop: 4 }}>
            {activeSlot ? `Currently Blocked: ${activeSlot} ⚡` : 'Currently: Free Time Slot 💤'}
          </h2>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Local time: {currentDay} at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        
        {activeSlot && (
          <button className="btn btn-purple" onClick={checkInBonus}>🚀 Check-In Focus Session (+20🪙)</button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, flex: 1, minHeight: 0, paddingBottom: 40 }}>
        
        {/* Weekly Grid */}
        <div className="card animate-fade-in" style={{ padding: 24, overflowX: 'auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(7, 1fr)', gap: 10, minWidth: 800 }}>
            {/* Header row */}
            <div style={{ padding: 8 }}></div>
            {DAYS.map(day => {
              const isToday = day === currentDay;
              return (
                <div key={day} style={{ 
                  textAlign: 'center', padding: '10px 0', borderBottom: isToday ? '2px solid var(--cyan)' : '2px solid var(--border)',
                  color: isToday ? 'var(--cyan)' : 'var(--text-bright)', fontWeight: isToday ? 'bold' : 'normal', fontSize: 13 
                }}>
                  {day.slice(0, 3)}
                  {isToday && <span style={{ fontSize: 9, display: 'block', color: 'var(--cyan)' }}>(Today)</span>}
                </div>
              );
            })}

            {/* Time Slot rows */}
            {TIME_SLOTS.map(slot => (
              <>
                {/* Row Time Badge */}
                <div style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)',
                  border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, fontWeight: 'bold', fontFamily: 'var(--font-mono)'
                }}>
                  {slot}
                </div>

                {/* Days column blocks */}
                {DAYS.map(day => {
                  const key = `${day}-${slot}`;
                  const val = schedule[key];
                  const col = COLOR_MAPS[val] || 'var(--cyan)';

                  return (
                    <div 
                      key={day} 
                      onClick={() => openEdit(day, slot)}
                      style={{ 
                        height: 64, borderRadius: 10, cursor: 'pointer', padding: 8,
                        background: val ? `${col}22` : 'rgba(255,255,255,0.01)',
                        border: val ? `1px solid ${col}` : '1px solid var(--border)',
                        transition: 'all 0.2s', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center'
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--cyan)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = val ? col : 'var(--border)'}
                    >
                      {val ? (
                        <div style={{ fontSize: 11, fontWeight: 'bold', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {val}
                        </div>
                      ) : (
                        <span style={{ fontSize: 9, color: 'var(--text-muted)', opacity: 0 }}>+ Block</span>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>

        </div>

      </div>

      {/* Editor Modal Popup */}
      {activeCell && (
        <div className="modal-overlay" onClick={() => setActiveCell(null)}>
          <form onSubmit={saveCell} className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <span className="modal-title">EDIT BLOCK SCHEDULE</span>
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => setActiveCell(null)}>✕</button>
            </div>
            
            <div className="modal-form" style={{ padding: '16px 0' }}>
              <div className="input-label">Enter Schedule Lecture or Task Title</div>
              <input className="input" autoFocus value={blockText} onChange={e => setBlockText(e.target.value)} placeholder="e.g. C++ Systems Lecture..." />
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Tip: Clearing this block resets it to an empty slot.</p>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={() => setActiveCell(null)}>Cancel</button>
              <button type="submit" className="btn btn-cyan">Save block</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
