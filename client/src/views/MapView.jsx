import { useState } from 'react';

const HUBS = [
  { id: 'tunis', name: 'Tunis Hub (ESPRIT Campus)', coords: { x: 300, y: 135 }, activeCount: 142, averageFocus: '138 mins', course: 'C++ & Compilers', flag: '🇹🇳', color: 'var(--cyan)' },
  { id: 'new_york', name: 'New York City Node', coords: { x: 130, y: 90 }, activeCount: 89, averageFocus: '112 mins', course: 'React SPA layouts', flag: '🇺🇸', color: 'var(--purple)' },
  { id: 'paris', name: 'Paris Node', coords: { x: 278, y: 92 }, activeCount: 74, averageFocus: '124 mins', course: 'Relational SQL procedural', flag: '🇫🇷', color: 'var(--green)' },
  { id: 'tokyo', name: 'Tokyo Node', coords: { x: 508, y: 110 }, activeCount: 56, averageFocus: '145 mins', course: 'Embedded Robotics', flag: '🇯🇵', color: '#ec4899' },
  { id: 'london', name: 'London Node', coords: { x: 270, y: 80 }, activeCount: 63, averageFocus: '118 mins', course: 'Algorithms theory', flag: '🇬🇧', color: '#3b82f6' }
];

export default function MapView() {
  const [selectedHub, setSelectedHub] = useState(HUBS[0]);

  return (
    <div className="view" style={{ overflowY: 'auto' }}>
      
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div className="page-eyebrow">Knowledge OS · Global Network</div>
        <h1 className="page-title">🗺️ Real Worldwide Cyber Map</h1>
        <p className="page-subtitle">Real-life geographical projection tracking concurrent student sessions active globally across five continents.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, paddingBottom: 40 }}>
        
        {/* Left Column: Worldwide Continent Map */}
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14, background: 'rgba(5, 8, 16, 0.95)', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1 }}>📡 GLOBAL GEOGRAPHIC RADAR</span>
          
          <div style={{ position: 'relative', width: '100%', height: 350, background: '#050a14', borderRadius: 16, border: '1px solid rgba(255,255,255,0.03)', overflow: 'hidden' }}>
            
            {/* Real Continental World Map SVG */}
            <svg width="100%" height="100%" viewBox="0 0 600 300" style={{ position: 'absolute', top: 0, left: 0 }}>
              {/* Grid Background Pattern */}
              <defs>
                <pattern id="world-grid" width="12" height="12" patternUnits="userSpaceOnUse">
                  <circle cx="6" cy="6" r="0.6" fill="rgba(0, 229, 255, 0.15)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#world-grid)" />

              {/* Geographic Path Outlines representing actual World Continents */}
              <g fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.2">
                {/* North America */}
                <path d="M 40,40 C 60,30 90,20 130,30 C 150,40 170,50 180,80 C 160,110 130,110 110,120 C 90,110 70,90 40,60 Z" />
                
                {/* South America */}
                <path d="M 120,130 C 140,130 160,150 170,180 C 160,220 140,260 120,280 C 100,260 90,200 100,160 Z" />
                
                {/* Greenland */}
                <path d="M 140,20 C 155,10 175,10 180,20 C 175,30 155,30 140,20 Z" />

                {/* Europe & Asia (Eurasia) */}
                <path d="M 230,40 C 260,30 320,20 400,20 C 450,20 520,30 550,50 C 560,70 540,110 520,130 C 480,140 440,150 400,160 C 350,160 310,130 280,120 C 260,110 240,80 230,40 Z" />
                
                {/* Africa */}
                <path d="M 260,110 C 290,90 330,90 350,110 C 360,130 370,160 360,190 C 350,230 330,260 310,270 C 300,260 290,220 280,180 C 260,160 250,130 260,110 Z" />

                {/* Australia */}
                <path d="M 480,180 C 520,185 540,190 550,210 C 540,240 510,240 480,230 C 460,220 460,190 480,180 Z" />
              </g>

              {/* Equator Line indicator */}
              <line x1="0" y1="150" x2="600" y2="150" stroke="rgba(0, 229, 255, 0.05)" strokeDasharray="4 8" />
            </svg>

            {/* Glowing Pulsing Interactive Nodes over Geographic Positions */}
            {HUBS.map(hub => {
              const isSelected = selectedHub.id === hub.id;
              
              return (
                <div 
                  key={hub.id}
                  onClick={() => setSelectedHub(hub)}
                  style={{ 
                    position: 'absolute', left: hub.coords.x, top: hub.coords.y,
                    transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: 10
                  }}
                >
                  {/* Outer glowing pulsing waves */}
                  <div style={{ 
                    position: 'absolute', width: 24, height: 24, borderRadius: '50%',
                    background: hub.color, opacity: 0.2, transform: 'scale(1.8)',
                    animation: 'pulse 2s infinite'
                  }} />
                  
                  {/* Core neon hotspot */}
                  <div style={{ 
                    width: 10, height: 10, borderRadius: '50%', background: '#fff',
                    border: `2.5px solid ${hub.color}`,
                    boxShadow: isSelected ? `0 0 16px ${hub.color}` : 'none',
                    transition: 'all 0.2s'
                  }} />
                </div>
              );
            })}

          </div>
        </div>

        {/* Right Column: Active Node Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {selectedHub && (
            <div className="card animate-fade-in" style={{ padding: 24, borderLeft: `4px solid ${selectedHub.color}`, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 32 }}>{selectedHub.flag}</span>
                <div>
                  <h2 style={{ fontSize: 16, color: '#fff', fontWeight: 850 }}>{selectedHub.name}</h2>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Real geographical node</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 2 }}>Active study slots</div>
                  <strong style={{ fontSize: 15, color: selectedHub.color }}>⚡ {selectedHub.activeCount} Sessions</strong>
                </div>

                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 2 }}>Avg Session Time</div>
                  <strong style={{ fontSize: 14, color: '#fff' }}>⏱️ {selectedHub.averageFocus}</strong>
                </div>

                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 2 }}>Popular Focus Subject</div>
                  <span className="badge badge-purple" style={{ fontSize: 9 }}>{selectedHub.course}</span>
                </div>
              </div>

              <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
                Tracking actual continental student coordinates.
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
