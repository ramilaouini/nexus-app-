import { useState } from 'react';

const HACKATHONS = [
  {
    id: 1,
    title: '🏆 ESPRIT Hackathon 2026',
    date: 'Oct 24 - 26, 2026',
    location: 'Tunis, Tunisia',
    prize: '5,000 TND Cash Prize',
    desc: 'The biggest internal university hackathon challenges sophomore engineering students to construct highly scaled Embedded or SPA software structures.',
    joined: false
  },
  {
    id: 2,
    title: '⚡ Tunihack XI',
    date: 'Dec 12 - 13, 2026',
    location: 'Open Space ESPRIT, Tunisia',
    prize: '3,000 TND Cash Prize',
    desc: 'Join elite engineering squads from across all Tunisian universities to solve algorithmic system roadblocks over 24-hours non-stop!',
    joined: false
  },
  {
    id: 3,
    title: '🧙‍♂️ IEEE Xtreme 20.0 (Tunisia Section)',
    date: 'Oct 17, 2026',
    location: 'Global Virtual / ESPRIT Hub',
    prize: 'International IEEE Honors',
    desc: 'Compete in a global 24-hour virtual competitive programming battle against standard algorithmic puzzles curated by international IEEE coaches.',
    joined: false
  }
];

const ARTICLES = [
  {
    tag: 'C++',
    title: 'C++26 Draft Features Concurrency Pipelines',
    desc: 'ISO standards committee pushes initial drafts of C++26 introducing native structural co-routines, simplified template models, and safe heap pointers.',
    time: '2 hours ago'
  },
  {
    tag: 'React',
    title: 'React 19 Compiler Fully Eliminates Hooks Boilerplate',
    desc: 'The official release of the React 19 compiler automatically compiles memoizations on-the-fly, rendering useMemo and useCallback hooks completely obsolete.',
    time: '1 day ago'
  },
  {
    tag: 'Artificial Intelligence',
    title: 'Groq LPU chipsets achieve 800 tokens/sec performance',
    desc: 'Specialized Groq Language Processing Units show unprecedented benchmark processing speed, delivering instant LLM streaming to dynamic web portals.',
    time: '3 days ago'
  }
];

export default function NewsView() {
  const [hacks, setHacks] = useState(() => {
    const saved = localStorage.getItem('nexus_registered_hackathons');
    return saved ? JSON.parse(saved) : HACKATHONS;
  });

  const joinHackathon = (id) => {
    const next = hacks.map(h => {
      if (h.id === id && !h.joined) {
        // Reward 30 ByteCoins!
        const coins = Number(localStorage.getItem('nexus_coins') || '100');
        localStorage.setItem('nexus_coins', (coins + 30).toString());
        alert("🎉 Joined Tunisia Hackathon! +30 ByteCoins allowance credited to your wallet!");
        return { ...h, joined: true };
      }
      return h;
    });
    setHacks(next);
    localStorage.setItem('nexus_registered_hackathons', JSON.stringify(next));
  };

  return (
    <div className="view" style={{ overflowY: 'auto' }}>
      
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div className="page-eyebrow">Knowledge OS · Feeds</div>
        <h1 className="page-title">📰 Hackathons & Technology Feed</h1>
        <p className="page-subtitle">Track competitive coding hackathons in Tunisia and stay ahead of global software engineering advancements.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, paddingBottom: 40 }}>
        
        {/* Left Column: Tunisia Hackathons list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1, textTransform: 'uppercase' }}>🏆 FEATURED TUNISIA HACKATHONS</span>
          
          {hacks.map(h => (
            <div key={h.id} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 800 }}>{h.title}</h3>
                  <div style={{ fontSize: 11, color: 'var(--cyan)', marginTop: 4 }}>📍 {h.location} · {h.date}</div>
                </div>
                <div className="badge badge-purple" style={{ fontSize: 10 }}>{h.prize}</div>
              </div>
              
              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-muted)' }}>{h.desc}</p>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <button 
                  className={`btn ${h.joined ? 'btn-ghost' : 'btn-cyan'}`} 
                  onClick={() => joinHackathon(h.id)}
                  disabled={h.joined}
                  style={{ fontSize: 12, padding: '8px 16px' }}
                >
                  {h.joined ? '✓ Registered' : '🚀 Register Now (+30🪙)'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Global Tech Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--purple)', letterSpacing: 1, textTransform: 'uppercase' }}>⚡ GLOBAL ENGINEERING FEED</span>
          
          {ARTICLES.map((art, idx) => (
            <div key={idx} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-cyan" style={{ fontSize: 8 }}>{art.tag}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{art.time}</span>
              </div>

              <h4 style={{ fontSize: 13, color: '#fff', fontWeight: 700, lineHeight: 1.4 }}>{art.title}</h4>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{art.desc}</p>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
