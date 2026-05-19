import React from 'react';

export default function CreditsView() {
  return (
    <div className="view" style={{ overflowY: 'auto' }}>
      <div className="page-header">
        <div className="page-eyebrow">Knowledge OS · Developer</div>
        <h1 className="page-title">Creator & Credits</h1>
        <p className="page-subtitle">The visionary behind Nexus.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, marginTop: 40 }}>
        
        {/* Creator Card */}
        <div className="card" style={{ 
          maxWidth: 700, width: '100%', 
          background: 'linear-gradient(135deg, rgba(0,229,255,0.1), rgba(168,85,247,0.1))',
          border: '1px solid rgba(0,229,255,0.3)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 60,
          position: 'relative', overflow: 'hidden'
        }}>
          {/* Decorative background glow */}
          <div style={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, background: 'var(--cyan)', filter: 'blur(150px)', opacity: 0.2, borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -100, right: -100, width: 300, height: 300, background: 'var(--purple)', filter: 'blur(150px)', opacity: 0.2, borderRadius: '50%' }} />

          <div style={{ 
            width: 160, height: 160, borderRadius: '50%', background: 'var(--surface)', 
            border: '4px solid var(--cyan)', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(0,229,255,0.4)', fontSize: 70, overflow: 'hidden', position: 'relative'
          }}>
            {/* You can replace this emoji with an actual picture URL if you have one! */}
            👨‍💻
          </div>

          <h2 style={{ fontSize: 36, color: '#fff', fontWeight: 900, letterSpacing: 1, marginBottom: 8, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Rami Laouini
          </h2>
          <div className="badge badge-cyan" style={{ fontSize: 14, padding: '8px 16px', letterSpacing: 2, marginBottom: 24 }}>
            Lead Developer & Founder
          </div>

          <p style={{ color: 'var(--text-bright)', fontSize: 18, lineHeight: 1.6, maxWidth: 500, marginBottom: 24 }}>
            I am a second-year engineering student at <strong>ESPRIT</strong> in <strong>Tunisia</strong> 🇹🇳. 
            I built Nexus Knowledge OS to push the boundaries of what an educational platform can be—merging premium UI design, AI integration, and deep-focus tools into a single, cohesive experience.
          </p>

          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            <a href="https://github.com/ramilaouini" target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ border: '1px solid var(--border)' }}>
              GitHub Profile
            </a>
            <button className="btn btn-purple" onClick={() => alert("Thank you for using Nexus!")}>
              Connect with Rami
            </button>
          </div>
        </div>

        {/* Tech Stack Info */}
        <div className="card" style={{ maxWidth: 700, width: '100%' }}>
          <h3 style={{ fontSize: 20, color: 'var(--cyan)', marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>Technology & Design</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
            Nexus was designed with a heavy emphasis on <strong>Glassmorphism</strong> and <strong>Cyberpunk aesthetics</strong>, utilizing soft glowing drop-shadows, pure CSS styling, and cutting-edge web technologies to create a seamless, app-like experience in the browser.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, textAlign: 'center' }}>
            <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 12, border: '1px solid var(--border)' }}>⚛️ React (Vite)</div>
            <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 12, border: '1px solid var(--border)' }}>🟢 Node.js</div>
            <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 12, border: '1px solid var(--border)' }}>🤖 Groq AI</div>
          </div>
        </div>

      </div>
    </div>
  );
}
