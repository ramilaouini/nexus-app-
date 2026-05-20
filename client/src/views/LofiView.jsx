import { useEffect, useState, useRef } from 'react';

export default function LofiView({
  playing,
  setPlaying,
  currentTrack,
  handleTrackChange,
  volume,
  setVolume,
  songs = [],
  podcasts = [],
  playlists = [],
  artists = [],
  handlePlayToggle
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('tracks'); // 'tracks', 'podcasts', 'playlists', 'artists'
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  // Audio elements' actual playback time synced via DOM Refs to avoid re-renders
  const elapsedSpanRef = useRef(null);
  const remainingSpanRef = useRef(null);
  const progressLineRef = useRef(null);

  // Sync actual media elements' progress
  useEffect(() => {
    let interval;
    const syncAudio = () => {
      const audioEl = document.querySelector('audio');
      if (audioEl) {
        const cur = audioEl.currentTime || 0;
        const dur = audioEl.duration || 0;
        if (elapsedSpanRef.current) {
          elapsedSpanRef.current.innerText = formatTime(cur);
        }
        if (remainingSpanRef.current) {
          remainingSpanRef.current.innerText = formatTime(dur);
        }
        if (progressLineRef.current) {
          const pct = dur ? (cur / dur) * 100 : 0;
          progressLineRef.current.style.width = `${pct}%`;
        }
      }
    };

    // Run sync initially and on an interval when playing
    syncAudio();
    if (playing) {
      interval = setInterval(syncAudio, 250);
    } else {
      // Set initial/fallback placeholder duration on pause
      if (remainingSpanRef.current) {
        remainingSpanRef.current.innerText = currentTrack?.duration || '00:00';
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [playing, currentTrack]);

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    if (isNaN(secs) || !isFinite(secs) || secs === 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Click progress bar to seek audio
  const handleProgressClick = (e) => {
    if (currentTrack?.isLive) return; // Disable seeking on live streams
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = clickX / width;
    const audioEl = document.querySelector('audio');
    if (audioEl && audioEl.duration) {
      const newTime = percent * audioEl.duration;
      audioEl.currentTime = newTime;
      if (elapsedSpanRef.current) {
        elapsedSpanRef.current.innerText = formatTime(newTime);
      }
      if (progressLineRef.current) {
        progressLineRef.current.style.width = `${percent * 100}%`;
      }
    }
  };

  // Navigating tracks in currently selected category or general array
  const handlePrevTrack = () => {
    if (currentTrack?.isLive) return; // Keep lives looping

    // Determine category
    const isPodcast = currentTrack?.id?.startsWith('pod-');
    const list = isPodcast ? podcasts : songs;
    const idx = list.findIndex(item => item.id === currentTrack?.id);

    if (idx !== -1) {
      const prevIdx = (idx - 1 + list.length) % list.length;
      handleTrackChange(list[prevIdx]);
    }
  };

  const handleNextTrack = () => {
    if (currentTrack?.isLive) return; // Keep lives looping

    // Determine category
    const isPodcast = currentTrack?.id?.startsWith('pod-');
    const list = isPodcast ? podcasts : songs;
    const idx = list.findIndex(item => item.id === currentTrack?.id);

    if (idx !== -1) {
      const nextIdx = (idx + 1) % list.length;
      handleTrackChange(list[nextIdx]);
    }
  };

  // Filters based on search bar
  const query = searchQuery.toLowerCase().trim();

  const filteredSongs = songs.filter(s => 
    s.name.toLowerCase().includes(query) || 
    s.artist.toLowerCase().includes(query) || 
    s.desc.toLowerCase().includes(query)
  );

  const filteredPodcasts = podcasts.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.episodeName.toLowerCase().includes(query) || 
    p.host.toLowerCase().includes(query) || 
    p.desc.toLowerCase().includes(query)
  );

  const filteredPlaylists = playlists.filter(pl => 
    pl.name.toLowerCase().includes(query) || 
    pl.desc.toLowerCase().includes(query)
  );

  const filteredArtists = artists.filter(a => 
    a.name.toLowerCase().includes(query) || 
    a.bio.toLowerCase().includes(query)
  );

  // Helper check if track is currently playing
  const isTrackPlaying = (trackId) => {
    return currentTrack?.id === trackId && playing;
  };

  return (
    <div className="view" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: '16px 24px', position: 'relative' }}>
      
      {/* Dynamic Embedded Animations & Custom Scrollbar Styles */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes equalise1 {
          0% { height: 4px; }
          100% { height: 26px; }
        }
        @keyframes equalise2 {
          0% { height: 6px; }
          100% { height: 32px; }
        }
        @keyframes equalise3 {
          0% { height: 3px; }
          100% { height: 20px; }
        }
        @keyframes equalise4 {
          0% { height: 8px; }
          100% { height: 28px; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .lofi-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .lofi-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
          border-radius: 4px;
        }
        .lofi-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .lofi-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .media-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .media-card:hover {
          transform: translateY(-4px);
          border-color: var(--cyan) !important;
          box-shadow: 0 8px 24px rgba(0, 229, 255, 0.15);
        }
        .media-card:hover .play-overlay {
          opacity: 1 !important;
          transform: scale(1.05);
        }
        
        .artist-avatar-card {
          transition: all 0.3s ease;
        }
        .artist-avatar-card:hover {
          transform: scale(1.03);
          border-color: var(--purple) !important;
          box-shadow: 0 8px 24px rgba(168, 85, 247, 0.15);
        }

        .tab-btn {
          transition: all 0.25s ease;
        }
        .tab-btn:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          color: var(--text-bright) !important;
        }
        
        .modal-overlay {
          animation: fadeIn 0.25s ease forwards;
        }
        .modal-content-box {
          animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      {/* Main Title & Search Bar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, marginBottom: 16, flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--cyan)', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>Knowledge OS · Entertainment</div>
          <h1 className="page-title" style={{ fontSize: 28, margin: 0, fontWeight: 800, color: 'var(--text-bright)', letterSpacing: -0.5 }}>✨ NEXUS Music</h1>
        </div>

        {/* Real-time Glassmorphic Search Bar */}
        <div style={{ position: 'relative', width: 320 }}>
          <input 
            type="text"
            placeholder={`Search ${activeTab === 'tracks' ? 'songs' : activeTab === 'podcasts' ? 'episodes' : activeTab === 'playlists' ? 'playlists' : 'singers'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 40px 10px 16px',
              fontSize: 13,
              borderRadius: 24,
              border: '1px solid var(--border)',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              color: 'var(--text-bright)',
              outline: 'none',
              transition: 'border-color 0.3s, box-shadow 0.3s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--cyan)';
              e.target.style.boxShadow = '0 0 12px rgba(0, 229, 255, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          />
          <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', fontSize: 14 }}>
            🔍
          </span>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute', right: 34, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, padding: 0
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Spotify Sub-Navigation Categories Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 10, flexShrink: 0 }}>
        {[
          { id: 'tracks', label: '🎵 Songs & Tracks', count: filteredSongs.length },
          { id: 'podcasts', label: '🎙️ Focus Podcasts', count: filteredPodcasts.length },
          { id: 'playlists', label: '💿 Albums & Playlists', count: filteredPlaylists.length },
          { id: 'artists', label: '👤 Singer Profiles', count: filteredArtists.length }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
              className="tab-btn"
              style={{
                padding: '8px 16px',
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 20,
                border: isActive ? '1px solid var(--cyan)' : '1px solid transparent',
                background: isActive ? 'rgba(0, 229, 255, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                color: isActive ? 'var(--cyan)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {tab.label}
              <span style={{
                fontSize: 10,
                background: isActive ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: isActive ? 'var(--text-bright)' : 'var(--text-muted)',
                padding: '1px 6px',
                borderRadius: 10,
                fontWeight: 700
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Soundboard Content Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, flex: 1, minHeight: 0, overflow: 'hidden' }}>
        
        {/* Left Side: Active Category Browser */}
        <div className="lofi-scrollbar" style={{ overflowY: 'auto', paddingRight: 6, display: 'flex', flexDirection: 'column' }}>
          
          {/* Tracks / Songs Grid */}
          {activeTab === 'tracks' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {filteredSongs.map((song) => {
                const isActive = currentTrack?.id === song.id;
                const isPlayingNow = isTrackPlaying(song.id);
                return (
                  <div 
                    key={song.id} 
                    className="card media-card"
                    style={{
                      padding: 12,
                      cursor: 'pointer',
                      border: isActive ? '1px solid var(--cyan)' : '1px solid var(--border)',
                      background: isActive ? 'rgba(0, 229, 255, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                      position: 'relative'
                    }}
                    onClick={() => handleTrackChange(song)}
                  >
                    {/* Cover Art */}
                    <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                      <img 
                        src={song.cover} 
                        alt={song.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      
                      {/* Play Overlay deck */}
                      <div className="play-overlay" style={{
                        position: 'absolute', inset: 0, 
                        background: 'rgba(0,0,0,0.5)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: isActive ? 1 : 0,
                        transition: 'all 0.3s ease',
                        borderRadius: 8
                      }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); isActive ? handlePlayToggle() : handleTrackChange(song); }}
                          style={{
                            background: 'var(--cyan)', border: 'none', borderRadius: '50%',
                            width: 44, height: 44, cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#000',
                            boxShadow: '0 4px 12px rgba(0,229,255,0.4)'
                          }}
                        >
                          {isPlayingNow ? '⏸' : '▶'}
                        </button>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-bright)', marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '80%' }}>{song.name}</span>
                        {song.isLive && (
                          <span style={{ background: 'var(--cyan)', color: '#000', fontSize: 8, padding: '1px 4px', borderRadius: 3, fontWeight: 'bold' }}>LIVE</span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--purple)', marginBottom: 4, fontWeight: 500 }}>{song.artist}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: '1.4', height: 28, overflow: 'hidden' }}>{song.desc}</div>
                    </div>

                    {/* Footer Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: 'var(--text-muted)', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: 6 }}>
                      <span>🕒 {song.duration}</span>
                      {isActive && (
                        <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>{isPlayingNow ? 'Playing' : 'Paused'}</span>
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredSongs.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No tracks match your search.
                </div>
              )}
            </div>
          )}

          {/* Focus Podcasts Grid */}
          {activeTab === 'podcasts' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {filteredPodcasts.map((pod) => {
                const isActive = currentTrack?.id === pod.id;
                const isPlayingNow = isTrackPlaying(pod.id);
                return (
                  <div 
                    key={pod.id} 
                    className="card media-card"
                    style={{
                      padding: 12,
                      cursor: 'pointer',
                      border: isActive ? '1px solid var(--cyan)' : '1px solid var(--border)',
                      background: isActive ? 'rgba(0, 229, 255, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10
                    }}
                    onClick={() => handleTrackChange(pod)}
                  >
                    {/* Cover Art */}
                    <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                      <img 
                        src={pod.cover} 
                        alt={pod.episodeName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      
                      {/* Play Overlay */}
                      <div className="play-overlay" style={{
                        position: 'absolute', inset: 0, 
                        background: 'rgba(0,0,0,0.5)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: isActive ? 1 : 0,
                        transition: 'all 0.3s ease',
                        borderRadius: 8
                      }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); isActive ? handlePlayToggle() : handleTrackChange(pod); }}
                          style={{
                            background: 'var(--cyan)', border: 'none', borderRadius: '50%',
                            width: 44, height: 44, cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#000',
                            boxShadow: '0 4px 12px rgba(0,229,255,0.4)'
                          }}
                        >
                          {isPlayingNow ? '⏸' : '▶'}
                        </button>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--cyan)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>{pod.name}</div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-bright)', marginBottom: 2, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{pod.episodeName}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Host: {pod.host}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: '1.4', height: 28, overflow: 'hidden' }}>{pod.desc}</div>
                    </div>

                    {/* Footer Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: 'var(--text-muted)', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: 6 }}>
                      <span>🎙️ {pod.duration}</span>
                      {isActive && (
                        <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>{isPlayingNow ? 'Playing' : 'Paused'}</span>
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredPodcasts.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No podcasts match your search.
                </div>
              )}
            </div>
          )}

          {/* Albums & Playlists Grid */}
          {activeTab === 'playlists' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {filteredPlaylists.map((pl) => {
                return (
                  <div 
                    key={pl.id} 
                    className="card media-card"
                    style={{
                      padding: 14,
                      cursor: 'pointer',
                      border: '1px solid var(--border)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12
                    }}
                    onClick={() => setSelectedPlaylist(pl)}
                  >
                    {/* Cover Art */}
                    <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                      <img 
                        src={pl.cover} 
                        alt={pl.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      {/* Interactive magnifying disc icon */}
                      <div className="play-overlay" style={{
                        position: 'absolute', inset: 0, 
                        background: 'rgba(0,0,0,0.6)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: 0,
                        transition: 'all 0.3s ease',
                        borderRadius: 8
                      }}>
                        <span style={{
                          background: 'var(--purple)', borderRadius: '50%',
                          width: 44, height: 44, display: 'flex',
                          alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#fff',
                          boxShadow: '0 4px 12px rgba(168,85,247,0.4)'
                        }}>
                          📖
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-bright)', marginBottom: 2 }}>{pl.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: '1.4', height: 32, overflow: 'hidden', marginBottom: 4 }}>{pl.desc}</div>
                    </div>

                    {/* Track count footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: 8 }}>
                      <span style={{ color: 'var(--purple)', fontWeight: 600 }}>{pl.isAlbum ? '📀 Album' : '💿 Playlist'}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{pl.songsCount} tracks</span>
                    </div>
                  </div>
                );
              })}
              {filteredPlaylists.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No playlists match your search.
                </div>
              )}
            </div>
          )}

          {/* Singers & Artists Profiles */}
          {activeTab === 'artists' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {filteredArtists.map((artist) => {
                return (
                  <div 
                    key={artist.id} 
                    className="card artist-avatar-card"
                    style={{
                      padding: 20,
                      cursor: 'pointer',
                      border: '1px solid var(--border)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: 12
                    }}
                    onClick={() => setSelectedArtist(artist)}
                  >
                    {/* Circle Avatar */}
                    <div style={{ width: 110, height: 110, borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', position: 'relative' }}>
                      <img 
                        src={artist.avatar} 
                        alt={artist.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Details */}
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-bright)', marginBottom: 2 }}>{artist.name}</div>
                      <div style={{ fontSize: 10, background: 'rgba(168, 85, 247, 0.12)', color: 'var(--purple)', padding: '2px 8px', borderRadius: 10, display: 'inline-block', fontWeight: 700, marginBottom: 8 }}>
                        {artist.monthlyListeners} Listeners
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: '1.4', height: 44, overflow: 'hidden' }}>{artist.bio}</div>
                    </div>

                    <button 
                      style={{
                        marginTop: 4,
                        padding: '6px 16px',
                        borderRadius: 20,
                        border: '1px solid var(--border)',
                        background: 'rgba(255, 255, 255, 0.03)',
                        color: 'var(--text-bright)',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = 'var(--purple)'; e.currentTarget.style.borderColor = 'var(--purple)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                    >
                      View Profile
                    </button>
                  </div>
                );
              })}
              {filteredArtists.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No singers match your search.
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Side Panel: Spotify Turntable & Audio visualizer Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
          
          <div className="card" style={{ 
            padding: '24px 20px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center', 
            gap: 18,
            background: 'rgba(255, 255, 255, 0.015)',
            border: '1px solid var(--border-hi)',
            borderRadius: 16,
            backdropFilter: 'blur(8px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            
            {/* Spinning Vinyl Record Visual */}
            <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div 
                style={{
                  width: 190, height: 190, borderRadius: '50%',
                  backgroundImage: 'radial-gradient(circle, #09090b 20%, #202024 21%, #09090b 35%, #18181c 50%, #000 80%)',
                  boxShadow: playing ? '0 12px 36px rgba(0, 229, 255, 0.25), 0 0 20px rgba(0, 229, 255, 0.15)' : '0 8px 24px rgba(0,0,0,0.4)',
                  animation: playing ? 'spin 12s linear infinite' : 'none',
                  position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'box-shadow 0.3s'
                }}
              >
                {/* Grooves */}
                <div style={{ position: 'absolute', inset: 26, borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.06)' }} />
                <div style={{ position: 'absolute', inset: 48, borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.06)' }} />
                <div style={{ position: 'absolute', inset: 70, borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.06)' }} />
                
                {/* Album Cover Center */}
                <div style={{ width: 66, height: 66, borderRadius: '50%', overflow: 'hidden', border: '4px solid #000', zIndex: 2 }}>
                  <img src={currentTrack?.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                {/* Center Spindle Hole */}
                <div style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', zIndex: 3 }} />
              </div>
            </div>

            {/* Now Playing Title & Description */}
            <div style={{ width: '100%' }}>
              <div style={{ fontSize: 10, color: 'var(--cyan)', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>NOW PLAYING</div>
              <h2 style={{ fontSize: 16, color: 'var(--text-bright)', fontWeight: 800, margin: '0 0 4px 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {currentTrack?.name}
              </h2>
              <p style={{ fontSize: 11, color: 'var(--purple)', margin: '0 0 6px 0', fontWeight: 600 }}>
                {currentTrack?.artist || currentTrack?.host || 'NEXUS Studio'}
              </p>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0, height: 32, overflow: 'hidden', lineHeight: '1.4' }}>
                {currentTrack?.desc || 'Enjoy focus loops.'}
              </p>
            </div>

            {/* Bouncing Visualizer Waves */}
            <div style={{ display: 'flex', gap: 3, height: 32, alignItems: 'flex-end', justifyContent: 'center', width: '100%', padding: '0 10px' }}>
              {Array.from({ length: 18 }).map((_, i) => (
                <div 
                  key={i} 
                  style={{
                    width: 3, 
                    height: playing ? 6 + Math.random() * 26 : 4,
                    background: i % 2 === 0 ? 'var(--cyan)' : 'var(--purple)',
                    borderRadius: 1.5,
                    animation: playing ? `equalise${(i % 4) + 1} ${0.4 + Math.random() * 0.4}s ease-in-out infinite alternate` : 'none',
                    transition: 'height 0.3s'
                  }} 
                />
              ))}
            </div>

          </div>

          {/* Quick Stats panel */}
          <div className="card" style={{ padding: 14, background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-bright)' }}>🧠 Focus Statistics</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)' }}>
              <span>Tracks in Library</span>
              <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>157 items</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)' }}>
              <span>Streaming Servers</span>
              <span style={{ color: 'var(--purple)', fontWeight: 600 }}>Operational</span>
            </div>
          </div>

        </div>

      </div>

      {/* Spotify Bottom Sticky Control bar */}
      <div 
        className="card"
        style={{
          marginTop: 20,
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(11, 15, 25, 0.85)',
          backdropFilter: 'blur(24px)',
          border: '1px solid var(--border-hi)',
          borderRadius: 16,
          boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
          flexShrink: 0,
          zIndex: 90
        }}
      >
        {/* Track Info (Left) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 240, overflow: 'hidden' }}>
          <img 
            src={currentTrack?.cover} 
            alt="" 
            style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0, animation: playing ? 'spin 18s linear infinite' : 'none' }} 
          />
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 2, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {currentTrack?.name}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {currentTrack?.artist || currentTrack?.host || 'NEXUS Focus Radio'}
            </div>
          </div>
        </div>

        {/* Playback Controls & Progress Bar (Center) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1, maxWidth: 500 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Prev Track */}
            <button 
              onClick={handlePrevTrack}
              disabled={currentTrack?.isLive}
              style={{ background: 'none', border: 'none', color: currentTrack?.isLive ? 'rgba(255,255,255,0.05)' : 'var(--text-muted)', cursor: currentTrack?.isLive ? 'default' : 'pointer', fontSize: 16 }}
              title="Previous Track"
            >
              ⏮
            </button>
            
            {/* Play/Pause */}
            <button 
              onClick={handlePlayToggle}
              style={{
                background: 'var(--text-bright)', border: 'none', borderRadius: '50%',
                width: 36, height: 36, cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#000',
                boxShadow: playing ? '0 0 14px var(--cyan)' : 'none',
                transform: 'scale(1)', transition: 'transform 0.15s ease'
              }}
              title={playing ? 'Pause' : 'Play'}
            >
              {playing ? '⏸' : '▶'}
            </button>

            {/* Next Track */}
            <button 
              onClick={handleNextTrack}
              disabled={currentTrack?.isLive}
              style={{ background: 'none', border: 'none', color: currentTrack?.isLive ? 'rgba(255,255,255,0.05)' : 'var(--text-muted)', cursor: currentTrack?.isLive ? 'default' : 'pointer', fontSize: 16 }}
              title="Next Track"
            >
              ⏭
            </button>
          </div>

          {/* Progress Seek Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
            {currentTrack?.isLive ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)', animation: 'fadeIn 0.5s infinite alternate' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--cyan)', letterSpacing: 1 }}>LIVE BROADCASTING STREAM</span>
              </div>
            ) : (
              <>
                <span ref={elapsedSpanRef} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', width: 34 }}>00:00</span>
                <div 
                  style={{
                    flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2,
                    cursor: 'pointer', position: 'relative'
                  }}
                  onClick={handleProgressClick}
                >
                  <div 
                    ref={progressLineRef}
                    style={{
                      height: '100%', 
                      width: '0%', 
                      background: 'var(--cyan)', 
                      borderRadius: 2,
                      boxShadow: '0 0 6px var(--cyan)',
                      transition: 'width 0.1s linear'
                    }} 
                  />
                </div>
                <span ref={remainingSpanRef} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', width: 34, textAlign: 'right' }}>{currentTrack?.duration || '00:00'}</span>
              </>
            )}
          </div>
        </div>

        {/* Volume Level Controls (Right) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 240, justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {volume === 0 ? '🔇' : volume < 0.4 ? '🔉' : '🔊'}
          </span>
          <input 
            type="range" min="0" max="1" step="0.05"
            value={volume}
            onChange={(e) => {
              const val = Number(e.target.value);
              setVolume(val);
              localStorage.setItem('nexus_music_volume', val.toString());
            }}
            style={{ width: 85, accentColor: 'var(--cyan)', cursor: 'pointer', height: 4 }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', width: 32, textAlign: 'right' }}>
            {Math.round(volume * 100)}%
          </span>
        </div>

      </div>

      {/* MODAL OVERLAY 1: Playlist & Album Tracks Browser */}
      {selectedPlaylist && (
        <div 
          className="modal-overlay"
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(20px)',
            zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20
          }}
        >
          <div 
            className="modal-content-box"
            style={{
              width: '100%',
              maxWidth: 620,
              maxHeight: '85%',
              background: 'var(--surface)',
              border: '1px solid var(--border-hi)',
              borderRadius: 16,
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 16, alignItems: 'center', position: 'relative' }}>
              <img 
                src={selectedPlaylist.cover} 
                alt="" 
                style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }} 
              />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 10, background: 'rgba(0, 229, 255, 0.12)', color: 'var(--cyan)', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>
                  {selectedPlaylist.isAlbum ? '📀 OFFICIAL ALBUM' : '💿 NEXUS PLAYLIST'}
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-bright)', margin: '4px 0 2px 0' }}>{selectedPlaylist.name}</h3>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{selectedPlaylist.desc}</p>
              </div>

              {/* Close X */}
              <button 
                onClick={() => setSelectedPlaylist(null)}
                style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                  color: 'var(--text-muted)', width: 28, height: 28, borderRadius: '50%',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14
                }}
                onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#fff'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                ×
              </button>
            </div>

            {/* Modal Songs Playlist Scrollable list */}
            <div className="lofi-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {selectedPlaylist.trackIds.map((trackId, index) => {
                  const song = songs.find(s => s.id === trackId);
                  if (!song) return null;
                  const isActive = currentTrack?.id === song.id;
                  const isPlayingNow = isTrackPlaying(song.id);

                  return (
                    <div 
                      key={song.id}
                      onClick={() => handleTrackChange(song)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 14px', borderRadius: 8,
                        background: isActive ? 'rgba(0, 229, 255, 0.05)' : 'rgba(255,255,255,0.01)',
                        border: isActive ? '1px solid var(--cyan)' : '1px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseOut={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; }}
                    >
                      {/* Track index / Active Indicator */}
                      <span style={{ fontSize: 11, color: isActive ? 'var(--cyan)' : 'var(--text-muted)', width: 20, textAlign: 'center', fontWeight: 600 }}>
                        {isActive ? (isPlayingNow ? '🔊' : '⏸') : (index + 1)}
                      </span>

                      {/* Song Title & Description */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? 'var(--cyan)' : 'var(--text-bright)' }}>{song.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{song.artist}</div>
                      </div>

                      {/* Info & Duration */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: 4 }}>
                          MP3 CDN
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{song.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button 
                onClick={() => setSelectedPlaylist(null)}
                style={{
                  padding: '8px 16px', borderRadius: 20, border: '1px solid var(--border)',
                  background: 'none', color: 'var(--text-bright)', fontSize: 12, cursor: 'pointer'
                }}
              >
                Close Playlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL OVERLAY 2: Singer Profile detailed view */}
      {selectedArtist && (
        <div 
          className="modal-overlay"
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(20px)',
            zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20
          }}
        >
          <div 
            className="modal-content-box"
            style={{
              width: '100%',
              maxWidth: 620,
              maxHeight: '85%',
              background: 'var(--surface)',
              border: '1px solid var(--border-hi)',
              borderRadius: 16,
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Modal Banner Area */}
            <div style={{ padding: '24px 28px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(0, 229, 255, 0.05) 100%)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 20, alignItems: 'center', position: 'relative' }}>
              
              {/* Big Circular Avatar */}
              <div style={{ width: 90, height: 90, borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--purple)', boxShadow: '0 4px 16px rgba(168,85,247,0.3)', flexShrink: 0 }}>
                <img src={selectedArtist.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 10, background: 'var(--purple)', color: '#fff', padding: '2px 8px', borderRadius: 10, fontWeight: 700, letterSpacing: 0.5 }}>
                  VERIFIED LOFI ARTIST
                </span>
                <h3 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: '4px 0 6px 0', letterSpacing: -0.5 }}>{selectedArtist.name}</h3>
                
                <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)' }}>
                  <span>🎧 <strong style={{ color: 'var(--cyan)' }}>{selectedArtist.monthlyListeners}</strong> monthly listeners</span>
                  <span>👥 <strong style={{ color: 'var(--purple)' }}>{selectedArtist.followers}</strong> followers</span>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setSelectedArtist(null)}
                style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                  color: 'var(--text-muted)', width: 28, height: 28, borderRadius: '50%',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14
                }}
                onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#fff'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                ×
              </button>
            </div>

            {/* Biography & Singer Tracks list */}
            <div className="lofi-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Bio description */}
              <div>
                <h4 style={{ fontSize: 12, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 6px 0', fontWeight: 700 }}>About</h4>
                <p style={{ fontSize: 12, color: 'var(--text-bright)', margin: 0, lineHeight: '1.6', background: 'rgba(255,255,255,0.01)', padding: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.03)' }}>
                  {selectedArtist.bio}
                </p>
              </div>

              {/* Popular Tracks by Artist */}
              <div>
                <h4 style={{ fontSize: 12, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 10px 0', fontWeight: 700 }}>Popular Focus Tracks</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {songs
                    .filter(s => s.artistId === selectedArtist.id || s.artist === selectedArtist.name)
                    .slice(0, 6) // List up to 6 tracks
                    .map((song, index) => {
                      const isActive = currentTrack?.id === song.id;
                      const isPlayingNow = isTrackPlaying(song.id);

                      return (
                        <div 
                          key={song.id}
                          onClick={() => handleTrackChange(song)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '10px 14px', borderRadius: 8,
                            background: isActive ? 'rgba(0, 229, 255, 0.05)' : 'rgba(255,255,255,0.01)',
                            border: isActive ? '1px solid var(--cyan)' : '1px solid transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                          onMouseOut={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; }}
                        >
                          <span style={{ fontSize: 11, color: isActive ? 'var(--cyan)' : 'var(--text-muted)', width: 20, textAlign: 'center', fontWeight: 600 }}>
                            {isActive ? (isPlayingNow ? '🔊' : '⏸') : (index + 1)}
                          </span>

                          <img src={song.cover} alt="" style={{ width: 32, height: 32, borderRadius: 4, objectFit: 'cover' }} />

                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? 'var(--cyan)' : 'var(--text-bright)' }}>{song.name}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{song.desc}</div>
                          </div>

                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{song.duration}</span>
                        </div>
                      );
                    })}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setSelectedArtist(null)}
                style={{
                  padding: '8px 20px', borderRadius: 20, border: '1px solid var(--border)',
                  background: 'none', color: 'var(--text-bright)', fontSize: 12, cursor: 'pointer'
                }}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
