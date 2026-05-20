import { useState, useRef } from 'react';
import { MEDIA_CATALOG } from './CinemaData';

export default function CinemaView() {
  const [highlightedMedia, setHighlightedMedia] = useState(MEDIA_CATALOG[0]);
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  
  const categories = ['Movies', 'Anime', 'Cartoons'];

  const handlePlayMovie = () => {
    if (highlightedMedia.type === 'movie') {
      setActiveVideoUrl(highlightedMedia.url);
    }
  };

  const handlePlayEpisode = (url) => {
    setActiveVideoUrl(url);
  };

  const closePlayer = () => {
    setActiveVideoUrl(null);
  };

  return (
    <div className="view cinema-view" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#111', overflowY: 'auto' }}>
      
      {/* Hero Banner Area */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '65vh',
        backgroundImage: `url(${highlightedMedia.backdrop || highlightedMedia.poster})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        flexShrink: 0
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, #111 0%, rgba(17, 17, 17, 0.5) 50%, transparent 100%), linear-gradient(to right, #111 0%, rgba(17,17,17,0.4) 100%)'
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '4%',
          maxWidth: '600px',
          zIndex: 2,
          padding: '24px'
        }}>
          <div style={{ fontSize: 13, color: 'var(--cyan)', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
            {highlightedMedia.category}
          </div>
          <h1 style={{ fontSize: 48, margin: '0 0 16px 0', fontWeight: 900, color: 'var(--text-bright)', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            {highlightedMedia.title}
          </h1>
          <p style={{ color: '#ddd', fontSize: 16, lineHeight: 1.5, marginBottom: 24, textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
            {highlightedMedia.desc}
          </p>
          
          {highlightedMedia.type === 'movie' ? (
            <button
              onClick={handlePlayMovie}
              style={{
                padding: '12px 32px', background: 'var(--cyan)', color: '#000',
                border: 'none', borderRadius: 8, cursor: 'pointer',
                fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(0, 229, 255, 0.4)'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              ▶ PLAY MOVIE
            </button>
          ) : (
            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ margin: '0 0 12px 0', color: 'var(--cyan)' }}>Episodes</h3>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                {highlightedMedia.seasons && highlightedMedia.seasons[0].episodes.map(ep => (
                  <button
                    key={ep.epNum}
                    onClick={() => handlePlayEpisode(ep.url)}
                    style={{
                      padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-bright)',
                      border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, cursor: 'pointer',
                      whiteSpace: 'nowrap', fontWeight: 600, transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'var(--cyan)'; e.currentTarget.style.color = '#000'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-bright)'; }}
                  >
                    Ep {ep.epNum}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Category Rows Area */}
      <div style={{ padding: '0 4%', marginTop: '-40px', position: 'relative', zIndex: 3, flex: '1 0 auto', paddingBottom: '40px' }}>
        {categories.map(cat => {
          const items = MEDIA_CATALOG.filter(m => m.category === cat);
          if (items.length === 0) return null;
          
          return (
            <div key={cat} style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 16 }}>
                {cat}
              </h2>
              <div style={{ 
                display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16,
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}>
                <style>{`
                  ::-webkit-scrollbar { display: none; }
                `}</style>
                {items.map(media => (
                  <div
                    key={media.id}
                    onClick={() => {
                      setHighlightedMedia(media);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      minWidth: '200px', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      borderRadius: 8, overflow: 'hidden', position: 'relative',
                      border: highlightedMedia.id === media.id ? '2px solid var(--cyan)' : '2px solid transparent'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    <img src={media.poster} alt={media.title} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Video Player Modal */}
      {activeVideoUrl && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: '#000', display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end', background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)', position: 'absolute', top: 0, width: '100%', zIndex: 10000, boxSizing: 'border-box' }}>
            <button
              onClick={closePlayer}
              style={{
                background: 'rgba(255,0,0,0.8)', color: '#fff', border: 'none', borderRadius: '50%',
                width: 40, height: 40, cursor: 'pointer', fontSize: 20, fontWeight: 'bold',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
          <iframe 
            src={activeVideoUrl} 
            allowFullScreen
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-presentation"
            style={{ width: '100%', height: '100%', border: 'none', flexGrow: 1 }}
          />
        </div>
      )}
      
    </div>
  );
}
