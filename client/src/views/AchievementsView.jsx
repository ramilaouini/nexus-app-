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

export default function AchievementsView({ user }) {
  const [unlockedIds, setUnlockedIds] = useState([]);

  useEffect(() => {
    loadUnlocked();
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

  return (
    <div className="view" style={{ overflowY: 'auto' }}>
      <div className="page-header flex justify-between items-center">
        <div>
          <div className="page-eyebrow">Knowledge OS · Gamification</div>
          <h1 className="page-title">Achievements</h1>
          <p className="page-subtitle">Track your learning milestones and earn badges.</p>
        </div>
        <button className="btn btn-ghost" onClick={forceUnlockAll}>Dev: Unlock All</button>
      </div>

      {/* Progress Overview */}
      <div className="card mb-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '24px', color: 'var(--text-bright)', marginBottom: '4px' }}>Your Progress</h2>
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
                fontSize: '40px', 
                background: unlocked ? `${badge.color}22` : 'var(--surface)', 
                width: '70px', 
                height: '70px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                borderRadius: '50%',
                boxShadow: unlocked ? `0 0 20px ${badge.color}44` : 'none'
              }}>
                {badge.icon}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: unlocked ? badge.color : 'var(--text-bright)', marginBottom: '4px' }}>
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
  );
}
