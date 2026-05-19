import { useState } from 'react';

const ACHIEVEMENTS = [
  { id: 1, title: 'First Steps', desc: 'Complete your first study session', icon: '🌱', color: 'var(--green)', unlocked: true },
  { id: 2, title: 'Deep Focus', desc: 'Study for 2 hours straight', icon: '🧠', color: 'var(--cyan)', unlocked: true },
  { id: 3, title: 'Knowledge Architect', desc: 'Create 50 flashcards', icon: '🏛', color: 'var(--purple)', unlocked: false },
  { id: 4, title: 'Code Wizard', desc: 'Save 10 code snippets', icon: '🧙‍♂️', color: 'var(--orange)', unlocked: false },
  { id: 5, title: '7-Day Streak', desc: 'Study every day for a week', icon: '🔥', color: '#ef4444', unlocked: false },
  { id: 6, title: 'Polymath', desc: 'Master subjects in 3 different categories', icon: '🌟', color: 'var(--yellow)', unlocked: false },
];

export default function AchievementsView() {
  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;
  const progress = (unlockedCount / ACHIEVEMENTS.length) * 100;

  return (
    <div className="view">
      <div className="page-header">
        <div className="page-eyebrow">Knowledge OS · Gamification</div>
        <h1 className="page-title">Achievements</h1>
        <p className="page-subtitle">Track your learning milestones and earn badges.</p>
      </div>

      {/* Progress Overview */}
      <div className="card mb-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '24px', color: 'var(--text-bright)', marginBottom: '4px' }}>Your Progress</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>You have unlocked {unlockedCount} out of {ACHIEVEMENTS.length} badges.</p>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {ACHIEVEMENTS.map(badge => (
          <div 
            key={badge.id} 
            className="card" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '20px',
              opacity: badge.unlocked ? 1 : 0.5,
              filter: badge.unlocked ? 'none' : 'grayscale(100%)',
              border: badge.unlocked ? `1px solid ${badge.color}` : '1px solid var(--border)'
            }}
          >
            <div style={{ 
              fontSize: '40px', 
              background: badge.unlocked ? `${badge.color}22` : 'var(--surface)', 
              width: '70px', 
              height: '70px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderRadius: '50%',
              boxShadow: badge.unlocked ? `0 0 20px ${badge.color}44` : 'none'
            }}>
              {badge.icon}
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: badge.unlocked ? badge.color : 'var(--text-bright)', marginBottom: '4px' }}>
                {badge.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {badge.desc}
              </div>
              {!badge.unlocked && (
                <div style={{ fontSize: '10px', marginTop: '8px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  🔒 Locked
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
