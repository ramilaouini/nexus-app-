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

export default function App() {
  const [view, setView]         = useState('dashboard');
  const [fcSubject, setFcSubject] = useState(null);
  const [viewKey, setViewKey]   = useState(0); // force re-mount on nav

  const navigate = (to) => {
    setView(to);
    setViewKey(k => k + 1);
    if (to !== 'flashcards') setFcSubject(null);
  };

  const goFlashcards = (subject) => {
    setFcSubject(subject);
    setView('flashcards');
    setViewKey(k => k + 1);
  };

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
        {view === 'snippets'   && <CodeSnippetsView key={viewKey} />}
        {view === 'achievements'&& <AchievementsView key={viewKey} />}
      </main>
    </div>
  );
}
