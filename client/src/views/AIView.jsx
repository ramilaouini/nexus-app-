import { useState, useEffect, useRef } from 'react';
import { api } from '../api';

// Minimal markdown renderer
function Markdown({ text }) {
  const lines = text.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (l.startsWith('### ')) { out.push(<h4 key={i} style={{ color:'var(--text-bright)', fontFamily:'var(--font-display)', fontSize:12, letterSpacing:1, marginBottom:6, marginTop:10 }}>{l.slice(4)}</h4>); }
    else if (l.startsWith('## '))  { out.push(<h3 key={i} style={{ color:'var(--text-bright)', fontFamily:'var(--font-display)', fontSize:13, letterSpacing:1, marginBottom:8, marginTop:12 }}>{l.slice(3)}</h3>); }
    else if (l.startsWith('# '))   { out.push(<h2 key={i} style={{ color:'var(--cyan)', fontFamily:'var(--font-display)', fontSize:15, letterSpacing:1, marginBottom:10, marginTop:14 }}>{l.slice(2)}</h2>); }
    else if (l.startsWith('- ') || l.startsWith('* ')) {
      out.push(<div key={i} style={{ display:'flex', gap:8, marginBottom:3 }}><span style={{ color:'var(--cyan)', flexShrink:0, marginTop:2 }}>›</span><span>{l.slice(2)}</span></div>);
    }
    else if (l.startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++; }
      out.push(
        <pre key={i} style={{ background:'rgba(0,0,0,0.4)', border:'1px solid var(--border)', borderRadius:8, padding:'12px 14px', marginBottom:10, overflowX:'auto', fontFamily:'var(--font-mono)', fontSize:12, color:'var(--green)', lineHeight:1.6 }}>
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
    }
    else if (l.startsWith('> ')) {
      out.push(<blockquote key={i} style={{ borderLeft:'2px solid var(--cyan)', paddingLeft:12, color:'var(--text-muted)', fontStyle:'italic', marginBottom:8 }}>{l.slice(2)}</blockquote>);
    }
    else if (l.trim() === '') { out.push(<br key={i} />); }
    else {
      const parts = l.split(/(\*\*.*?\*\*|`.*?`)/g);
      out.push(
        <p key={i} style={{ marginBottom: 4, lineHeight: 1.7 }}>
          {parts.map((p, j) => {
            if (p.startsWith('**') && p.endsWith('**')) return <strong key={j} style={{ color:'var(--text-bright)', fontWeight:700 }}>{p.slice(2,-2)}</strong>;
            if (p.startsWith('`') && p.endsWith('`'))  return <code key={j} style={{ fontFamily:'var(--font-mono)', fontSize:12, background:'rgba(0,229,255,0.08)', padding:'1px 5px', borderRadius:4, color:'var(--cyan)' }}>{p.slice(1,-1)}</code>;
            return p;
          })}
        </p>
      );
    }
    i++;
  }
  return <div>{out}</div>;
}

const SUGGESTIONS = [
  'Explain C++ smart pointers',
  'Feynman Technique for physics',
  'Give me 5 engineering tips',
  'Create a 2-hour study path',
  'What is spaced repetition?',
];

export default function AIView() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat'
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState([]);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    api.subjects.list().then(setSubjects).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (textToSend) => {
    const val = (textToSend || input).trim();
    if (!val || loading) return;
    if (!textToSend) setInput('');

    const newMsgs = [...messages, { role: 'user', content: val }];
    setMessages(newMsgs);
    setLoading(true);
    setError(null);

    try {
      const hist = newMsgs.map(m => ({ role: m.role, content: m.content }));
      if (subject) {
        hist.unshift({ role: 'system', content: `The student is currently focusing on the subject "${subject}". Align study techniques and engineering insights specifically around "${subject}".` });
      }
      const res = await api.ai.chat(hist);
      setMessages([...newMsgs, { role: 'assistant', content: res.response }]);
    } catch(err) {
      setError(err.message || 'Failed to summon AI Co-Pilot.');
    }
    setLoading(false);
  };

  const clear = () => {
    setMessages([]);
    setError(null);
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="view" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div className="page-eyebrow">Aesthetic Space · Artificial Intelligence</div>
          <h1 className="page-title">✦ AI Study Co-Pilot</h1>
          <p className="page-subtitle">Brainstorm engineering models, clear coding bugs, and auto-generate guides.</p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 240px', gap: 24, overflow: 'hidden', paddingBottom: 20 }}>
        
        {/* Left: Chat Client */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 24, minHeight: 450 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1 }}>ACTIVE CHAT SESSION</span>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <select className="input" style={{ width:180, fontSize:12, padding: '4px 8px' }} value={subject} onChange={e => setSubject(e.target.value)}>
                <option value="">General Assistant</option>
                {subjects.map(s => <option key={s.id} value={s.name}>{s.icon} {s.name}</option>)}
              </select>
              {messages.length > 0 && <button className="btn btn-ghost" style={{ fontSize:11 }} onClick={clear}>Clear</button>}
            </div>
          </div>

          <div className="chat-messages" style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:16, paddingBottom:12 }}>
            {messages.length === 0 && (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1, gap:20 }}>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:52, marginBottom:8, filter:'drop-shadow(0 0 20px var(--cyan))' }}>✦</div>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:20, color:'var(--text-bright)', letterSpacing:2 }}>NEXUS AI</div>
                  <p style={{ color:'var(--text-muted)', fontSize:13, marginTop:8 }}>Your intelligent study companion</p>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center', maxWidth:580 }}>
                  {SUGGESTIONS.map(s => (
                    <button key={s} className="btn btn-ghost"
                      style={{ fontSize:11, borderRadius:20, padding:'7px 16px' }}
                      onClick={() => send(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role === 'user' ? 'user' : 'ai'}`}>
                <div className="msg-avatar">{m.role === 'user' ? 'U' : '✦'}</div>
                <div className="msg-bubble">
                  {m.role === 'assistant' ? <Markdown text={m.content} /> : m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="msg ai">
                <div className="msg-avatar">✦</div>
                <div className="msg-bubble" style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div className="spinner" />
                  <span style={{ fontSize:12, color:'var(--text-muted)', letterSpacing:1 }}>Thinking…</span>
                </div>
              </div>
            )}

            {error && (
              <div style={{ background:'rgba(255,69,58,0.08)', border:'1px solid rgba(255,69,58,0.25)', borderRadius:10, padding:'12px 16px', fontSize:13, color:'#ff453a' }}>
                ⚠ {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ display:'flex', gap:10, paddingTop:12, borderTop:'1px solid var(--border)', flexShrink:0 }}>
            <textarea
              ref={inputRef}
              className="input"
              style={{ flex:1, resize:'none', height:48, lineHeight:1.6, paddingTop:12, fontSize:14 }}
              placeholder="Ask NEXUS AI anything…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              rows={1}
            />
            <button
              className="btn btn-cyan"
              style={{ height:48, paddingInline:24, fontSize:18, alignSelf:'flex-end' }}
              onClick={() => send()}
              disabled={loading || !input.trim()}
            >
              {loading ? <div className="spinner" style={{ width:16, height:16 }} /> : '→'}
            </button>
          </div>
        </div>

        {/* Right: Hologram Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <NeuralHologram active={loading} />
          
          <div className="card" style={{ padding: 20 }}>
            <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--purple)', display: 'block', marginBottom: 8 }}>CAPABILITIES</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
              <div>• Real-time algorithm analysis</div>
              <div>• C++ pointer visual explanations</div>
              <div>• Study schedule generation</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── NEURAL HOLOGRAM COMPONENT ──
function NeuralHologram({ active }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let angle = 0;
    let frame;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = 40 + Math.sin(angle * 3.5) * (active ? 8 : 2);

      // Pulse ring
      ctx.strokeStyle = active ? 'var(--cyan)' : 'var(--purple)';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = active ? 'var(--cyan)' : 'var(--purple)';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // Inner orbital rings
      ctx.strokeStyle = active ? 'var(--purple)' : 'var(--cyan)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 5;
      
      ctx.beginPath();
      ctx.ellipse(cx, cy, r - 12, (r - 12) * Math.sin(angle), angle, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(cx, cy, r - 12, (r - 12) * Math.cos(angle), -angle, 0, Math.PI * 2);
      ctx.stroke();

      // Central core
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();

      angle += active ? 0.08 : 0.02;
      frame = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(frame);
  }, [active]);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20, gap: 10, textAlign: 'center' }}>
      <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1 }}>AI HOLOGRAM CO-PILOT</span>
      <canvas ref={canvasRef} width={180} height={180} style={{ filter: 'drop-shadow(0 0 10px rgba(0,229,255,0.15))' }} />
      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{active ? '⚡ Core Processing...' : '💤 Standby Active'}</span>
    </div>
  );
}
