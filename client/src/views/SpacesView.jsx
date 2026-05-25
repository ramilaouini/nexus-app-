import React, { useState } from 'react';
import './Spaces2D.css';

const SPACES = [
  { id: 'forest', title: 'Druid Forest', desc: 'A serene ancient woods focusing on natural calm.', color1: '#1a4d2e', color2: '#a8e6cf' },
  { id: 'cyber', title: 'Neon Grid', desc: 'A high-tech digital zone for intense coding.', color1: '#0f0f1a', color2: '#ff00ff' },
  { id: 'cosmic', title: 'Void Core', desc: 'Float in the abyss of maximum concentration.', color1: '#000000', color2: '#4a00e0' },
  { id: 'desert', title: 'Endless Dunes', desc: 'Vast golden sands under an amber sky.', color1: '#8b4513', color2: '#ffa500' },
  { id: 'ocean', title: 'Deep Abyss', desc: 'Underwater tranquility with floating bioluminescence.', color1: '#001133', color2: '#004466' },
  { id: 'crystal', title: 'Crystal Cavern', desc: 'Pitch black dotted with giant glowing amethysts.', color1: '#1a0033', color2: '#a855f7' },
  { id: 'volcano', title: 'Molten Core', desc: 'Red hot ash and cinder for intense sessions.', color1: '#330000', color2: '#ff4500' },
  { id: 'sky', title: 'Sky Kingdom', desc: 'Platforms floating high among majestic clouds.', color1: '#87ceeb', color2: '#ffffff' },
  { id: 'winter', title: 'Silent Tundra', desc: 'Endless white snow and absolute freezing silence.', color1: '#b0e0e6', color2: '#f0ffff' },
  { id: 'ruins', title: 'Ancient Monuments', desc: 'Lost civilization pillars bathing in golden hour light.', color1: '#cd853f', color2: '#ffd700' },
  { id: 'abstract', title: 'Abstract Realm', desc: 'Bizarre geometries defying logic.', color1: '#111111', color2: '#ff00ff' },
  { id: 'zen', title: 'Zen Sakura', desc: 'Pink cherry blossom paradise.', color1: '#ffb7c5', color2: '#ff69b4' },
  { id: 'synth', title: 'Synthwave Matrix', desc: 'Retro 80s outrun vaporwave simulation.', color1: '#2a0033', color2: '#ff00ff' }
];

export default function SpacesView() {
  const [activeSpace, setActiveSpace] = useState(null);

  if (activeSpace) {
    const space = SPACES.find(s => s.id === activeSpace);
    return (
      <div className="space-2d-container" style={{ '--color1': space.color1, '--color2': space.color2 }}>
        <button className='btn exit-btn' onClick={() => setActiveSpace(null)}>← Exit Space</button>
        
        <div className="space-2d-background">
          <div className="layer layer-1"></div>
          <div className="layer layer-2"></div>
          <div className="layer layer-3"></div>
        </div>

        <div className="space-2d-content">
          <h2 className="space-title">{space.title}</h2>
          <p className="space-desc">{space.desc}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='view-container' style={{ padding: '40px', height: '100%', overflowY: 'auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', margin: 0, color: 'var(--text-bright)' }}>Multiverse Hub</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>13 Massive endless worlds. Dive into animated 2D themes for deep focus.</p>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
        {SPACES.map(space => (
          <div key={space.id} className='card' onClick={() => setActiveSpace(space.id)} style={{ padding: '25px', borderRadius: '24px', background: `linear-gradient(135deg, ${space.color1} 0%, rgba(0,0,0,0.8) 100%)`, border: `1px solid ${space.color2}`, cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s', position: 'relative', overflow: 'hidden' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: '0 0 10px 0', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{space.title}</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{space.desc}</p>
            <button className='btn' style={{ width: '100%', marginTop: '20px', background: space.color2, color: '#fff', border: 'none' }}>ENTER</button>
          </div>
        ))}
      </div>
    </div>
  );
}

