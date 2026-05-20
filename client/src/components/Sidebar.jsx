import { useState, useEffect } from 'react';

const WORKSPACES = [
  {
    id: 'productivity',
    label: 'Study Hub',
    icon: '🚀',
    accentColor: '#00e5ff',
    accentDim: 'rgba(0, 229, 255, 0.12)',
    accentGlow: 'rgba(0, 229, 255, 0.35)',
    items: [
      { id: 'roadmap',      icon: '◮', label: 'PATH'  },
      { id: 'subjects',     icon: '◈', label: 'SUB'   },
      { id: 'flashcards',   icon: '⟡', label: 'CARDS' },
      { id: 'quiz',         icon: '📝', label: 'QUIZ'  },
      { id: 'timer',        icon: '◎', label: 'FOCUS' },
      { id: 'notes',        icon: '≡', label: 'NOTES' },
      { id: 'goal',         icon: '📊', label: 'GOAL'  },
      { id: 'sched',        icon: '⏰', label: 'SCHED'  },
      { id: 'stats',        icon: '📈', label: 'STATS' },
    ]
  },
  {
    id: 'multiverse',
    label: 'Multiverse',
    icon: '🌐',
    accentColor: '#a855f7',
    accentDim: 'rgba(168, 85, 247, 0.12)',
    accentGlow: 'rgba(168, 85, 247, 0.35)',
    items: [
      { id: 'lounge',       icon: '💬', label: 'LOUNGE' },
      { id: 'map',          icon: '🗺️', label: 'WORLD' },
      { id: 'maps',         icon: '📍', label: 'MAPS' },
      { id: 'duel',         icon: '⚔️', label: 'DUEL'  },
      { id: 'ship',         icon: '🚀', label: 'SHIP'  },
      { id: 'backpack',     icon: '🎒', label: 'PACK' },
    ]
  },
  {
    id: 'recreational',
    label: 'Entertainment',
    icon: '🎭',
    accentColor: '#f59e0b',
    accentDim: 'rgba(245, 158, 11, 0.12)',
    accentGlow: 'rgba(245, 158, 11, 0.35)',
    items: [
      { id: 'lofi',         icon: '🎧', label: 'LOFI'  },
      { id: 'chill',        icon: '🕹️', label: 'CHILL' },
      { id: 'cinema',       icon: '🍿', label: 'THEATER' },
      { id: 'resources',    icon: '📚', label: 'LIB'   },
      { id: 'news',         icon: '📰', label: 'NEWS'  },
      { id: 'achievements', icon: '🏆', label: 'AWARDS'},
      { id: 'ai',           icon: '✦', label: 'AI'    },
      { id: 'credits',      icon: '✨', label: 'DEV'   },
    ]
  }
];

export default function Sidebar({ active, onNav, playing }) {
  const [hoveredWorkspace, setHoveredWorkspace] = useState(null);
  const [pinnedWorkspace, setPinnedWorkspace] = useState(null);
  const [isPinned, setIsPinned] = useState(() => localStorage.getItem('nexus_sidebar_pinned') === 'true');

  const getWorkspaceForView = (viewId) => {
    return WORKSPACES.find(ws => ws.items.some(item => item.id === viewId));
  };

  // Sync pinned state from active tab on mount
  useEffect(() => {
    const currentWs = getWorkspaceForView(active);
    if (currentWs && isPinned) {
      setPinnedWorkspace(currentWs);
    }
  }, [active]);

  const togglePin = () => {
    const nextPin = !isPinned;
    setIsPinned(nextPin);
    localStorage.setItem('nexus_sidebar_pinned', String(nextPin));
    if (!nextPin) {
      setPinnedWorkspace(null);
    } else {
      setPinnedWorkspace(hoveredWorkspace || getWorkspaceForView(active) || WORKSPACES[0]);
    }
  };

  const selectWorkspace = (ws) => {
    if (pinnedWorkspace?.id === ws.id) {
      setPinnedWorkspace(null);
      setIsPinned(false);
      localStorage.setItem('nexus_sidebar_pinned', 'false');
    } else {
      setPinnedWorkspace(ws);
      setIsPinned(true);
      localStorage.setItem('nexus_sidebar_pinned', 'true');
    }
  };

  const activeWorkspace = hoveredWorkspace || pinnedWorkspace || (isPinned && getWorkspaceForView(active));
  const isDrawerOpen = !!activeWorkspace;

  return (
    <div 
      className="sidebar-wrapper" 
      style={{ width: isPinned && isDrawerOpen ? '390px' : '70px' }}
      onMouseLeave={() => setHoveredWorkspace(null)}
    >
      <aside className="sidebar">
        <div className="logo-mark">NEXUS</div>

        {/* HUB (Dashboard) */}
        <button
          className={`nav-item${active === 'dashboard' ? ' active' : ''}`}
          onClick={() => {
            onNav('dashboard');
            if (!isPinned) {
              setPinnedWorkspace(null);
            }
          }}
          title="Dashboard Hub"
        >
          <span style={{ fontSize: 20 }}>⬡</span>
          <span className="nav-label">HUB</span>
        </button>

        <div className="nav-divider" />

        {/* WORKSPACE CATEGORIES */}
        {WORKSPACES.map(ws => {
          const isCurrentActive = getWorkspaceForView(active)?.id === ws.id;
          const isDrawerCurrentlyOpenForWs = activeWorkspace?.id === ws.id;

          return (
            <button
              key={ws.id}
              className={`nav-item${isCurrentActive ? ' active' : ''}`}
              style={{
                borderColor: isDrawerCurrentlyOpenForWs ? ws.accentColor : 'transparent',
                background: isDrawerCurrentlyOpenForWs ? ws.accentDim : 'transparent',
                color: isDrawerCurrentlyOpenForWs ? ws.accentColor : 'var(--text-muted)'
              }}
              onMouseEnter={() => setHoveredWorkspace(ws)}
              onClick={() => selectWorkspace(ws)}
              title={ws.label}
            >
              <span style={{ fontSize: 20 }}>{ws.icon}</span>
              <span className="nav-label" style={{ fontSize: 8 }}>{ws.id.substring(0, 4)}</span>
            </button>
          );
        })}

        <div className="nav-divider" />

        {/* USER PROFILE */}
        <button
          className={`nav-item${active === 'profile' ? ' active' : ''}`}
          onClick={() => {
            onNav('profile');
            if (!isPinned) {
              setPinnedWorkspace(null);
            }
          }}
          title="User Profile"
        >
          <span style={{ fontSize: 20 }}>👤</span>
          <span className="nav-label">USER</span>
        </button>

        <div style={{ flex: 1, minHeight: 20 }} />

        {/* LOGOUT */}
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

      {/* FLYOUT GLASS DRAWER */}
      <div 
        className={`sidebar-drawer${isDrawerOpen ? ' open' : ''}`}
        style={{
          '--drawer-accent': activeWorkspace?.accentColor,
          '--drawer-accent-dim': activeWorkspace?.accentDim,
          '--drawer-accent-glow': activeWorkspace?.accentGlow
        }}
      >
        {activeWorkspace && (
          <>
            <div className="drawer-header">
              <span className="drawer-title">{activeWorkspace.label}</span>
              <button 
                className={`drawer-pin-btn${isPinned ? ' pinned' : ''}`}
                onClick={togglePin}
                title={isPinned ? "Unpin Drawer" : "Pin Drawer Open"}
              >
                📌
              </button>
            </div>

            <div className="drawer-grid">
              {activeWorkspace.items.map((item, idx) => {
                const isActive = active === item.id;
                return (
                  <div 
                    key={item.id}
                    className="stagger-item drawer-item"
                    style={{
                      animationDelay: `${idx * 0.04}s`,
                      borderWidth: isActive ? '1.5px' : '1px',
                      background: isActive ? activeWorkspace.accentDim : 'rgba(255, 255, 255, 0.01)',
                      borderColor: isActive ? activeWorkspace.accentColor : 'var(--border)',
                      color: isActive ? 'var(--text-bright)' : 'var(--text)'
                    }}
                    onClick={() => onNav(item.id)}
                  >
                    <span className="drawer-item-icon">
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
                    <span className="drawer-item-label">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
