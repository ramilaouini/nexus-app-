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

export default function AIView() {
  const [messages,  setMessages]  = useState([]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [subject,   setSubject]   = useState('');
  const [subjects,  setSubjects]  = useState([]);
  const [error,     setError]     = useState('');
  const bottomRef = useRef();
  const inputRef  = useRef();

  useEffect(() => {
    api.subjects.list().then(setSubjects).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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
      setError(e.message.includes('ANTHROPIC_API_KEY')
        ? 'Add your ANTHROPIC_API_KEY to the .env file and restart the server.'
        : e.message);
      setMessages(newMsgs); // remove optimistic
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
      <div style={{ marginBottom: 20 }}>
        <div className="page-eyebrow">Knowledge OS · AI</div>
        <div className="flex items-center justify-between">
          <h1 className="page-title">NEXUS AI <span style={{ color:'var(--cyan)', fontSize:14, letterSpacing:2 }}>✦</span></h1>
          <div className="flex gap-3 items-center">
            <select className="input" style={{ width:180, fontSize:12 }} value={subject} onChange={e => setSubject(e.target.value)}>
              <option value="">General Assistant</option>
              {subjects.map(s => <option key={s.id} value={s.name}>{s.icon} {s.name}</option>)}
            </select>
            {messages.length > 0 && <button className="btn btn-ghost" style={{ fontSize:11 }} onClick={clear}>Clear</button>}
          </div>
        </div>
        {subject && <p className="page-subtitle">Context: Studying <span style={{ color:'var(--cyan)' }}>{subject}</span></p>}
      </div>

      {/* Messages */}
      <div className="chat-messages" style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:16, paddingBottom:12 }}>
        {messages.length === 0 && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1, gap:24, paddingBottom:40 }}>
            {/* Logo */}
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:52, marginBottom:8, filter:'drop-shadow(0 0 20px var(--cyan))' }}>✦</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:20, color:'var(--text-bright)', letterSpacing:2 }}>NEXUS AI</div>
              <p style={{ color:'var(--text-muted)', fontSize:13, marginTop:8 }}>Your intelligent study companion</p>
            </div>
            {/* Suggestion chips */}
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
      <div style={{ display:'flex', gap:10, paddingTop:12, borderTop:'1px solid var(--border)' }}>
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
  );
}
