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
      const lang = l.slice(3);
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
      // Inline bold/code
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
  'Explain quantum entanglement simply',
  'What is the Feynman Technique?',
  'Give me 5 tips for effective studying',
  'Create a study plan for 2 hours',
  'What is spaced repetition?',
  'Help me memorize key concepts faster',
];

const VIDEO_COURSES = [
  { 
    title: 'Python for Beginners', 
    creator: 'Programming with Mosh', 
    id: 'kqtD5dpn9C8', 
    desc: 'The ultimate crash course to learn Python programming from absolute scratch.',
    duration: '6 hours',
    lang: '🐍 Python'
  },
  { 
    title: 'C++ Full Tutorial Course', 
    creator: 'freeCodeCamp', 
    id: 'vLnPwxZdW4Y', 
    desc: 'Complete engineering-grade fundamentals course covering compilers, pointers, and memory manipulation.',
    duration: '31 hours',
    lang: '💻 C++'
  },
  { 
    title: 'React JS Course for Beginners', 
    creator: 'Dave Gray', 
    id: 'hQAHSlTt2Gs', 
    desc: 'Hands-on React framework walkthrough building active single page applications with hooks.',
    duration: '12 hours',
    lang: '⚛️ React'
  },
  { 
    title: 'HTML & CSS Full Course', 
    creator: 'SuperSimpleDev', 
    id: 'G3e-cpL7ofc', 
    desc: 'A gorgeous, beginner-friendly web design course covering styling, flexbox, grid, and layout design.',
    duration: '6 hours',
    lang: '🌐 HTML & CSS'
  },
  { 
    title: 'JavaScript Full Course', 
    creator: 'Bro Code', 
    id: 'lfmg-Di8YLM', 
    desc: 'Master JavaScript engine fundamentals, DOM manipulation, classes, and modern asynchronous functions.',
    duration: '8 hours',
    lang: '⚡ JavaScript'
  },
  { 
    title: 'Data Structures and Algorithms', 
    creator: 'freeCodeCamp', 
    id: '8hly31xKjns', 
    desc: 'Crucial algorithms and data structures course covering stacks, queues, trees, and big O notation.',
    duration: '7 hours',
    lang: '⚙️ Algorithms'
  }
];

export default function AIView() {
  const [subTab, setSubTab] = useState('chat'); // 'chat' | 'videos'
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');
  
  // Video States
  const [selectedVideo, setSelectedVideo] = useState(VIDEO_COURSES[0]);

  const bottomRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    api.subjects.list().then(setSubjects).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, subTab]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput(''); setError('');

    const userMsg = { role: 'user', content: msg };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setLoading(true);

    try {
      const { response } = await api.ai.chat(
        newMsgs.map(m => ({ role: m.role, content: m.content })),
        subject || undefined
      );
      setMessages([...newMsgs, { role: 'assistant', content: response }]);
    } catch (e) {
      setError(e.message);
      setMessages(newMsgs); 
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const clear = () => setMessages([]);

  return (
    <div className="view" style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="page-eyebrow">Knowledge OS · AI</div>
          <h1 className="page-title">NEXUS AI <span style={{ color:'var(--cyan)', fontSize:14, letterSpacing:2 }}>✦</span></h1>
        </div>
        
        {/* Sub-Tab Navigation Toggle */}
        <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 4 }}>
          <button 
            className={`btn ${subTab === 'chat' ? 'btn-cyan' : 'btn-ghost'}`} 
            style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8 }}
            onClick={() => setSubTab('chat')}
          >
            💬 Co-Pilot Chat
          </button>
          <button 
            className={`btn ${subTab === 'videos' ? 'btn-purple' : 'btn-ghost'}`} 
            style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8 }}
            onClick={() => setSubTab('videos')}
          >
            🎥 AI Explainer Videos
          </button>
        </div>
      </div>

      {subTab === 'chat' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Chat Setup Context */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, justifyContent: 'space-between' }}>
            {subject ? (
              <p className="page-subtitle" style={{ margin: 0 }}>Context: Studying <span style={{ color:'var(--cyan)' }}>{subject}</span></p>
            ) : <p className="page-subtitle" style={{ margin: 0 }}>General cognitive co-pilot</p>}
            <div style={{ display: 'flex', gap: 8 }}>
              <select className="input" style={{ width:180, fontSize:12, padding: '4px 8px' }} value={subject} onChange={e => setSubject(e.target.value)}>
                <option value="">General Assistant</option>
                {subjects.map(s => <option key={s.id} value={s.name}>{s.icon} {s.name}</option>)}
              </select>
              {messages.length > 0 && <button className="btn btn-ghost" style={{ fontSize:11 }} onClick={clear}>Clear</button>}
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages" style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:16, paddingBottom:12 }}>
            {messages.length === 0 && (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1, gap:24, paddingBottom:40 }}>
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
                <div className="msg-avatar">
                  {m.role === 'user' ? 'U' : '✦'}
                </div>
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

          {/* Input */}
          <div style={{ display:'flex', gap:10, paddingTop:12, borderTop:'1px solid var(--border)', flexShrink:0 }}>
            <textarea
              ref={inputRef}
              className="input"
              style={{ flex:1, resize:'none', height:48, lineHeight:1.6, paddingTop:12, fontSize:14 }}
              placeholder="Ask NEXUS AI anything… (Enter to send, Shift+Enter for newline)"
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
      ) : (
        /* Explainer Videos Interface */
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, overflow: 'hidden', paddingBottom: 10 }}>
          
          {/* Active Video Player Screen */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 24, overflowY: 'auto' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-hi)', background: '#000' }}>
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${selectedVideo.id}`} 
                title={selectedVideo.title} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
            
            <div style={{ marginTop: 20 }}>
              <div className="badge badge-cyan" style={{ marginBottom: 8 }}>{selectedVideo.lang}</div>
              <h2 style={{ color: 'var(--text-bright)', fontSize: 24, fontWeight: 800 }}>{selectedVideo.title}</h2>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 12px' }}>
                Course by <strong>{selectedVideo.creator}</strong> | Duration: {selectedVideo.duration}
              </div>
              <p style={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.6 }}>{selectedVideo.desc}</p>
            </div>
          </div>

          {/* Videos Sidebar Selection List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
            <div style={{ fontSize: 12, fontWeight: 'bold', color: 'var(--purple)', letterSpacing: 1 }}>AVAILABLE COURSES</div>
            {VIDEO_COURSES.map(v => (
              <div 
                key={v.id} 
                onClick={() => setSelectedVideo(v)}
                className="card"
                style={{ 
                  padding: 16, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8,
                  background: selectedVideo.id === v.id ? 'var(--cyan-dim)' : 'var(--surface)',
                  border: selectedVideo.id === v.id ? '1px solid var(--cyan)' : '1px solid var(--border)',
                  transition: 'all 0.22s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 'bold', color: 'var(--cyan)' }}>{v.lang}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{v.duration}</span>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-bright)', lineHeight: 1.3 }}>{v.title}</h3>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{v.creator}</span>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
