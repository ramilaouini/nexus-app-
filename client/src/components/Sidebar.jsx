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
  { id: 'profile',      icon: '👤', label: 'USER'  },
];

export default function Sidebar({ active, onNav }) {
  return (
    <aside className="sidebar">
      <div className="logo-mark">NEXUS</div>
      {ITEMS.map((item, i) => (
        <div key={item.id} style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
          {(i === 1 || i === 5 || i === 8) && <div className="nav-divider" />}
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
