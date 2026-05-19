import { useState } from 'react';

const RESOURCES = [
  { title: 'C++ Reference', type: 'Documentation', url: '#', category: 'C++', icon: '⚙' },
  { title: 'The Modern C++ Challenge', type: 'Book', url: '#', category: 'C++', icon: '📚' },
  { title: 'MDN Web Docs', type: 'Documentation', url: '#', category: 'Software Engineering', icon: '🌐' },
  { title: 'React Beta Docs', type: 'Documentation', url: '#', category: 'Software Engineering', icon: '⚛' },
  { title: 'Linear Algebra Done Right', type: 'Book', url: '#', category: 'Mathematics', icon: '📐' },
  { title: '3Blue1Brown Calculus', type: 'Video Course', url: '#', category: 'Mathematics', icon: '🎥' },
  { title: 'Refactoring UI', type: 'Book', url: '#', category: 'Graphic Design', icon: '🎨' },
  { title: 'Awwwards', type: 'Inspiration', url: '#', category: 'Graphic Design', icon: '✨' },
];

export default function ResourcesView() {
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', ...new Set(RESOURCES.map(r => r.category))];
  const filtered = filter === 'All' ? RESOURCES : RESOURCES.filter(r => r.category === filter);

  return (
    <div className="view">
      <div className="page-header">
        <div className="page-eyebrow">Knowledge OS · Library</div>
        <h1 className="page-title">Resources</h1>
        <p className="page-subtitle">Curated links, books, and courses for your mastery.</p>
      </div>

      <div className="flex gap-2 mb-6">
        {categories.map(c => (
          <button
            key={c}
            className={`btn ${filter === c ? 'btn-purple' : 'btn-ghost'}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {filtered.map((r, i) => (
          <div key={i} className="card clickable" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '32px', background: 'var(--surface)', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
              {r.icon}
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-bright)', marginBottom: '4px' }}>{r.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.type} · {r.category}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
