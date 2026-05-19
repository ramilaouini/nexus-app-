import { useState, useEffect } from 'react';
import { api } from '../api';

const ALL_ACHIEVEMENTS = [
  { id: 1, title: 'First Steps', desc: 'Complete your first study session', icon: '🌱', color: 'var(--green)' },
  { id: 2, title: 'Deep Focus', desc: 'Study for 2 hours straight', icon: '🧠', color: 'var(--cyan)' },
  { id: 3, title: 'Knowledge Architect', desc: 'Create 50 flashcards', icon: '🏛', color: 'var(--purple)' },
  { id: 4, title: 'Code Wizard', desc: 'Save 10 code snippets', icon: '🧙‍♂️', color: 'var(--orange)' },
  { id: 5, title: '7-Day Streak', desc: 'Study every day for a week', icon: '🔥', color: '#ef4444' },
  { id: 6, title: 'Polymath', desc: 'Master subjects in 3 different categories', icon: '🌟', color: 'var(--yellow)' },
  { id: 7, title: 'Early Bird', desc: 'Study before 6 AM', icon: '🌅', color: '#fcd34d' },
  { id: 8, title: 'Night Owl', desc: 'Study after midnight', icon: '🦉', color: '#6366f1' },
  { id: 9, title: 'AI Whisperer', desc: 'Generate 10 random AI cards or snippets', icon: '🤖', color: '#10b981' },
  { id: 10, title: 'Librarian', desc: 'Add 5 resources to the vault', icon: '📚', color: '#8b5cf6' },
  { id: 11, title: 'Pathfinder', desc: 'Start an educational roadmap', icon: '🗺️', color: '#3b82f6' },
  { id: 12, title: 'Grandmaster', desc: 'Reach 100% mastery in a subject', icon: '👑', color: '#fbbf24' },
];

const LEADERBOARD_PEERS = [
  { rank: 1, name: 'Skander ESPRIT', level: 'Grandmaster Lvl 14', xp: '18,400 XP', coins: 1420, avatar: '🧙‍♂️', badges: ['🌱', '🧠', '🏛', '🔥'] },
  { rank: 2, name: 'Farah ESPRIT', level: 'Expert Lvl 12', xp: '14,200 XP', coins: 950, avatar: '👩‍💻', badges: ['🌱', '🧠', '🗺️', '🦉'] },
  { rank: 3, name: 'Rami Laouini (You)', level: 'Expert Lvl 11', xp: '12,900 XP', coins: 120, avatar: '👤', badges: ['🌱', '🏛', '🧙‍♂️'] },
  { rank: 4, name: 'Youssef ESPRIT', level: 'Apprentice Lvl 8', xp: '9,800 XP', coins: 680, avatar: '👨‍🎓', badges: ['🌱', '🧠', '🌅'] },
  { rank: 5, name: 'Rania ESPRIT', level: 'Apprentice Lvl 7', xp: '8,400 XP', coins: 540, avatar: '👩‍🏫', badges: ['🌱', '🏛'] }
];

export default function AchievementsView({ user }) {
  const [activeTab, setActiveTab] = useState('badges'); // 'badges' | 'leaderboard'
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [userCoins, setUserCoins] = useState(() => Number(localStorage.getItem('nexus_coins') || '100'));

  useEffect(() => {
    loadUnlocked();
    // Update user coins on load
    setUserCoins(Number(localStorage.getItem('nexus_coins') || '100'));
  }, []);

  const loadUnlocked = async () => {
    if (!user) return;
    try {
      const data = await api.get('/achievements/' + user.id);
      setUnlockedIds(data);
    } catch(e) {
      console.error(e);
    }
  };

  const forceUnlockAll = async () => {
    if (!user) return;
    for (const ach of ALL_ACHIEVEMENTS) {
      if (!unlockedIds.includes(ach.id)) {
        await api.post('/achievements/' + user.id, { badge_id: ach.id });
      }
    }
    loadUnlocked();
  };

  const unlockedCount = unlockedIds.length;
  const progress = (unlockedCount / ALL_ACHIEVEMENTS.length) * 100;

  // Insert current user values dynamically inside rank #3 card!
  const resolvedPeers = LEADERBOARD_PEERS.map(p => {
    if (p.rank === 3) {
      return {
        ...p,
        name: `${user?.username || 'Rami'} (You)`,
        coins: userCoins
      };
    }
    return p;
  });

  return (
    <div className="view" style={{ overflowY: 'auto' }}>
      
      {/* Page Header with double tabs */}
      <div className="page-header flex justify-between items-center" style={{ marginBottom: 24 }}>
        <div>
          <div className="page-eyebrow">Knowledge OS · Gamification</div>
          <h1 className="page-title">{activeTab === 'badges' ? '🏆 Achievements' : '📈 ESPRIT Leaderboard'}</h1>
          <p className="page-subtitle">Track your learning milestones, rise in ranks, and compare study speed with peer engineers.</p>
        </div>
        
        <div style={{ display: 'flex', gap: 10 }}>
          <button className={`btn ${activeTab === 'badges' ? 'btn-cyan' : 'btn-ghost'}`} onClick={() => setActiveTab('badges')}>
            Badges
          </button>
          <button className={`btn ${activeTab === 'leaderboard' ? 'btn-purple' : 'btn-ghost'}`} onClick={() => setActiveTab('leaderboard')}>
            Leaderboard
          </button>
          <button className="btn btn-ghost" style={{ fontSize: 10, opacity: 0.3 }} onClick={forceUnlockAll}>Dev: Unlock All</button>
        </div>
      </div>

      {activeTab === 'badges' ? (
        /* STANDARD BADGES DISPLAY */
        <div>
          {/* Progress Overview */}
          <div className="card mb-8">
            <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: 'var(--text-bright)', marginBottom: '4px' }}>Your Progress</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>You have unlocked {unlockedCount} out of {ALL_ACHIEVEMENTS.length} badges.</p>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--cyan)' }}>
                {Math.round(progress)}%
              </div>
            </div>
            <div className="progress-bar" style={{ height: '8px', background: 'var(--surface)' }}>
              <div className="progress-fill" style={{ width: `${progress}%`, background: 'var(--cyan)', boxShadow: '0 0 12px var(--cyan-glow)' }} />
            </div>
          </div>

          {/* Badges Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', paddingBottom: '40px' }}>
            {ALL_ACHIEVEMENTS.map(badge => {
              const unlocked = unlockedIds.includes(badge.id);
              return (
                <div 
                  key={badge.id} 
                  className="card" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '20px',
                    opacity: unlocked ? 1 : 0.5,
                    filter: unlocked ? 'none' : 'grayscale(100%)',
                    border: unlocked ? `1px solid ${badge.color}` : '1px solid var(--border)',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ 
                    fontSize: '36px', 
                    background: unlocked ? `${badge.color}22` : 'var(--surface)', 
                    width: '64px', 
                    height: '64px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    borderRadius: '50%',
                    boxShadow: unlocked ? `0 0 20px ${badge.color}44` : 'none'
                  }}>
                    {badge.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: unlocked ? badge.color : 'var(--text-bright)', marginBottom: '4px' }}>
                      {badge.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {badge.desc}
                    </div>
                    {!unlocked && (
                      <div style={{ fontSize: '10px', marginTop: '8px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                        🔒 Locked
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ESPRIT COMPETITIVE LEADERBOARD */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 40 }}>
          
          <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(168,85,247,0.06), rgba(0,229,255,0.06))', border: '1px solid var(--border-hi)' }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1, textTransform: 'uppercase' }}>COMPETITION TIERS</span>
              <h2 style={{ fontSize: 18, color: 'var(--text-bright)', fontWeight: 800, marginTop: 4 }}>ESPRIT Sophomore Cohort</h2>
            </div>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Updated live based on study hours</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {resolvedPeers.map(p => {
              const isUser = p.rank === 3;
              return (
                <div 
                  key={p.rank} 
                  className="card"
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 20, padding: '16px 24px',
                    background: isUser ? 'rgba(0,229,255,0.05)' : 'var(--surface)',
                    border: isUser ? '1px solid var(--cyan)' : '1px solid var(--border)',
                    boxShadow: isUser ? '0 0 15px rgba(0,229,255,0.1)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {/* Rank Badge */}
                  <div style={{ 
                    width: 32, height: 32, borderRadius: '50%', background: p.rank === 1 ? 'var(--yellow)' : p.rank === 2 ? '#a1a1a1' : 'var(--surface)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 14,
                    color: p.rank <= 2 ? '#000' : 'var(--text-bright)'
                  }}>
                    {p.rank}
                  </div>

                  {/* Student Avatar */}
                  <div style={{ fontSize: 26, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.avatar}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 'bold', color: 'var(--text-bright)' }}>{p.name}</div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.level}</span>
                  </div>

                  {/* Badges Preview */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    {p.badges.map((b, i) => (
                      <span key={i} style={{ fontSize: 14 }}>{b}</span>
                    ))}
                  </div>

                  {/* Wallet / XP */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--cyan)' }}>{p.xp}</div>
                    <span style={{ fontSize: 11, color: 'var(--yellow)' }}>🪙 {p.coins} Coins</span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}
