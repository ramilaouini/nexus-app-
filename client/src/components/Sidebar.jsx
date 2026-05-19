import { useState, useRef, useEffect } from 'react';

const ITEMS = [
  { id: 'dashboard',    icon: '⬡', label: 'HUB'   },
  { id: 'roadmap',      icon: '◮', label: 'PATH'  },
  { id: 'subjects',     icon: '◈', label: 'SUB'   },
  { id: 'flashcards',   icon: '⟡', label: 'CARDS' },
  { id: 'snippets',     icon: '⌨', label: 'CODE'  },
  { id: 'achievements', icon: '🏆', label: 'AWARDS'},
  { id: 'timer',        icon: '◎', label: 'FOCUS' },
  { id: 'notes',        icon: '≡', label: 'NOTES' },
  { id: 'resources',    icon: '📚', label: 'LIB'   },
  { id: 'ai',           icon: '✦', label: 'AI'    },
  { id: 'chill',        icon: '🕹️', label: 'CHILL' },
  { id: 'profile',      icon: '👤', label: 'USER'  },
  { id: 'credits',      icon: '✨', label: 'DEV'   },
];

const TRACKS = [
  { name: '🎧 Lofi Chillhop', url: 'https://stream.zeno.fm/f3wvbbqmdg8uv' },
  { name: '🎹 Classical Piano', url: 'http://stream.srg-ssr.ch/m/rsc_de/mp3_128' },
  { name: '🌌 Ambient Synth', url: 'https://lofi.stream.laut.fm/lofi' }
];

export default function Sidebar({ active, onNav }) {
  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [volume, setVolume] = useState(0.2);
  const [showConsole, setShowConsole] = useState(false);
  
  const audioRef = useRef(null);

  const toggleMusic = () => {
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.volume = volume;
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleVolumeChange = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  };

  const handleTrackChange = (idx) => {
    setTrackIdx(idx);
    const wasPlaying = playing;
    if (audioRef.current) {
      audioRef.current.src = TRACKS[idx].url;
      audioRef.current.load();
      if (wasPlaying) {
        // Wait for reload
        audioRef.current.oncanplay = () => {
          audioRef.current.volume = volume;
          audioRef.current.play();
          audioRef.current.oncanplay = null;
        };
      }
    }
  };

  return (
    <aside className="sidebar" style={{ overflowY: 'auto', position: 'relative' }}>
      <div className="logo-mark">NEXUS</div>
      {ITEMS.map((item, i) => (
        <div key={item.id} style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
          {(i === 1 || i === 5 || i === 8 || i === 11) && <div className="nav-divider" />}
          <button
            className={`nav-item${active === item.id ? ' active' : ''}`}
            onClick={() => onNav(item.id)}
            title={item.label}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        </div>
      ))}
      
      <div style={{ flex: 1 }} />
      
      {/* Zen Player Controls */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12, position: 'relative' }}>
        <audio ref={audioRef} loop src={TRACKS[trackIdx].url} />
        
        {/* Toggle Panel Button */}
        <button
          className="nav-item"
          onClick={() => setShowConsole(!showConsole)}
          title="Focus Music Console"
          style={{ position: 'relative', margin: '4px 0' }}
        >
          {playing && <div style={{ position: 'absolute', inset: 0, background: 'var(--cyan)', opacity: 0.2, borderRadius: 12, animation: 'pulse 2s infinite' }} />}
          <span style={{ fontSize: 20 }}>{playing ? '⏸' : '🎧'}</span>
          <span className="nav-label">MUSIC</span>
        </button>

        {/* Music & Focus Control Panel */}
        {showConsole && (
          <div style={{
            position: 'absolute', left: 78, bottom: 0, width: 220, 
            background: 'var(--surface)', border: '1px solid var(--border-hi)',
            borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 12,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 1000
          }}>
            <div style={{ fontSize: 12, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1 }}>FOCUS PLAYER</div>
            
            {/* Play/Pause */}
            <button className="btn btn-cyan" onClick={toggleMusic} style={{ width: '100%', padding: '6px' }}>
              {playing ? 'Pause Audio' : 'Play Audio'}
            </button>

            {/* Track Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>SELECT TRACK</span>
              {TRACKS.map((t, idx) => (
                <button 
                  key={t.name}
                  onClick={() => handleTrackChange(idx)}
                  style={{
                    textAlign: 'left', background: trackIdx === idx ? 'var(--cyan-dim)' : 'transparent',
                    border: 'none', color: trackIdx === idx ? 'var(--cyan)' : 'var(--text)',
                    padding: '4px 8px', borderRadius: 8, fontSize: 11, cursor: 'pointer'
                  }}
                >
                  {t.name}
                </button>
              ))}
            </div>

            {/* Volume Control */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)' }}>
                <span>VOLUME</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05" 
                value={volume} onChange={handleVolumeChange} 
                style={{ width: '100%', accentColor: 'var(--cyan)', cursor: 'pointer' }}
              />
            </div>
          </div>
        )}
      </div>

      <button
        className="nav-item"
        onClick={() => { localStorage.removeItem('nexus_user'); window.location.reload(); }}
        title="Logout"
        style={{ marginBottom: '16px' }}
      >
        <span style={{ fontSize: 20 }}>⎋</span>
        <span className="nav-label">OUT</span>
      </button>
    </aside>
  );
}
