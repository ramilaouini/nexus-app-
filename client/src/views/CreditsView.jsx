import { useState } from 'react';

const TIMELINE_STEPS = [
  { 
    id: 1, 
    title: '📍 Semester 1: Core Foundations', 
    date: 'Fall 2025', 
    subtitle: 'ESPRIT Sophomore Core',
    desc: 'Mastered high-performance systems paradigms using C++, deep network architecture topologies, algebraic computation matrices, and digital logic gates.',
    techs: ['C++', 'Networking', 'Algebra', 'Boolean Logic']
  },
  { 
    id: 2, 
    title: '📍 Semester 2: Advanced Software Architecture', 
    date: 'Spring 2026', 
    subtitle: 'Full-Stack Engineering & Databases',
    desc: 'Engineered aesthetic dynamic web platforms (React, Node, CSS3) alongside complex relational SQL database storage procedures.',
    techs: ['React', 'CSS3', 'SQL Databases', 'RESTful APIs']
  },
  { 
    id: 3, 
    title: '📍 Semester 3: Embedded Robotics & AI Systems', 
    date: 'Future Focus', 
    subtitle: 'Emerging Technologies Specialization',
    desc: 'Designing deep-focus AI study platforms (Nexus OS), micro-controllers firmware compilers, and computer vision robotic algorithms.',
    techs: ['Embedded C', 'LLM Prompts', 'Algorithms', 'Robotics']
  }
];

const SKILLS = [
  { name: 'C++ Systems Programming', level: 90, color: 'var(--cyan)' },
  { name: 'React SPA Engineering', level: 95, color: 'var(--purple)' },
  { name: 'SQL Database Architecture', level: 85, color: 'var(--green)' },
  { name: 'Algorithms & Data Structures', level: 92, color: 'var(--orange)' }
];

export default function CreditsView() {
  const [activeStepId, setActiveStepId] = useState(1);
  const [msgSent, setMsgSent] = useState(false);
  const activeStep = TIMELINE_STEPS.find(s => s.id === activeStepId);

  const handleHireSubmit = (e) => {
    e.preventDefault();
    setMsgSent(true);
    setTimeout(() => setMsgSent(false), 3000);
  };

  return (
    <div className="view" style={{ overflowY: 'auto', paddingBottom: 40 }}>
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div className="page-eyebrow">Knowledge OS · Developer</div>
        <h1 className="page-title">Creator & Portfolio</h1>
        <p className="page-subtitle">The visionary second-year ESPRIT student engineering the future of education.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, marginTop: 20 }}>
        
        {/* Left Column: Creator Bio & Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Main Bio Card */}
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, rgba(0,229,255,0.08), rgba(168,85,247,0.08))',
            border: '1px solid var(--border-hi)',
            padding: 36, position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, background: 'var(--cyan)', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%' }} />
            
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              <div style={{ 
                width: 100, height: 100, borderRadius: '50%', background: 'var(--surface)', 
                border: '3px solid var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(0,229,255,0.3)', fontSize: 44, overflow: 'hidden'
              }}>
                👨‍💻
              </div>
              <div>
                <h2 style={{ fontSize: 26, color: '#fff', fontWeight: 900, margin: 0 }}>Rami Laouini</h2>
                <div className="badge badge-cyan" style={{ fontSize: 11, padding: '4px 10px', letterSpacing: 1.5, marginTop: 6 }}>
                  ESPRIT SOFTWARE ENGINEER STUDENT
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--text-bright)', fontSize: 15, lineHeight: 1.7, marginTop: 20 }}>
              I am a passionate **second-year computer engineering student at ESPRIT in Tunisia** 🇹🇳. 
              I built **Nexus Knowledge OS** to represent the pinnacle of student productivity apps—combining scientific revision algorithms (Spaced Repetition, Kanban study flows) with dynamic LLM AI summoning, fully playable gaming reward economies, and sleek glassmorphic aesthetics.
            </p>
          </div>

          {/* Interactive ESPRIT Timeline */}
          <div className="card" style={{ padding: 24 }}>
            <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>🚀 INTERACTIVE ACADEMIC TIMELINE</span>
            
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, overflowX: 'auto', paddingBottom: 6 }}>
              {TIMELINE_STEPS.map(step => (
                <button 
                  key={step.id} 
                  className={`btn ${activeStepId === step.id ? 'btn-cyan' : 'btn-ghost'}`}
                  onClick={() => setActiveStepId(step.id)}
                  style={{ fontSize: 11, whiteSpace: 'nowrap' }}
                >
                  {step.date}
                </button>
              ))}
            </div>

            {activeStep && (
              <div className="card animate-fade-in" style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 16, color: 'var(--text-bright)', fontWeight: 800 }}>{activeStep.title}</h3>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{activeStep.subtitle}</span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text)', marginBottom: 14 }}>{activeStep.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {activeStep.techs.map(t => (
                    <span key={t} className="badge badge-purple" style={{ fontSize: 9 }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Skills & Email Contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Skill Matrix */}
          <div className="card" style={{ padding: 20 }}>
            <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--purple)', display: 'block', marginBottom: 14, letterSpacing: 1 }}>🛠️ SPECIALTY SKILLS</span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {SKILLS.map(s => (
                <div key={s.name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text)' }}>
                    <span>{s.name}</span>
                    <strong style={{ color: s.color }}>{s.level}%</strong>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.03)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div style={{ width: `${s.level}%`, height: '100%', background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connect Form */}
          <div className="card" style={{ padding: 20 }}>
            <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', display: 'block', marginBottom: 12, letterSpacing: 1 }}>✉️ COLLABORATE WITH RAMI</span>
            
            <form onSubmit={handleHireSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input className="input" placeholder="Your Name" required />
              <input className="input" type="email" placeholder="Your Email" required />
              <textarea className="input" placeholder="Collaboration or project idea..." style={{ height: 80, resize: 'none' }} required />
              <button type="submit" className="btn btn-cyan" style={{ width: '100%' }}>Send Proposal</button>
            </form>
            
            {msgSent && (
              <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 10, textAlign: 'center', fontWeight: 'bold' }}>
                ✓ Proposal submitted to Rami's local database!
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
