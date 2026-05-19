import { useState } from 'react';

const VIDEO_COURSES = [
  { 
    title: '🐍 Python for Beginners', 
    creator: 'Programming with Mosh', 
    id: 'kqtD5dpn9C8', 
    desc: 'The ultimate crash course to master Python programming from absolute scratch.',
    duration: '6 hours',
    category: 'Backend Development'
  },
  { 
    title: '💻 C++ Programming Course', 
    creator: 'freeCodeCamp', 
    id: 'vLnPwxZdW4Y', 
    desc: 'Engineering-grade core compiler mechanics, pointer variables, and structural memory layout.',
    duration: '31 hours',
    category: 'System Programming'
  },
  { 
    title: '⚛️ ReactJS SPA Masterclass', 
    creator: 'Dave Gray', 
    id: 'hQAHSlTt2Gs', 
    desc: 'Modern frontend application development, hooks, state loops, routing, and deployment templates.',
    duration: '12 hours',
    category: 'Frontend Development'
  },
  { 
    title: '🌐 HTML & CSS Design Masterclass', 
    creator: 'SuperSimpleDev', 
    id: 'G3e-cpL7ofc', 
    desc: 'Curated styling methodologies, flexbox matrices, standard UI grids, and responsive layouts.',
    duration: '6 hours',
    category: 'Web Design'
  },
  { 
    title: '⚡ JavaScript Engine Foundations', 
    creator: 'Bro Code', 
    id: 'lfmg-Di8YLM', 
    desc: 'Complete programming logic, DOM manipulation triggers, async operations, and promise handling.',
    duration: '8 hours',
    category: 'Frontend Development'
  },
  { 
    title: '⚙️ Algorithms & Data Structures', 
    creator: 'freeCodeCamp', 
    id: '8hly31xKjns', 
    desc: 'A comprehensive study of big O notation, stack frames, queues, linked lists, and tree traversals.',
    duration: '7 hours',
    category: 'Computer Science'
  }
];

const DOCUMENTATIONS = [
  { title: 'C++ Reference Docs', type: 'Doc', url: 'https://en.cppreference.com/', category: 'System Programming', icon: '⚙' },
  { title: 'MDN Web Resources', type: 'Doc', url: 'https://developer.mozilla.org/', category: 'Frontend Development', icon: '🌐' },
  { title: 'React Documentation', type: 'Doc', url: 'https://react.dev/', category: 'Frontend Development', icon: '⚛' },
  { title: 'Learn Python Org', type: 'Doc', url: 'https://www.learnpython.org/', category: 'Backend Development', icon: '🐍' }
];

export default function ResourcesView() {
  const [activeTab, setActiveTab] = useState('videos'); // 'videos' | 'docs'
  const [selectedVideo, setSelectedVideo] = useState(VIDEO_COURSES[0]);

  return (
    <div className="view" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="page-header" style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div className="page-eyebrow">Knowledge OS · Core Library</div>
          <h1 className="page-title">📚 Library & Videos</h1>
          <p className="page-subtitle">Learn from top explainer courses and browse comprehensive documentations.</p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 4 }}>
          <button 
            className={`btn ${activeTab === 'videos' ? 'btn-purple' : 'btn-ghost'}`} 
            style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8 }}
            onClick={() => setActiveTab('videos')}
          >
            🎥 Tutorial Videos
          </button>
          <button 
            className={`btn ${activeTab === 'docs' ? 'btn-cyan' : 'btn-ghost'}`} 
            style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8 }}
            onClick={() => setActiveTab('docs')}
          >
            📄 Documentation
          </button>
        </div>
      </div>

      {activeTab === 'videos' ? (
        /* Video Explainer Section */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, flex: 1, overflow: 'hidden', paddingBottom: 20 }}>
          
          {/* Active Video Player */}
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
              <div className="badge badge-purple" style={{ marginBottom: 8 }}>{selectedVideo.category}</div>
              <h2 style={{ color: 'var(--text-bright)', fontSize: 22, fontWeight: 800 }}>{selectedVideo.title}</h2>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 12px' }}>
                Course by <strong>{selectedVideo.creator}</strong> | Duration: {selectedVideo.duration}
              </div>
              <p style={{ color: 'var(--text)', fontSize: 14, lineHeight: 1.6 }}>{selectedVideo.desc}</p>
            </div>
          </div>

          {/* Video List Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1 }}>SELECT COURSE</div>
            {VIDEO_COURSES.map(v => (
              <div 
                key={v.id} 
                onClick={() => setSelectedVideo(v)}
                className="card clickable"
                style={{ 
                  padding: 16, display: 'flex', flexDirection: 'column', gap: 8,
                  background: selectedVideo.id === v.id ? 'var(--cyan-dim)' : 'var(--surface)',
                  border: selectedVideo.id === v.id ? '1px solid var(--cyan)' : '1px solid var(--border)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)' }}>{v.category}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{v.duration}</span>
                </div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-bright)', lineHeight: 1.3 }}>{v.title}</h3>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{v.creator}</span>
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* Original Curated Documentation Links */
        <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {DOCUMENTATIONS.map((r, i) => (
            <a 
              key={i} 
              href={r.url} 
              target="_blank" 
              rel="noreferrer" 
              className="card clickable" 
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, textDecoration: 'none' }}
            >
              <div style={{ fontSize: 28, background: 'var(--cyan-dim)', width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12 }}>
                {r.icon}
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 'bold', color: 'var(--text-bright)', marginBottom: 4 }}>{r.title}</h3>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.type} · {r.category}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
