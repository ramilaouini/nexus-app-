import { useState, useRef, useEffect } from 'react';

const ITEMS = [
  { id: 'dashboard',    icon: '⬡', label: 'HUB'   },
  { id: 'roadmap',      icon: '◮', label: 'PATH'  },
  { id: 'subjects',     icon: '◈', label: 'SUB'   },
  { id: 'flashcards',   icon: '⟡', label: 'CARDS' },
  { id: 'quiz',         icon: '📝', label: 'QUIZ'  },
  { id: 'snippets',     icon: '⌨', label: 'CODE'  },
  { id: 'achievements', icon: '🏆', label: 'AWARDS'},
  { id: 'timer',        icon: '◎', label: 'FOCUS' },
  { id: 'lofi',         icon: '🎧', label: 'LOFI'  },
  { id: 'notes',        icon: '≡', label: 'NOTES' },
  { id: 'resources',    icon: '📚', label: 'LIB'   },
  { id: 'ai',           icon: '✦', label: 'AI'    },
  { id: 'goal',         icon: '📊', label: 'GOAL'  },
  { id: 'sched',        icon: '⏰', label: 'SCHED'  },
  { id: 'news',         icon: '📰', label: 'NEWS'  },
  { id: 'duel',         icon: '⚔️', label: 'DUEL'  },
  { id: 'ship',         icon: '🚀', label: 'SHIP'  },
  { id: 'maps',         icon: '📍', label: 'MAPS'  },
  { id: 'backpack',     icon: '🎒', label: 'BACKPACK' },
  { id: 'stats',        icon: '📈', label: 'STATS' },
  { id: 'lounge',       icon: '💬', label: 'LOUNGE' },
  { id: 'map',          icon: '🗺️', label: 'WORLD' },
  { id: 'cinema',       icon: '🍿', label: 'THEATER' },
  { id: 'chill',        icon: '🕹️', label: 'CHILL' },
  { id: 'profile',      icon: '👤', label: 'USER'  },
  { id: 'credits',      icon: '✨', label: 'DEV'   },
];

export default function Sidebar({ active, onNav, playing }) {
  return (
    <aside className="sidebar" style={{ overflowY: 'auto', position: 'relative' }}>
      <div className="logo-mark">NEXUS</div>
      {ITEMS.map((item, i) => (
        <div key={item.id} style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
          {(i === 1 || i === 5 || i === 9 || i === 12) && <div className="nav-divider" />}
          <button
            className={`nav-item${active === item.id ? ' active' : ''}`}
            onClick={() => onNav(item.id)}
            title={item.label}
          >
            <span style={{ fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 24 }}>
              {item.id === 'lofi' && playing ? (
                <div className="music-bar-container">
                  <div className="music-bar music-bar-active" />
                  <div className="music-bar music-bar-active" />
                  <div className="music-bar music-bar-active" />
                  <div className="music-bar music-bar-active" />
                </div>
              ) : (
                item.icon
              )}
            </span>
            <span className="nav-label">{item.label}</span>
          </button>
        </div>
      ))}
      
      <div style={{ flex: 1, minHeight: 20 }} />
      
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
