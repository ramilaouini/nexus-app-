import { useState, useEffect } from 'react';

const MILESTONES = [
  { id: 1, name: '💡 Ideation & Blueprint', desc: 'Outline the central value proposition and core system features.' },
  { id: 2, name: '🛠️ Architecture Prototype', desc: 'Formulate database schemas and dynamic user interface layout.' },
  { id: 3, name: '🚀 Beta Release & Tests', desc: 'Host application servers and conduct comprehensive debug checks.' },
  { id: 4, name: '🔥 Scale & Pitch Presentation', desc: 'Pitch software architecture highlights to ESPRIT engineering juries!' }
];

export default function ShipView() {
  const [projectTitle, setProjectTitle] = useState('');
  const [vision, setVision] = useState('');
  const [market, setMarket] = useState('');
  const [techStack, setTechStack] = useState('');
  const [milestone, setMilestone] = useState(1);
  const [funded, setFunded] = useState(false);
  const [activeProject, setActiveProject] = useState(() => {
    return JSON.parse(localStorage.getItem('nexus_active_incubator') || 'null');
  });

  useEffect(() => {
    if (activeProject) {
      localStorage.setItem('nexus_active_incubator', JSON.stringify(activeProject));
    } else {
      localStorage.removeItem('nexus_active_incubator');
    }
  }, [activeProject]);

  const startProject = (e) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;
    const proj = {
      title: projectTitle,
      vision,
      market,
      techStack,
      milestone: 1,
      funded: false
    };
    setActiveProject(proj);
  };

  const fundProject = () => {
    const coins = Number(localStorage.getItem('nexus_coins') || '100');
    if (coins < 50) {
      alert("❌ Insufficient ByteCoins! You need 50 ByteCoins to seed invest in your startup prototype.");
      return;
    }
    localStorage.setItem('nexus_coins', (coins - 50).toString());
    const next = { ...activeProject, funded: true };
    setActiveProject(next);
    setFunded(true);
    alert("🎉 Seed Funding Approved! Spent 50 ByteCoins to seed invest. Your project is now funded!");
  };

  const advanceMilestone = () => {
    if (!activeProject) return;
    const nextVal = Math.min(activeProject.milestone + 1, 4);
    const next = { ...activeProject, milestone: nextVal };
    setActiveProject(next);
  };

  const resetProject = () => {
    if (confirm("Reset current startup project?")) {
      setActiveProject(null);
      setProjectTitle('');
      setVision('');
      setMarket('');
      setTechStack('');
      setFunded(false);
    }
  };

  return (
    <div className="view" style={{ overflowY: 'auto' }}>
      
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div className="page-eyebrow">Knowledge OS · Incubator</div>
        <h1 className="page-title">🚀 Startup Incubator & Pitch Deck</h1>
        <p className="page-subtitle">Outline your engineering startup concepts, seed-invest ByteCoins, and fulfill academic milestone blueprints.</p>
      </div>

      {!activeProject ? (
        /* Create Project Lobby */
        <form onSubmit={startProject} className="card animate-fade-in" style={{ padding: 30, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 650, margin: '20px auto' }}>
          <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1 }}>LAUNCH NEW STARTUP PROJECT</span>
          
          <div>
            <div className="input-label">Project / Startup Title</div>
            <input className="input" placeholder="e.g. Smart Irrigation ESPRIT Systems" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} required />
          </div>

          <div>
            <div className="input-label">Core Product Vision</div>
            <textarea className="input" placeholder="What problem does this startup solve?..." style={{ height: 70, resize: 'none' }} value={vision} onChange={e => setVision(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div className="input-label">Target Market (Tunisia/Global)</div>
              <input className="input" placeholder="e.g. Tunisian Agritech sectors" value={market} onChange={e => setMarket(e.target.value)} required />
            </div>
            <div>
              <div className="input-label">Primary Technology Stack</div>
              <input className="input" placeholder="e.g. IoT, C++, React Router" value={techStack} onChange={e => setTechStack(e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="btn btn-cyan" style={{ marginTop: 10 }}>🚀 Launch Project Blueprint</button>
        </form>
      ) : (
        /* Active Project Dashboard */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, paddingBottom: 40 }}>
          
          {/* Left: Pitch Deck details & Milestones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Title card */}
            <div className="card" style={{ padding: 24, background: 'linear-gradient(135deg, rgba(0,229,255,0.06), rgba(168,85,247,0.06))', border: '1px solid var(--border-hi)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1 }}>ACTIVE INCUBATOR PRODUCT</span>
                <h2 style={{ fontSize: 22, color: '#fff', fontWeight: 900, marginTop: 4 }}>{activeProject.title}</h2>
              </div>
              
              <button className="btn btn-ghost" style={{ border: '1px solid #ef4444', color: '#ef4444', fontSize: 11 }} onClick={resetProject}>✕ Reset Project</button>
            </div>

            {/* Pitch deck details */}
            <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--purple)', letterSpacing: 1 }}>STARTUP PITCH DECK BLUEPRINTS</span>
              
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 4 }}>1. Central Vision & Value Prop</div>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: '#fff', margin: 0 }}>{activeProject.vision}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 4 }}>2. Target Market Sector</div>
                  <strong style={{ fontSize: 13, color: 'var(--cyan)' }}>{activeProject.market}</strong>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 4 }}>3. Technical Stack</div>
                  <strong style={{ fontSize: 13, color: 'var(--purple)' }}>{activeProject.techStack}</strong>
                </div>
              </div>
            </div>

            {/* Interactive milestones progress */}
            <div className="card" style={{ padding: 24 }}>
              <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1, display: 'block', marginBottom: 16 }}>🏁 INCUBATION MILESTONES ROADMAP</span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {MILESTONES.map(m => {
                  const isActive = activeProject.milestone === m.id;
                  const isCompleted = activeProject.milestone > m.id;

                  return (
                    <div key={m.id} style={{ 
                      display: 'flex', gap: 14, padding: 16, borderRadius: 12,
                      background: isActive ? 'rgba(0,229,255,0.05)' : 'var(--surface)',
                      border: isActive ? '1px solid var(--cyan)' : isCompleted ? '1px solid var(--green)' : '1px solid var(--border)',
                      opacity: isActive || isCompleted ? 1 : 0.6,
                      transition: 'all 0.2s'
                    }}>
                      <div style={{ 
                        width: 24, height: 24, borderRadius: '50%', 
                        background: isCompleted ? 'var(--green)' : isActive ? 'var(--cyan)' : 'var(--border)',
                        color: isCompleted || isActive ? '#000' : 'var(--text-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 12
                      }}>
                        {isCompleted ? '✓' : m.id}
                      </div>

                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: 14, color: '#fff' }}>{m.name}</strong>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>{m.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right: Funding & Investment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Seed Investment Box */}
            <div className="card" style={{ padding: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1 }}>SEED CAPITAL FUNDING</span>
              
              {activeProject.funded || funded ? (
                <>
                  <div style={{ fontSize: 44 }}>🏦</div>
                  <strong style={{ fontSize: 15, color: 'var(--green)' }}>✓ SEED CAPITAL FUNDED</strong>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Your startup has successfully unlocked ByteCoin sponsorship from the campus jury!</p>
                  
                  {activeProject.milestone < 4 ? (
                    <button className="btn btn-purple" style={{ width: '100%', marginTop: 8 }} onClick={advanceMilestone}>
                      🏁 Complete Current Milestone
                    </button>
                  ) : (
                    <div className="badge badge-cyan" style={{ fontSize: 11, width: '100%', padding: 8 }}>🎉 Project Scale Achieved!</div>
                  )}
                </>
              ) : (
                <>
                  <div style={{ fontSize: 44 }}>💸</div>
                  <strong style={{ fontSize: 14, color: 'var(--text-bright)' }}>Incubator Seed Funding</strong>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>Spend **50 ByteCoins** to seed invest in your startup blueprint and unlock milestone progression!</p>
                  
                  <button className="btn btn-cyan" style={{ width: '100%', marginTop: 8 }} onClick={fundProject}>
                    💰 Seed Invest 50 ByteCoins
                  </button>
                </>
              )}
            </div>

            {/* Academic Advice card */}
            <div className="card" style={{ padding: 20 }}>
              <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--purple)', display: 'block', marginBottom: 10 }}>🎓 ESPRIT JURY ADVICE</span>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                When pitching embed software or web structures, ensure your backend schemas are relational, normalized, and optimized for concurrent operations.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
