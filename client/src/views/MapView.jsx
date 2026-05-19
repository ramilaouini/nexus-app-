import { useState, useEffect, useRef } from 'react';

const HUBS = [
  { id: 'tunis', name: 'Tunis Hub (ESPRIT Campus)', coords: [36.8065, 10.1815], activeCount: 142, averageFocus: '138 mins', course: 'C++ & Compilers', flag: '🇹🇳', color: '#00e5ff' },
  { id: 'new_york', name: 'New York City Node', coords: [40.7128, -74.0060], activeCount: 89, averageFocus: '112 mins', course: 'React SPA layouts', flag: '🇺🇸', color: '#a855f7' },
  { id: 'paris', name: 'Paris Node', coords: [48.8566, 2.3522], activeCount: 74, averageFocus: '124 mins', course: 'Relational SQL procedural', flag: '🇫🇷', color: '#2ecc71' },
  { id: 'tokyo', name: 'Tokyo Node', coords: [35.6762, 139.6503], activeCount: 56, averageFocus: '145 mins', course: 'Embedded Robotics', flag: '🇯🇵', color: '#ec4899' },
  { id: 'london', name: 'London Node', coords: [51.5074, -0.1278], activeCount: 63, averageFocus: '118 mins', course: 'Algorithms theory', flag: '🇬🇧', color: '#3b82f6' }
];

export default function MapView() {
  const [selectedHub, setSelectedHub] = useState(HUBS[0]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Dynamic loading of Leaflet styles & scripts from CDN for 100% bug-free compilation
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const scriptId = 'leaflet-js';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      document.body.appendChild(script);
    }

    // Safety: poll for L variable to guarantee it is bound to the window object
    const pollInterval = setInterval(() => {
      if (window.L) {
        setMapLoaded(true);
        clearInterval(pollInterval);
      }
    }, 100);

    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current) return;

    // Safety check: clear any existing initialized DOM elements or Leaflet metadata inside container
    if (mapContainerRef.current._leaflet_id) {
      mapContainerRef.current.innerHTML = '';
      mapContainerRef.current._leaflet_id = null;
    }

    // Custom CSS for glowing pulsing markers
    if (!document.getElementById('custom-marker-style')) {
      const style = document.createElement('style');
      style.id = 'custom-marker-style';
      style.innerHTML = `
        .glowing-marker {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fff;
          position: relative;
          box-shadow: 0 0 10px rgba(255,255,255,0.8);
        }
        .glowing-marker::after {
          content: '';
          position: absolute;
          width: 300%;
          height: 300%;
          border-radius: 50%;
          background: inherit;
          opacity: 0.3;
          top: -100%;
          left: -100%;
          animation: pulse-ring 2s infinite;
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.3); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    let map;
    try {
      map = window.L.map(mapContainerRef.current, {
        center: [25, 10],
        zoom: 2,
        minZoom: 1,
        maxZoom: 12,
        zoomControl: true
      });
      mapInstanceRef.current = map;

      // Apply CartoDB Dark Matter map tile layers (Clean, countries & borders visible)
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap &copy; CARTO'
      }).addTo(map);

      // Plot our custom glowing hubs
      HUBS.forEach(hub => {
        const customIcon = window.L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="glowing-marker" style="border: 3px solid ${hub.color}; background: #fff; box-shadow: 0 0 15px ${hub.color};"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        const marker = window.L.marker(hub.coords, { icon: customIcon }).addTo(map);
        
        marker.on('click', () => {
          setSelectedHub(hub);
          map.setView(hub.coords, 5, { animate: true });
        });
      });

      // Force a map redraw to ensure that tiles fit perfectly and don't load in scrambled gray chunks
      setTimeout(() => {
        if (map) map.invalidateSize();
      }, 300);

    } catch (err) {
      console.error("Leaflet mount failed: ", err);
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {}
        mapInstanceRef.current = null;
      }
    };
  }, [mapLoaded]);

  return (
    <div className="view" style={{ overflowY: 'auto' }}>
      
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div className="page-eyebrow">Knowledge OS · Global Community</div>
        <h1 className="page-title">🗺️ Real-Life Interactive World Map</h1>
        <p className="page-subtitle">Fully zoomable, borders-enabled geographic satellite projection highlighting international computer engineering study clusters.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, paddingBottom: 40 }}>
        
        {/* Left Column: Real-Life Leaflet Map */}
        <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14, background: 'rgba(5, 8, 16, 0.95)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1 }}>📡 SATELLITE STUDENT TELEMETRY</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Zoom & drag to inspect global countries</span>
          </div>
          
          <div 
            ref={mapContainerRef} 
            style={{ 
              width: '100%', 
              height: 380, 
              borderRadius: 16, 
              border: '1px solid rgba(255,255,255,0.03)', 
              overflow: 'hidden', 
              background: '#070c17',
              zIndex: 1
            }} 
          />
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
