import { useState } from 'react';

const HUBS = [
  { id: 'tunis', name: 'Tunis Hub (ESPRIT Campus)', coords: { x: 340, y: 110 }, activeCount: 142, averageFocus: '138 mins', course: 'C++ & Compilers', flag: '🇹🇳', color: 'var(--cyan)' },
  { id: 'new_york', name: 'New York City Node', coords: { x: 140, y: 100 }, activeCount: 89, averageFocus: '112 mins', course: 'React SPA layouts', flag: '🇺🇸', color: 'var(--purple)' },
  { id: 'paris', name: 'Paris Node', coords: { x: 310, y: 80 }, activeCount: 74, averageFocus: '124 mins', course: 'Relational SQL procedural', flag: '🇫🇷', color: 'var(--green)' },
  { id: 'tokyo', name: 'Tokyo Node', coords: { x: 520, y: 120 }, activeCount: 56, averageFocus: '145 mins', course: 'Embedded Robotics', flag: '🇯🇵', color: '#ec4899' },
  { id: 'london', name: 'London Node', coords: { x: 300, y: 70 }, activeCount: 63, averageFocus: '118 mins', course: 'Algorithms theory', flag: '🇬🇧', color: '#3b82f6' }
];

export default function MapView() {
  const [selectedHub, setSelectedHub] = useState(HUBS[0]);

  return (
    <div className="view" style={{ overflowY: 'auto' }}>
      
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div className="page-eyebrow">Knowledge OS · Global Network</div>
        <h1 className="page-title">🗺️ Live Cyber Dark World Map</h1>
        <p className="page-subtitle">Pulsing coordinate nodes visualize concurrent computer engineering students active across the global study network.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, paddingBottom: 40 }}>
        
        {/* Left Column: Cyber Dark World Map */}
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14, background: 'rgba(5, 8, 16, 0.95)', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1 }}>📡 REAL-TIME CYBER GLOBAL RADAR</span>
          
          <div style={{ position: 'relative', width: '100%', height: 320, background: '#070c17', borderRadius: 16, border: '1px solid rgba(255,255,255,0.03)', overflow: 'hidden' }}>
            
            {/* World Grid Dotted Map SVG Background */}
            <svg width="100%" height="100%" viewBox="0 0 600 300" style={{ opacity: 0.25 }}>
              {/* Dotted futuristic grid lines */}
              <defs>
                <pattern id="grid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                  <circle cx="7.5" cy="7.5" r="0.8" fill="rgba(0, 229, 255, 0.25)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Styled Abstract Continent Polygons (Futuristic matrix outline) */}
              <polygon points="50,60 120,40 180,80 200,120 180,180 120,160 80,110" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <polygon points="120,160 150,180 180,240 160,280 130,280 100,210" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <polygon points="260,50 320,30 380,50 440,90 400,160 330,130 280,100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <polygon points="310,130 340,160 380,240 350,280 300,280 280,190" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <polygon points="440,90 490,100 550,110 570,160 520,180 470,140" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            </svg>

            {/* Glowing Pulsing Interactive Nodes */}
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
                  {/* Concentric pulsing waves */}
                  <div style={{ 
                    position: 'absolute', width: 24, height: 24, borderRadius: '50%',
                    background: hub.color, opacity: 0.2, transform: 'scale(1.8)',
                    animation: 'pulse 2s infinite'
                  }} />
                  
                  {/* Core glowing dot */}
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

        {/* Right Column: Node Details card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {selectedHub && (
            <div className="card animate-fade-in" style={{ padding: 24, borderLeft: `4px solid ${selectedHub.color}`, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 32 }}>{selectedHub.flag}</span>
                <div>
                  <h2 style={{ fontSize: 16, color: '#fff', fontWeight: 850 }}>{selectedHub.name}</h2>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Status: Active 📡</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 2 }}>Concurrent Students</div>
                  <strong style={{ fontSize: 15, color: selectedHub.color }}>⚡ {selectedHub.activeCount} Studying</strong>
                </div>

                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 2 }}>Average Session Duration</div>
                  <strong style={{ fontSize: 14, color: '#fff' }}>⏱️ {selectedHub.averageFocus}</strong>
                </div>

                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 2 }}>Dominant Focus Course</div>
                  <span className="badge badge-purple" style={{ fontSize: 9 }}>{selectedHub.course}</span>
                </div>
              </div>

              <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
                Concurrently tracking global study telemetry nodes.
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
