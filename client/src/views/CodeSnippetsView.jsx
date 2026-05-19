import { useState, useEffect } from 'react';
import { api } from '../api';

export default function CodeSnippetsView({ user }) {
  const [snippets, setSnippets] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = async () => {
    const data = await api.get('/snippets?user_id=' + user.id);
    setSnippets(data);
    if (data.length > 0 && !activeId) setActiveId(data[0].id);
  };

  const activeSnippet = snippets.find(s => s.id === activeId) || snippets[0];

  const handleCopy = () => {
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

  return (
    <div className="view">
      <div className="page-header flex justify-between items-center">
        <div>
          <div className="page-eyebrow">Knowledge OS · Vault</div>
          <h1 className="page-title">Code Snippets</h1>
          <p className="page-subtitle">Your personal collection of reusable code blocks.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-purple" onClick={generateRandomSnippet} disabled={loading}>
            {loading ? 'Generating...' : '✦ AI Random Snippet'}
          </button>
          <button className="btn btn-cyan" onClick={handleNew}>+ New Snippet</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', height: 'calc(100vh - 200px)' }}>
        {/* Sidebar list */}
        <div className="card" style={{ overflowY: 'auto', padding: '12px' }}>
          {snippets.map(snip => (
            <div 
              key={snip.id}
              onClick={() => { setActiveId(snip.id); setIsEditing(false); }}
              style={{
                padding: '16px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: activeId === snip.id ? 'var(--surface)' : 'transparent',
                border: activeId === snip.id ? '1px solid var(--cyan)' : '1px solid transparent',
                marginBottom: '8px',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: 'bold', color: 'var(--text-bright)', marginBottom: '4px' }}>{snip.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{snip.lang}</div>
            </div>
          ))}
        </div>

        {/* Editor area */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ marginBottom: '16px' }}>
                <input 
                  className="input" 
                  value={editForm.title} 
                  onChange={e => setEditForm({...editForm, title: e.target.value})}
                  style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}
                />
                <div className="flex gap-2">
                  <input 
                    className="input" 
                    placeholder="Language (e.g. cpp, python)" 
                    value={editForm.lang} 
                    onChange={e => setEditForm({...editForm, lang: e.target.value})}
                    style={{ width: '200px' }}
                  />
                  <input 
                    className="input" 
                    placeholder="Tags (comma separated)" 
                    value={editForm.tags.join(', ')} 
                    onChange={e => setEditForm({...editForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                  />
                </div>
              </div>
              
              <textarea 
                className="input"
                style={{ 
                  flex: 1, 
                  fontFamily: 'var(--font-mono)', 
                  color: 'var(--green)', 
                  resize: 'none',
                  background: '#040b14',
                  padding: '24px'
                }}
                value={editForm.code}
                onChange={e => setEditForm({...editForm, code: e.target.value})}
              />
              
              <div className="flex justify-end gap-3 mt-4">
                <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="btn btn-cyan" onClick={handleSave}>Save Snippet</button>
              </div>
            </div>
          ) : (
            <>
              {activeSnippet ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '20px', color: 'var(--text-bright)' }}>{activeSnippet.title}</h2>
                    <div className="flex gap-2">
                      {activeSnippet.tags.map(t => <span key={t} className="badge badge-cyan">{t}</span>)}
                    </div>
                  </div>
                  
                  <div style={{ 
                    flex: 1, 
                    background: '#040b14', 
                    borderRadius: '12px', 
                    border: '1px solid var(--border)',
                    padding: '24px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    color: 'var(--green)',
                    whiteSpace: 'pre-wrap',
                    overflowY: 'auto'
                  }}>
                    {activeSnippet.code}
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-4">
                    <button className="btn" style={{background:'#ef4444', color:'#fff'}} onClick={handleDelete}>Delete</button>
                    <button className="btn btn-ghost" onClick={handleEdit}>Edit</button>
                    <button className={`btn ${copied ? 'btn-purple' : 'btn-cyan'}`} onClick={handleCopy}>
                      {copied ? '✓ Copied!' : 'Copy Code'}
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  Select or create a snippet.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
