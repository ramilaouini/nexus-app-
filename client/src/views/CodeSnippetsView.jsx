import { useState } from 'react';

const SNIPPETS = [
  { id: 1, title: 'C++ Fast I/O', lang: 'cpp', code: 'ios_base::sync_with_stdio(false);\ncin.tie(NULL);', tags: ['C++', 'Competitive Programming'] },
  { id: 2, title: 'React UseEffect Fetch', lang: 'javascript', code: 'useEffect(() => {\n  const fetchData = async () => {\n    const res = await fetch("/api/data");\n    const json = await res.json();\n    setData(json);\n  };\n  fetchData();\n}, []);', tags: ['React', 'JavaScript'] },
  { id: 3, title: 'CSS Glassmorphism', lang: 'css', code: '.glass {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 16px;\n}', tags: ['CSS', 'Design'] },
  { id: 4, title: 'Python List Comprehension', lang: 'python', code: 'squares = [x**2 for x in range(10) if x % 2 == 0]', tags: ['Python'] },
];

export default function CodeSnippetsView() {
  const [activeSnippet, setActiveSnippet] = useState(SNIPPETS[0]);

  return (
    <div className="view">
      <div className="page-header flex justify-between items-center">
        <div>
          <div className="page-eyebrow">Knowledge OS · Vault</div>
          <h1 className="page-title">Code Snippets</h1>
          <p className="page-subtitle">Your personal collection of reusable code blocks.</p>
        </div>
        <button className="btn btn-cyan">+ New Snippet</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', height: 'calc(100vh - 200px)' }}>
        {/* Sidebar list */}
        <div className="card" style={{ overflowY: 'auto', padding: '12px' }}>
          {SNIPPETS.map(snip => (
            <div 
              key={snip.id}
              onClick={() => setActiveSnippet(snip)}
              style={{
                padding: '16px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: activeSnippet.id === snip.id ? 'var(--surface)' : 'transparent',
                border: activeSnippet.id === snip.id ? '1px solid var(--cyan)' : '1px solid transparent',
                marginBottom: '8px'
              }}
            >
              <div style={{ fontWeight: 'bold', color: 'var(--text-bright)', marginBottom: '4px' }}>{snip.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{snip.lang}</div>
            </div>
          ))}
        </div>

        {/* Editor area */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
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
            <button className="btn btn-ghost">Edit</button>
            <button className="btn btn-cyan">Copy Code</button>
          </div>
        </div>
      </div>
    </div>
  );
}
