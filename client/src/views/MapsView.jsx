import { useState } from 'react';

const LOCATIONS = [
  {
    id: 'block_a',
    name: 'Block A (Administration & Amphitheatres)',
    icon: '🏛️',
    quietScore: 3,
    wifi: '50 Mbps',
    tip: 'Perfect for attending major algebra seminars or systems orientation. Quietest early morning.'
  },
  {
    id: 'block_b',
    name: 'Block B (Systems & Databases Labs)',
    icon: '💻',
    quietScore: 4,
    wifi: '120 Mbps',
    tip: 'Hosts state-of-the-art C++ compile workstations. Solid local fiber-optic speed!'
  },
  {
    id: 'block_c',
    name: 'Block C (Embedded Systems & AI Hub)',
    icon: '🤖',
    quietScore: 4.5,
    wifi: '150 Mbps',
    tip: 'Quiet study hubs loaded with microcontrollers and robotics algorithms modules. Highly recommended.'
  },
  {
    id: 'library',
    name: 'Block Library (Quiet Study Lounge)',
    icon: '📚',
    quietScore: 5,
    wifi: '80 Mbps',
    tip: 'The ultimate space for spaced repetition flashcard revisions and concentrated exam sessions.'
  },
  {
    id: 'open_space',
    name: 'The Open Space Hall (Hackathon Hub)',
    icon: '🚀',
    quietScore: 2,
    wifi: '200 Mbps',
    tip: 'Excellent collaborative desk spacing. Very lively, hosting weekly coding battles!'
  }
];

const QUESTS = [
  { id: 1, name: '🔍 C++ Lab Workspace Check-In', desc: 'Visit the Block B Systems lab and complete a brief structural review.', reward: 30, done: false },
  { id: 2, name: '📚 Spaced Repetition Session at Library', desc: 'Dedicate 15 minutes of quiet card memory learning inside the main Library lounge.', reward: 30, done: false }
];

export default function MapsView() {
  const [selectedLoc, setSelectedLoc] = useState(LOCATIONS[0]);
  const [quests, setQuests] = useState(() => {
    const saved = localStorage.getItem('nexus_campus_quests');
    return saved ? JSON.parse(saved) : QUESTS;
  });

  const claimQuest = (id) => {
    const next = quests.map(q => {
      if (q.id === id && !q.done) {
        const coins = Number(localStorage.getItem('nexus_coins') || '100');
        localStorage.setItem('nexus_coins', (coins + q.reward).toString());
        alert(`🎉 Campus Scavenger Quest Claimed! +${q.reward} ByteCoins credited!`);
        return { ...q, done: true };
      }
      return q;
    });
    setQuests(next);
    localStorage.setItem('nexus_campus_quests', JSON.stringify(next));
  };

  return (
    <div className="view" style={{ overflowY: 'auto' }}>
      
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div className="page-eyebrow">Knowledge OS · Campus Directory</div>
        <h1 className="page-title">🗺️ ESPRIT Campus Locator & Quests</h1>
        <p className="page-subtitle">Navigate through the university block locations, study spots, and complete scavenger quests to earn ByteCoins!</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, paddingBottom: 40 }}>
        
        {/* Left Column: Locations navigation list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1, padding: '0 6px 6px' }}>CAMPUS LOCATIONS</span>
          
          {LOCATIONS.map(l => {
            const isActive = selectedLoc.id === l.id;
            return (
              <div 
                key={l.id}
                onClick={() => setSelectedLoc(l)}
                style={{ 
                  padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                  background: isActive ? 'var(--cyan-dim)' : 'var(--surface)',
                  border: isActive ? '1px solid var(--cyan)' : '1px solid var(--border)',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 12
                }}
              >
                <span style={{ fontSize: 24 }}>{l.icon}</span>
                <strong style={{ fontSize: 13, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name.split(' (')[0]}</strong>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Spot Profile & Scavenger Quests */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Active location stats detail */}
          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 36 }}>{selectedLoc.icon}</span>
              <div>
                <h2 style={{ fontSize: 18, color: '#fff', fontWeight: 850 }}>{selectedLoc.name}</h2>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Interactive campus directory card</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 4 }}>Quiet Study Rating</div>
                <strong style={{ fontSize: 14, color: 'var(--cyan)' }}>{selectedLoc.quietScore} / 5 Stars ⭐</strong>
              </div>
              
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 4 }}>Campus Wi-Fi Speed</div>
                <strong style={{ fontSize: 14, color: 'var(--purple)' }}>{selectedLoc.wifi}</strong>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 4 }}>Jury/Student Tip</div>
              <p style={{ fontSize: 13, color: 'var(--text-bright)', lineHeight: 1.6, margin: 0 }}>{selectedLoc.tip}</p>
            </div>
          </div>

          {/* Campus quests list */}
          <div className="card" style={{ padding: 24 }}>
            <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1, display: 'block', marginBottom: 16 }}>🏃 DAILY CAMPUS SCAVENGER QUESTS</span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {quests.map(q => (
                <div key={q.id} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12,
                  background: 'var(--surface)', border: '1px solid var(--border)', opacity: q.done ? 0.7 : 1
                }}>
                  <div>
                    <strong style={{ fontSize: 14, color: '#fff', textDecoration: q.done ? 'line-through' : 'none' }}>{q.name}</strong>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>{q.desc}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--yellow)', fontWeight: 'bold' }}>🪙 {q.reward} Coins</span>
                    
                    <button 
                      className={`btn ${q.done ? 'btn-ghost' : 'btn-cyan'}`} 
                      disabled={q.done}
                      onClick={() => claimQuest(q.id)}
                      style={{ fontSize: 11, padding: '6px 12px' }}
                    >
                      {q.done ? '✓ Completed' : 'Claim Reward'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
