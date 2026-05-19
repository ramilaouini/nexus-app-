import { useState } from 'react';

const ROADMAPS = [
  { id: 'dev', name: 'Software Engineering', icon: '💻', color: 'var(--cyan)' },
  { id: 'math', name: 'Advanced Mathematics', icon: '∑', color: 'var(--purple)' },
  { id: 'design', name: 'Graphic Design', icon: '🎨', color: 'var(--orange)' },
  { id: 'cpp', name: 'C++ Mastery', icon: '⚙', color: 'var(--green)' }
];

const STEPS = {
  dev: [
    { title: 'Fundamentals', desc: 'Variables, loops, functions, basic DS', status: 'done' },
    { title: 'Frontend Basics', desc: 'HTML, CSS, JavaScript, React', status: 'active' },
    { title: 'Backend & DB', desc: 'Node.js, Express, SQL, NoSQL', status: 'pending' },
    { title: 'System Design', desc: 'Architecture, scalability, microservices', status: 'pending' }
  ],
  math: [
    { title: 'Algebra & Geometry', desc: 'Foundations of mathematics', status: 'done' },
    { title: 'Calculus I & II', desc: 'Limits, derivatives, integrals', status: 'done' },
    { title: 'Linear Algebra', desc: 'Vectors, matrices, transformations', status: 'active' },
    { title: 'Differential Equations', desc: 'ODEs, PDEs, dynamic systems', status: 'pending' }
  ],
  design: [
    { title: 'Color Theory', desc: 'Harmony, palettes, psychology', status: 'done' },
    { title: 'Typography', desc: 'Fonts, pairing, readability', status: 'active' },
    { title: 'UI/UX Fundamentals', desc: 'Wireframing, prototyping, user testing', status: 'pending' },
    { title: '3D & Motion', desc: 'Blender, After Effects, micro-interactions', status: 'pending' }
  ],
  cpp: [
    { title: 'C++ Basics', desc: 'Syntax, pointers, memory management', status: 'active' },
    { title: 'Object-Oriented', desc: 'Classes, inheritance, polymorphism', status: 'pending' },
    { title: 'STL & Templates', desc: 'Vectors, maps, generic programming', status: 'pending' },
    { title: 'Advanced C++', desc: 'Concurrency, metaprogramming, optimization', status: 'pending' }
  ]
};

export default function RoadmapView() {
  const [activeRoadmap, setActiveRoadmap] = useState('dev');

  return (
    <div className="view">
      <div className="page-header">
        <div className="page-eyebrow">Knowledge OS · Learning Paths</div>
        <h1 className="page-title">Roadmaps</h1>
        <p className="page-subtitle">Structured learning paths for engineering and design.</p>
      </div>

      <div className="flex gap-4 mb-8" style={{ overflowX: 'auto', paddingBottom: '10px' }}>
        {ROADMAPS.map(rm => (
          <button
            key={rm.id}
            className={`btn ${activeRoadmap === rm.id ? 'btn-cyan' : 'btn-ghost'}`}
            style={{ fontSize: 13, padding: '12px 20px', ...(activeRoadmap === rm.id ? { '--cyan': rm.color, '--cyan-dim': rm.color + '22' } : {}) }}
            onClick={() => setActiveRoadmap(rm.id)}
          >
            <span style={{ fontSize: 18 }}>{rm.icon}</span> {rm.name}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: '40px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-bright)', marginBottom: '30px' }}>
          {ROADMAPS.find(r => r.id === activeRoadmap).name} Journey
        </h2>
        
        <div className="roadmap-timeline">
          {STEPS[activeRoadmap].map((step, i) => (
            <div key={i} className={`timeline-step ${step.status}`}>
              <div className="step-marker">
                {step.status === 'done' ? '✓' : step.status === 'active' ? '●' : '○'}
              </div>
              <div className="step-content">
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
