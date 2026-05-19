import { useState, useRef } from 'react';

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

export default function Sidebar({ active, onNav }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleMusic = () => {
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.volume = 0.25;
      audioRef.current.play().catch(err => console.error("Audio playback error: ", err));
    }
    setPlaying(!playing);
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
      
      {/* Lofi Study Music Player (Original Instant Single-Click headphones icon function) */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <audio ref={audioRef} loop src="https://stream.zeno.fm/f3wvbbqmdg8uv" />
        <button
          className="nav-item"
          onClick={toggleMusic}
          title="Lofi Study Radio"
          style={{ position: 'relative' }}
        >
          {playing && <div style={{ position: 'absolute', inset: 0, background: 'var(--purple)', opacity: 0.2, borderRadius: 10, animation: 'pulse 2s infinite' }} />}
          <span style={{ fontSize: 20 }}>{playing ? '⏸' : '🎧'}</span>
          <span className="nav-label">LOFI</span>
        </button>
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
