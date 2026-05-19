import { useState, useEffect } from 'react';
import Background3D   from './components/Background3D';
import Sidebar        from './components/Sidebar';
import Dashboard      from './views/Dashboard';
import SubjectsView   from './views/SubjectsView';
import FlashcardsView from './views/FlashcardsView';
import TimerView      from './views/TimerView';
import NotesView      from './views/NotesView';
import AIView         from './views/AIView';
import RoadmapView    from './views/RoadmapView';
import ResourcesView  from './views/ResourcesView';
import CodeSnippetsView from './views/CodeSnippetsView';
import AchievementsView from './views/AchievementsView';
import LoginView      from './views/LoginView';
import ProfileView    from './views/ProfileView';
import CreditsView    from './views/CreditsView';

export default function App() {
  const [user, setUser]         = useState(() => JSON.parse(localStorage.getItem('nexus_user') || 'null'));
  const [view, setView]         = useState('dashboard');
  const [fcSubject, setFcSubject] = useState(null);
  const [viewKey, setViewKey]   = useState(Date.now());
  
  // Theme & Language State
  const [theme, setTheme]       = useState(() => localStorage.getItem('nexus_theme') || 'dark');
  const [lang, setLang]         = useState(() => localStorage.getItem('nexus_lang') || 'en');

  const handleLogin = (u) => {
    localStorage.setItem('nexus_user', JSON.stringify(u));
    setUser(u);
  };

  const navigate = (to) => {
    setView(to);
    setViewKey(Date.now());
    if (to !== 'flashcards') setFcSubject(null);
  };

  const goFlashcards = (subject) => {
    setFcSubject(subject);
    setView('flashcards');
    setViewKey(k => k + 1);
  };

  if (!user) return <LoginView onLogin={handleLogin} />;

  return (
    <div className={`app ${theme === 'light' ? 'light-theme' : ''}`}>
      <Background3D />
      <div className="grid-overlay" />
      <Sidebar active={view} onNav={navigate} />
      
      <main className="main" style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100vh', overflow: 'hidden' }}>
        {/* Global Glass Header */}
        <header style={{
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16,
          padding: '12px 24px', background: 'rgba(255,255,255,0.01)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)', zIndex: 10, flexShrink: 0
        }}>
          {/* Language Selector */}
          <select 
            value={lang} 
            onChange={e => { setLang(e.target.value); localStorage.setItem('nexus_lang', e.target.value); }} 
            className="input" 
            style={{ width: 140, padding: '6px 12px', fontSize: 13, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-bright)' }}
          >
            <option value="en">🇬🇧 English</option>
            <option value="fr">🇫🇷 Français</option>
          </select>
          {/* Theme Switcher */}
          <button 
            onClick={() => {
              const next = theme === 'dark' ? 'light' : 'dark';
              setTheme(next);
              localStorage.setItem('nexus_theme', next);
            }} 
            className="btn btn-ghost" 
            style={{ fontSize: 13, padding: '8px 16px', border: '1px solid var(--border)' }}
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </header>

        {/* Views Container */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {view === 'dashboard'  && <Dashboard  key={viewKey} onNav={navigate} lang={lang} />}
          {view === 'subjects'   && <SubjectsView  key={viewKey} onSelectSubject={goFlashcards} />}
          {view === 'flashcards' && <FlashcardsView key={viewKey} initialSubjectId={fcSubject?.id} />}
          {view === 'timer'      && <TimerView   key={viewKey} />}
          {view === 'notes'      && <NotesView   key={viewKey} />}
          {view === 'ai'         && <AIView      key={viewKey} />}
          {view === 'roadmap'    && <RoadmapView key={viewKey} />}
          {view === 'resources'  && <ResourcesView key={viewKey} />}
          {view === 'snippets'   && <CodeSnippetsView key={viewKey} user={user} />}
          {view === 'achievements'&& <AchievementsView key={viewKey} user={user} />}
          {view === 'profile'    && <ProfileView key={viewKey} user={user} setUser={setUser} />}
          {view === 'credits'    && <CreditsView key={viewKey} />}
        </div>
      </main>
    </div>
  );
}
