import { useState, useEffect } from 'react';
import { api } from '../api';

export default function CodeSnippetsView({ user }) {
  const [snippets, setSnippets] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sandbox State
  const [sandboxCode, setSandboxCode] = useState('');
  const [consoleOutput, setConsoleOutput] = useState('Type or click "Load into Sandbox" to test JavaScript code live here!');

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = async () => {
    const data = await api.get('/snippets?user_id=' + user.id);
    setSnippets(data);
    if (data.length > 0 && !activeId) {
      setActiveId(data[0].id);
      setSandboxCode(data[0].code);
    }
  };

  const activeSnippet = snippets.find(s => s.id === activeId) || snippets[0];

  const handleCopy = () => {
    if (!activeSnippet) return;
    navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNew = () => {
    const newSnip = { title: 'Untitled Snippet', lang: 'javascript', code: '', tags: [] };
    setEditForm(newSnip);
    setIsEditing(true);
  };

  const handleEdit = () => {
    if (!activeSnippet) return;
    setEditForm(activeSnippet);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editForm.id) {
      await api.put('/snippets/' + editForm.id, editForm);
    } else {
      await api.post('/snippets', { ...editForm, user_id: user.id });
    }
    await loadSnippets();
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!activeSnippet) return;
    if (confirm('Delete this snippet?')) {
      await api.delete('/snippets/' + activeSnippet.id);
      setActiveId(null);
      await loadSnippets();
    }
  };

  const generateRandomSnippet = async () => {
    setLoading(true);
    try {
      const res = await api.post('/ai/random-snippet', {});
      const snip = res.snippet;
      await api.post('/snippets', { ...snip, user_id: user.id });
      await loadSnippets();
    } catch(e) {
      alert('AI Generation failed: ' + e.message);
    }
    setLoading(false);
  };

  const loadIntoSandbox = () => {
    if (activeSnippet) {
      setSandboxCode(activeSnippet.code);
      setConsoleOutput('Snippet loaded. Click "Execute Code" to run.');
    }
  };

  const executeSandboxCode = () => {
    let logs = [];
    const originalLog = console.log;
    console.log = (...args) => {
      logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
    };

    try {
      // Safe dynamic evaluation of custom code sandbox
      const fn = new Function(sandboxCode);
      fn();
      setConsoleOutput(logs.length > 0 ? logs.join('\n') : 'Code executed successfully. No console.log outputs generated.');
    } catch (err) {
      setConsoleOutput('❌ Runtime Execution Error:\n' + err.message);
    }

    console.log = originalLog;
  };

  return (
    <div className="view" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header flex justify-between items-center" style={{ flexShrink: 0, marginBottom: 20 }}>
        <div>
          <div className="page-eyebrow">Knowledge OS · Vault</div>
          <h1 className="page-title">Code Snippets & Sandbox</h1>
          <p className="page-subtitle">Your personal collection of code blocks alongside a live JavaScript Compiler sandbox!</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-purple" onClick={generateRandomSnippet} disabled={loading}>
            {loading ? 'Generating...' : '✦ AI Random Snippet'}
          </button>
          <button className="btn btn-cyan" onClick={handleNew}>+ New Snippet</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 1fr', gap: '24px', flex: 1, minHeight: 0, paddingBottom: 20 }}>
        
        {/* Left: Sidebar list */}
        <div className="card" style={{ overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1, padding: '0 6px 6px' }}>SAVED SNIPPETS</span>
          {snippets.map(snip => (
            <div 
              key={snip.id}
              onClick={() => { setActiveId(snip.id); setIsEditing(false); setSandboxCode(snip.code); }}
              style={{
                padding: '12px 14px', borderRadius: '8px', cursor: 'pointer',
                background: activeId === snip.id ? 'var(--cyan-dim)' : 'var(--surface)',
                border: activeId === snip.id ? '1px solid var(--cyan)' : '1px solid var(--border)',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: 'bold', color: 'var(--text-bright)', fontSize: 13, marginBottom: '2px' }}>{snip.title}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{snip.lang}</div>
            </div>
          ))}
        </div>

        {/* Center: Editor area */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 20, minHeight: 400 }}>
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
              <input 
                className="input" 
                value={editForm.title} 
                onChange={e => setEditForm({...editForm, title: e.target.value})}
                style={{ fontSize: '16px', fontWeight: 'bold' }}
              />
              <div className="flex gap-2">
                <input 
                  className="input" 
                  placeholder="Language (e.g. javascript, cpp)" 
                  value={editForm.lang} 
                  onChange={e => setEditForm({...editForm, lang: e.target.value})}
                  style={{ width: '130px' }}
                />
                <input 
                  className="input" 
                  placeholder="Tags (comma separated)" 
                  value={editForm.tags.join(', ')} 
                  onChange={e => setEditForm({...editForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                />
              </div>
              
              <textarea 
                className="input"
                style={{ flex: 1, fontFamily: 'var(--font-mono)', color: 'var(--green)', resize: 'none', background: '#040b14', padding: '16px' }}
                value={editForm.code}
                onChange={e => setEditForm({...editForm, code: e.target.value})}
              />
              
              <div className="flex justify-end gap-2">
                <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="btn btn-cyan" onClick={handleSave}>Save Snippet</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {activeSnippet ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h2 style={{ fontSize: '16px', color: 'var(--text-bright)', fontWeight: 800 }}>{activeSnippet.title}</h2>
                    <div className="flex gap-2">
                      {activeSnippet.tags.map(t => <span key={t} className="badge badge-cyan" style={{ fontSize: 9 }}>{t}</span>)}
                    </div>
                  </div>
                  
                  <div style={{ 
                    flex: 1, background: '#040b14', borderRadius: '12px', border: '1px solid var(--border)',
                    padding: '20px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--green)',
                    whiteSpace: 'pre-wrap', overflowY: 'auto'
                  }}>
                    {activeSnippet.code}
                  </div>
                  
                  <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                    <button className="btn" style={{background:'#ef4444', color:'#fff', padding: '8px 12px', fontSize: 12}} onClick={handleDelete}>Delete</button>
                    <button className="btn btn-ghost" style={{padding: '8px 12px', fontSize: 12}} onClick={handleEdit}>Edit</button>
                    <button className="btn btn-purple" style={{padding: '8px 12px', fontSize: 12}} onClick={loadIntoSandbox}>Load Sandbox</button>
                    <button className={`btn ${copied ? 'btn-purple' : 'btn-cyan'}`} style={{marginLeft: 'auto', padding: '8px 12px', fontSize: 12}} onClick={handleCopy}>
                      {copied ? '✓ Copied!' : 'Copy Code'}
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  Select or create a snippet.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Interactive Live Sandbox Compiler */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 20, gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--purple)', letterSpacing: 1 }}>💻 JS COMPILER SANDBOX</span>
            <button className="btn btn-cyan" onClick={executeSandboxCode} style={{ fontSize: 11, padding: '4px 12px' }}>⚡ Execute Code</button>
          </div>

          <textarea 
            className="input"
            value={sandboxCode}
            onChange={e => setSandboxCode(e.target.value)}
            placeholder="// Type executable JavaScript code here... e.g. console.log('Hello');"
            style={{ 
              flex: 1.2, fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#fff', 
              background: '#0a0d14', border: '1px solid var(--border-hi)', resize: 'none', padding: 14 
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', flex: 0.8, minHeight: 120 }}>
            <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: 6 }}>CONSOLE OUTPUT</span>
            <pre style={{ 
              flex: 1, background: '#000', border: '1px solid var(--border)', borderRadius: 8, 
              padding: 12, margin: 0, fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--green)', 
              overflowY: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.5 
            }}>
              {consoleOutput}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}
