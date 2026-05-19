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

export default function App() {
  const [user, setUser]         = useState(() => JSON.parse(localStorage.getItem('nexus_user') || 'null'));
  const [view, setView]         = useState('dashboard');
  const [fcSubject, setFcSubject] = useState(null);
  const [viewKey, setViewKey]   = useState(Date.now());

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
    <div className="app">
      <Background3D />
      <div className="grid-overlay" />
      <Sidebar active={view} onNav={navigate} />
      <main className="main">
        {view === 'dashboard'  && <Dashboard  key={viewKey} onNav={navigate} />}
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
      </main>
    </div>
  );
}
