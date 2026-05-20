import { useState, useEffect, useRef } from 'react';
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
import ChillZoneView  from './views/ChillZoneView';
import QuizView       from './views/QuizView';
import GoalView       from './views/GoalView';
import SchedView      from './views/SchedView';
import NewsView       from './views/NewsView';
import DuelView       from './views/DuelView';
import ShipView       from './views/ShipView';
import MapsView       from './views/MapsView';
import BackpackView   from './views/BackpackView';
import StatsView      from './views/StatsView';
import LoungeView     from './views/LoungeView';
import MapView        from './views/MapView';
import CinemaView     from './views/CinemaView';
import LofiView       from './views/LofiView';
import SpacesView     from './views/SpacesView';
import MarketView     from './views/MarketView';
import LogView        from './views/LogView';
import MiniGuide      from './components/MiniGuide';
import { SONGS, PODCASTS, PLAYLISTS, ARTISTS } from './views/LofiData';

export default function App() {
  const [user, setUser]         = useState(() => JSON.parse(localStorage.getItem('nexus_user') || 'null'));
  const [view, setView]         = useState('dashboard');
  const [fcSubject, setFcSubject] = useState(null);
  const [viewKey, setViewKey]   = useState(Date.now());
  
  // Theme & Language State
  const [theme, setTheme]       = useState(() => localStorage.getItem('nexus_theme') || 'dark');
  const [lang, setLang]         = useState(() => localStorage.getItem('nexus_lang') || 'en');

  // Game Economy & Character State
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('nexus_coins') || '12450'));
  const [inventory, setInventory] = useState(() => JSON.parse(localStorage.getItem('nexus_inventory') || '[]'));
  const [equipped, setEquipped] = useState(() => JSON.parse(localStorage.getItem('nexus_equipped') || '{"skin":null,"item":null,"backpack":null}'));

  useEffect(() => localStorage.setItem('nexus_coins', coins.toString()), [coins]);
  useEffect(() => localStorage.setItem('nexus_inventory', JSON.stringify(inventory)), [inventory]);
  useEffect(() => localStorage.setItem('nexus_equipped', JSON.stringify(equipped)), [equipped]);

  // Lifted Audio State (Unified Track Object Model)
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(() => Number(localStorage.getItem('nexus_music_volume') || '0.25'));
  const [currentTrack, setCurrentTrack] = useState(() => {
    const savedId = localStorage.getItem('nexus_music_track_id');
    return SONGS.find(s => s.id === savedId) || SONGS[0];
  });
  const audioRef = useRef(null);

  const handlePlayToggle = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (playing) {
      if (audioRef.current) audioRef.current.pause();
      setPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.volume = volume;
        audioRef.current.play()
          .then(() => setPlaying(true))
          .catch(err => {
            console.error("Audio playback error: ", err);
            // Fallback load and play on failure
            audioRef.current.load();
            audioRef.current.play().then(() => setPlaying(true)).catch(e => console.error("Playback fallback failed: ", e));
          });
      }
    }
  };

  const handleTrackChange = (track) => {
    setCurrentTrack(track);
    localStorage.setItem('nexus_music_track_id', track.id);
    setPlaying(false);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
        audioRef.current.load();
        audioRef.current.play()
          .then(() => setPlaying(true))
          .catch(e => console.error("Failed to play selected track: ", e));
      }
    }, 50);
  };

  // Sync volume with audio tag
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleLogin = (u) => {
    localStorage.setItem('nexus_user', JSON.stringify(u));
    setUser(u);
  };

  useEffect(() => {
    // Tell Discord what we are looking at
    let details = 'Exploring Nexus';
    if (view === 'dashboard') details = 'Viewing Dashboard';
    if (view === 'subjects') details = 'Browsing Subjects';
    if (view === 'flashcards') details = 'Reviewing Flashcards';
    if (view === 'timer') details = 'Using the Timer';
    if (view === 'chillzone') details = 'Chilling Out';
    
    fetch('/api/presence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ details, state: 'Studying & Grinding' })
    }).catch(err => console.log('Could not update Discord presence'));

  }, [view]);

  useEffect(() => {
    const activeTheme = localStorage.getItem('active_theme') || 'default';
    const root = document.documentElement;
    if (activeTheme === 'synthwave') {
      root.style.setProperty('--cyan', '#ff007f');
      root.style.setProperty('--purple', '#9d00ff');
      root.style.setProperty('--background', '#0b001a');
      root.style.setProperty('--surface', '#13002b');
    } else if (activeTheme === 'forest') {
      root.style.setProperty('--cyan', '#2ecc71');
      root.style.setProperty('--purple', '#27ae60');
      root.style.setProperty('--background', '#0a140f');
      root.style.setProperty('--surface', '#12251a');
    } else if (activeTheme === 'hacker') {
      root.style.setProperty('--cyan', '#00ff00');
      root.style.setProperty('--purple', '#009900');
      root.style.setProperty('--background', '#000000');
      root.style.setProperty('--surface', '#0a0a0a');
    } else {
      root.style.setProperty('--cyan', '#00e5ff');
      root.style.setProperty('--purple', '#a855f7');
      root.style.setProperty('--background', '#0b0f19');
      root.style.setProperty('--surface', '#131b2e');
    }
  }, []);

  const navigate = (to) => {
    setView(to);
    setViewKey(Date.now());
    if (to !== 'flashcards') setFcSubject(null);
    if (to === 'lofi') {
      if (!playing) {
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.load();
            audioRef.current.play()
              .then(() => setPlaying(true))
              .catch(err => console.error("Autoplay on navigation failed: ", err));
          }
        }, 100);
      }
    }
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
      <audio ref={audioRef} loop src={currentTrack?.url} />
      <Sidebar active={view} onNav={navigate} playing={playing} />
      <MiniGuide equipped={equipped} />
      
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
          {view === 'chill'      && <ChillZoneView key={viewKey} />}
          {view === 'quiz'       && <QuizView key={viewKey} />}
          {view === 'goal'       && <GoalView key={viewKey} />}
          {view === 'sched'      && <SchedView key={viewKey} />}
          {view === 'news'       && <NewsView key={viewKey} />}
          {view === 'duel'       && <DuelView key={viewKey} />}
          {view === 'ship'       && <ShipView key={viewKey} />}
          {view === 'maps'       && <MapsView key={viewKey} />}
          {view === 'backpack'   && <BackpackView key={viewKey} />}
          {view === 'stats'      && <StatsView key={viewKey} />}
          {view === 'lounge'     && <LoungeView key={viewKey} />}
          {view === 'map'        && <MapView key={viewKey} />}
          {view === 'cinema'     && <CinemaView key={viewKey} />}
          {view === 'spaces'     && <SpacesView key={viewKey} />}
          {view === 'market'     && <MarketView key={viewKey} coins={coins} setCoins={setCoins} inventory={inventory} setInventory={setInventory} equipped={equipped} setEquipped={setEquipped} />}
          {view === 'log'        && <LogView key={viewKey} />}
          {view === 'lofi'       && (
            <LofiView 
              key={viewKey}
              playing={playing}
              setPlaying={setPlaying}
              currentTrack={currentTrack}
              handleTrackChange={handleTrackChange}
              volume={volume}
              setVolume={setVolume}
              songs={SONGS}
              podcasts={PODCASTS}
              playlists={PLAYLISTS}
              artists={ARTISTS}
              handlePlayToggle={handlePlayToggle}
            />
          )}
        </div>
      </main>
    </div>
  );
}
