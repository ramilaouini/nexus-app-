import { useState, useEffect, useRef } from 'react';
import { api } from '../api';

const MODES = {
  focus: { label: 'FOCUS', duration: 25 * 60, color: 'var(--cyan)',   shadow: 'var(--cyan-glow)' },
  short: { label: 'SHORT BREAK', duration: 5 * 60,  color: 'var(--green)',  shadow: 'rgba(0,230,118,0.35)' },
  long:  { label: 'LONG BREAK',  duration: 15 * 60, color: 'var(--purple)', shadow: 'rgba(168,85,247,0.35)' },
};

const RADIUS = 105;
const CIRC   = 2 * Math.PI * RADIUS; // 659.7

const SOUNDSCAPES = [
  { id: 'rain', name: '🌧️ Gentle Rain' },
  { id: 'fireplace', name: '🔥 Cozy Fireplace' },
  { id: 'waves', name: '🌊 Ocean Waves' },
  { id: 'forest', name: '🌲 Forest & Birds' },
  { id: 'space', name: '🛸 Space Drone' }
];

// Caches for generated noise buffers
let cachedWhiteNoiseBuffer = null;
let cachedPinkNoiseBuffer = null;
let cachedBrownNoiseBuffer = null;

const getWhiteNoiseBuffer = (ctx) => {
  if (cachedWhiteNoiseBuffer) return cachedWhiteNoiseBuffer;
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  cachedWhiteNoiseBuffer = buffer;
  return buffer;
};

const getPinkNoiseBuffer = (ctx) => {
  if (cachedPinkNoiseBuffer) return cachedPinkNoiseBuffer;
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    data[i] *= 0.11; // normalise volume
    b6 = white * 0.115926;
  }
  cachedPinkNoiseBuffer = buffer;
  return buffer;
};

const getBrownNoiseBuffer = (ctx) => {
  if (cachedBrownNoiseBuffer) return cachedBrownNoiseBuffer;
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (lastOut + (0.02 * white)) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5; // normalise volume
  }
  cachedBrownNoiseBuffer = buffer;
  return buffer;
};

const triggerCrackle = (ctx, destination) => {
  if (!ctx || ctx.state === 'suspended') return;
  const source = ctx.createBufferSource();
  source.buffer = getWhiteNoiseBuffer(ctx);

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 7500;

  const gain = ctx.createGain();
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.012 * (Math.random() * 0.8 + 0.2), now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.008 + Math.random() * 0.02);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(now);
  source.stop(now + 0.05);
};

const triggerBirdChirp = (ctx, destination) => {
  if (!ctx || ctx.state === 'suspended') return;
  const now = ctx.currentTime;
  const chirpCount = Math.random() > 0.5 ? 2 : 1;
  let startTime = now;

  for (let i = 0; i < chirpCount; i++) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';

    const baseFreq = 2200 + Math.random() * 1200;
    osc.frequency.setValueAtTime(baseFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, startTime + 0.06);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, startTime + 0.13);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.015, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.13);

    osc.connect(gain);
    gain.connect(destination);
    osc.start(startTime);
    osc.stop(startTime + 0.15);

    startTime += 0.18 + Math.random() * 0.1;
  }
};

const startSynth = (soundId, ctx) => {
  const mainGain = ctx.createGain();
  mainGain.gain.value = 0; // set by handleVolumeChange
  mainGain.connect(ctx.destination);

  if (soundId === 'rain') {
    const source = ctx.createBufferSource();
    source.buffer = getPinkNoiseBuffer(ctx);
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1100;

    source.connect(filter);
    filter.connect(mainGain);
    source.start(0);

    return { source, filter, gainNode: mainGain };
  }

  if (soundId === 'fireplace') {
    // Low rumble
    const source = ctx.createBufferSource();
    source.buffer = getBrownNoiseBuffer(ctx);
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 180;

    source.connect(filter);
    filter.connect(mainGain);
    source.start(0);

    // Crackle trigger loop
    const crackleInterval = setInterval(() => {
      if (Math.random() < 0.35) {
        triggerCrackle(ctx, mainGain);
      }
    }, 110);

    return { source, filter, gainNode: mainGain, interval: crackleInterval };
  }

  if (soundId === 'waves') {
    const source = ctx.createBufferSource();
    source.buffer = getPinkNoiseBuffer(ctx);
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 350;

    const waveGain = ctx.createGain();
    waveGain.gain.value = 0.5;

    source.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(mainGain);
    source.start(0);

    // Filter sweep LFO
    const filterLfo = ctx.createOscillator();
    filterLfo.frequency.value = 0.1; 
    const filterLfoGain = ctx.createGain();
    filterLfoGain.gain.value = 200; 
    filterLfo.connect(filterLfoGain);
    filterLfoGain.connect(filter.frequency);
    filterLfo.start(0);

    // Volume sweep LFO
    const volLfo = ctx.createOscillator();
    volLfo.frequency.value = 0.1;
    const volLfoGain = ctx.createGain();
    volLfoGain.gain.value = 0.35; 
    volLfo.connect(volLfoGain);
    volLfoGain.connect(waveGain.gain);
    volLfo.start(0);

    return { 
      source, 
      filter, 
      gainNode: mainGain, 
      oscillators: [filterLfo, volLfo], 
      childNodes: [waveGain, filterLfoGain, volLfoGain] 
    };
  }

  if (soundId === 'forest') {
    const source = ctx.createBufferSource();
    source.buffer = getPinkNoiseBuffer(ctx);
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.0;
    filter.frequency.value = 500;

    source.connect(filter);
    filter.connect(mainGain);
    source.start(0);

    // Wind modulation
    const windLfo = ctx.createOscillator();
    windLfo.frequency.value = 0.07;
    const windLfoGain = ctx.createGain();
    windLfoGain.gain.value = 220;
    windLfo.connect(windLfoGain);
    windLfoGain.connect(filter.frequency);
    windLfo.start(0);

    // Bird chirping
    const birdInterval = setInterval(() => {
      if (Math.random() < 0.22) {
        triggerBirdChirp(ctx, mainGain);
      }
    }, 2000);

    return { 
      source, 
      filter, 
      gainNode: mainGain, 
      oscillators: [windLfo], 
      childNodes: [windLfoGain], 
      interval: birdInterval 
    };
  }

  if (soundId === 'space') {
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 65;

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = 97.8;

    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = 130.5;

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = getBrownNoiseBuffer(ctx);
    noiseSource.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 80;

    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = 180;

    // Cosmic sweep LFO
    const sweepLfo = ctx.createOscillator();
    sweepLfo.frequency.value = 0.04; 
    const sweepGain = ctx.createGain();
    sweepGain.gain.value = 25;
    sweepLfo.connect(sweepGain);
    sweepGain.connect(droneFilter.frequency);
    sweepLfo.start(0);

    osc1.connect(droneFilter);
    osc2.connect(droneFilter);
    osc3.connect(droneFilter);
    noiseSource.connect(noiseFilter);

    droneFilter.connect(mainGain);
    noiseFilter.connect(mainGain);

    osc1.start(0);
    osc2.start(0);
    osc3.start(0);
    noiseSource.start(0);

    return { 
      oscillators: [osc1, osc2, osc3, sweepLfo], 
      source: noiseSource, 
      gainNode: mainGain, 
      childNodes: [noiseFilter, droneFilter, sweepGain] 
    };
  }

  return { gainNode: mainGain };
};

const stopSynth = (synth) => {
  try {
    if (synth.source) {
      synth.source.stop();
      synth.source.disconnect();
    }
    if (synth.oscillators) {
      synth.oscillators.forEach(osc => {
        try { osc.stop(); } catch(e){}
        try { osc.disconnect(); } catch(e){}
      });
    }
    if (synth.childNodes) {
      synth.childNodes.forEach(node => {
        try { node.disconnect(); } catch(e){}
      });
    }
    if (synth.filter) {
      synth.filter.disconnect();
    }
    if (synth.gainNode) {
      synth.gainNode.disconnect();
    }
    if (synth.interval) {
      clearInterval(synth.interval);
    }
  } catch(e) {
    console.error("Error stopping synthesizer: ", e);
  }
};

export default function TimerView() {
  const [modeKey,   setModeKey]   = useState('focus');
  const [timeLeft,  setTimeLeft]  = useState(MODES.focus.duration);
  const [running,   setRunning]   = useState(false);
  const [sessions,  setSessions]  = useState(0);
  const [subject,   setSubject]   = useState('');
  const [subjects,  setSubjects]  = useState([]);
  const [history,   setHistory]   = useState([]);
  const [pulse,     setPulse]     = useState(false);
  const intervalRef = useRef(null);

  // Soundscape audio and synthesizer contexts
  const audioCtxRef = useRef(null);
  const synthsRef = useRef({
    rain: null,
    fireplace: null,
    waves: null,
    forest: null,
    space: null
  });

  const [soundVolumes, setSoundVolumes] = useState({
    rain: 0,
    fireplace: 0,
    waves: 0,
    forest: 0,
    space: 0
  });

  useEffect(() => {
    api.subjects.list().then(setSubjects).catch(() => {});
    api.sessions.list().then(setHistory).catch(() => {});

    // Clean up synthesizers on unmount
    return () => {
      Object.values(synthsRef.current).forEach(synth => {
        if (synth) stopSynth(synth);
      });
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Keyboard shortcut: Space = start/pause
  useEffect(() => {
    const onKey = (e) => { if (e.code === 'Space' && e.target === document.body) { e.preventDefault(); toggleTimer(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [running]);

  const mode = MODES[modeKey];

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            handleComplete();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, modeKey]);

  const handleComplete = async () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 2000);
    if (modeKey === 'focus') {
      setSessions(s => s + 1);
      const sid = subjects.find(s => s.name === subject)?.id;
      await api.sessions.create({ subject_id: sid || null, duration: 25, mode: 'focus' }).catch(() => {});
      const h = await api.sessions.list().catch(() => []);
      setHistory(h);
      
      const currentCoins = Number(localStorage.getItem('nexus_coins') || '0');
      localStorage.setItem('nexus_coins', (currentCoins + 50).toString());
      alert("🎉 Pomodoro finished! +50 ByteCoins earned!");
    }
  };

  const switchMode = (key) => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setModeKey(key);
    setTimeLeft(MODES[key].duration);
  };

  const toggleTimer = () => setRunning(r => !r);

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setTimeLeft(mode.duration);
  };

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const handleVolumeChange = (soundId, volume) => {
    setSoundVolumes(prev => ({ ...prev, [soundId]: volume }));
    
    const ctx = getAudioContext();
    let synth = synthsRef.current[soundId];

    if (volume === 0) {
      if (synth) {
        stopSynth(synth);
        synthsRef.current[soundId] = null;
      }
      return;
    }

    if (!synth) {
      synth = startSynth(soundId, ctx);
      synthsRef.current[soundId] = synth;
    }

    if (synth && synth.gainNode) {
      synth.gainNode.gain.setTargetAtTime(volume, ctx.currentTime, 0.05);
    }
  };

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const progress  = timeLeft / mode.duration;
  const dashOffset = CIRC * (1 - progress);

  const todayFocus = history.filter(s =>
    s.mode === 'focus' && new Date(s.completed_at).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="view">
      <div className="page-header">
        <div className="page-eyebrow">Knowledge OS · Focus</div>
        <h1 className="page-title">Focus Timer</h1>
        <p className="page-subtitle">Press Space to start · Pomodoro technique</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Left — Timer & Visualizer */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 32px' }}>

          {/* Mode tabs */}
          <div className="flex gap-2 mb-6">
            {Object.entries(MODES).map(([key, m]) => (
              <button key={key}
                className={`btn ${modeKey === key ? 'btn-cyan' : 'btn-ghost'}`}
                style={{ fontSize: 10, ...(modeKey === key ? { '--cyan': m.color, '--cyan-dim': m.color + '22' } : {}) }}
                onClick={() => switchMode(key)}>
                {m.label}
              </button>
            ))}
          </div>

          {/* SVG Ring */}
          <div className="timer-ring" style={{
            filter: pulse ? `drop-shadow(0 0 30px ${mode.shadow})` : 'none',
            transition: 'filter 0.6s'
          }}>
            <svg className="timer-svg" width="240" height="240" viewBox="0 0 240 240">
              <circle cx="120" cy="120" r="116" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              {Array.from({ length: 60 }, (_, i) => {
                const a = (i / 60) * 2 * Math.PI;
                const r1 = i % 5 === 0 ? 108 : 111;
                return (
                  <line key={i}
                    x1={120 + r1 * Math.cos(a)} y1={120 + r1 * Math.sin(a)}
                    x2={120 + 114 * Math.cos(a)} y2={120 + 114 * Math.sin(a)}
                    stroke={i % 5 === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}
                    strokeWidth={i % 5 === 0 ? 1.5 : 0.8}
                  />
                );
              })}
              <circle className="timer-track" cx="120" cy="120" r={RADIUS} />
              <circle
                className={`timer-prog ${modeKey === 'focus' ? 'focus' : 'break'}`}
                cx="120" cy="120" r={RADIUS}
                strokeDashoffset={dashOffset}
                style={{ stroke: mode.color, filter: `drop-shadow(0 0 10px ${mode.shadow})` }}
              />
              {progress > 0.01 && (
                <circle
                  cx={120 + RADIUS * Math.cos(-Math.PI / 2 + (1 - progress) * 2 * Math.PI)}
                  cy={120 + RADIUS * Math.sin(-Math.PI / 2 + (1 - progress) * 2 * Math.PI)}
                  r="5" fill={mode.color}
                  style={{ filter: `drop-shadow(0 0 8px ${mode.color})` }}
                />
              )}
            </svg>
            <div className="timer-center">
              <div className="timer-time" style={{ color: mode.color, textShadow: `0 0 30px ${mode.shadow}` }}>
                {fmt(timeLeft)}
              </div>
              <div className="timer-mode-label" style={{ color: mode.color }}>{mode.label}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6, letterSpacing: 1 }}>
                {Math.round(progress * 100)}% remaining
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 items-center mb-6">
            <button className="btn btn-ghost btn-icon" style={{ width: 40, height: 40 }} onClick={reset} title="Reset">↺</button>
            <button
              className="btn"
              style={{
                width: 130, height: 46, fontSize: 13, letterSpacing: 2,
                background: running ? 'rgba(255,69,58,0.12)' : `${mode.color}22`,
                color: running ? '#ff453a' : mode.color,
                borderColor: running ? 'rgba(255,69,58,0.3)' : mode.color,
                boxShadow: running ? '' : `0 0 20px ${mode.color}33`,
              }}
              onClick={toggleTimer}
            >
              {running ? '⏸ PAUSE' : '▶ START'}
            </button>
            <button className="btn btn-ghost btn-icon" style={{ width: 40, height: 40 }} onClick={() => switchMode(modeKey === 'focus' ? 'short' : 'focus')} title="Skip">⏭</button>
          </div>

          {/* Subject selector */}
          <div style={{ width: '100%', maxWidth: 280, marginBottom: 12 }}>
            <div className="input-label" style={{ textAlign: 'center', marginBottom: 8 }}>Studying</div>
            <select className="input" value={subject} onChange={e => setSubject(e.target.value)}>
              <option value="">— Select subject —</option>
              {subjects.map(s => <option key={s.id} value={s.name}>{s.icon} {s.name}</option>)}
            </select>
          </div>

          {/* Soundscape Visualizer */}
          <SoundVisualizer active={running} />
        </div>

        {/* Right — Stats & Soundscapes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Soundscape Mixer Card */}
          <div className="card">
            <div className="page-eyebrow" style={{ marginBottom: 12 }}>🌧️ Soundscape Mixer</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SOUNDSCAPES.map(s => (
                <div key={s.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text)' }}>
                    <span>{s.name}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{Math.round(soundVolumes[s.id] * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.05"
                    value={soundVolumes[s.id]} 
                    onChange={e => handleVolumeChange(s.id, Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--cyan)', cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Session stats */}
          <div className="card">
            <div className="page-eyebrow" style={{ marginBottom: 14 }}>Today's Stats</div>
            {[
              { label: 'Sessions Completed', val: todayFocus,            icon: '◎', color: 'var(--cyan)'   },
              { label: 'This Session',       val: sessions,              icon: '⟡', color: 'var(--purple)' },
              { label: 'Minutes Focused',    val: `${todayFocus * 25}`,  icon: '⏱', color: 'var(--orange)' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 20, opacity: 0.7 }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase' }}>{s.label}</div>
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: s.color, textShadow: `0 0 16px ${s.color}55` }}>{s.val}</span>
              </div>
            ))}
          </div>

          {/* Recent sessions */}
          <div className="card" style={{ flex: 1 }}>
            <div className="page-eyebrow" style={{ marginBottom: 12 }}>Recent Sessions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 120, overflowY: 'auto' }}>
              {history.slice(0, 5).length > 0 ? history.slice(0, 5).map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.subject_color || 'var(--cyan)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, flex: 1, color: 'var(--text)' }}>{s.subject_name || 'General'}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>{s.duration}m</span>
                </div>
              )) : <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No sessions yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── NEON MUSIC VISUALIZER COMPONENT ──
function SoundVisualizer({ active }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cy = canvas.height / 2;

      // Draw primary neon wave
      ctx.strokeStyle = active ? 'var(--cyan)' : 'rgba(255,255,255,0.05)';
      ctx.lineWidth = active ? 2 : 1;
      ctx.shadowBlur = active ? 10 : 0;
      ctx.shadowColor = 'var(--cyan)';
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const amp = active ? 16 * Math.cos(x * 0.008 + angle * 0.3) : 2;
        const y = cy + Math.sin(x * 0.04 + angle) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw secondary neon wave
      ctx.strokeStyle = active ? 'var(--purple)' : 'rgba(255,255,255,0.02)';
      ctx.shadowColor = 'var(--purple)';
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const amp = active ? 12 * Math.sin(x * 0.01 - angle * 0.5) : 1;
        const y = cy + Math.cos(x * 0.03 - angle) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      angle += active ? 0.06 : 0.01;
      frame = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(frame);
  }, [active]);

  return (
    <div style={{ width: '100%', maxWidth: 280, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
      <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--text-muted)', letterSpacing: 1 }}>NEON MUSIC VISUALIZER</span>
      <canvas ref={canvasRef} width={280} height={50} style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 10, border: '1px solid var(--border)' }} />
    </div>
  );
}
