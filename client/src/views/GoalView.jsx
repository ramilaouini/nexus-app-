import { useState, useEffect } from 'react';

const INITIAL_COURSES = [
  { id: 1, name: 'C++ Systems Programming', grade: 14.5, coeff: 3 },
  { id: 2, name: 'Algorithms & Data Structures', grade: 15.0, coeff: 3 },
  { id: 3, name: 'Calculus & Matrix Algebra', grade: 11.0, coeff: 2 },
  { id: 4, name: 'SQL Database Architecture', grade: 16.5, coeff: 2.5 },
  { id: 5, name: 'Computer Network Protocols', grade: 13.0, coeff: 2 }
];

export default function GoalView() {
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('nexus_courses_list');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('');
  const [newCoeff, setNewCoeff] = useState('');

  useEffect(() => {
    localStorage.setItem('nexus_courses_list', JSON.stringify(courses));
  }, [courses]);

  const addCourse = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newGrade || !newCoeff) return;
    const item = {
      id: Date.now(),
      name: newName,
      grade: Math.min(20, Math.max(0, Number(newGrade))),
      coeff: Math.max(0.5, Number(newCoeff))
    };
    setCourses([...courses, item]);
    setNewName('');
    setNewGrade('');
    setNewCoeff('');
  };

  const removeCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  // Compute ESPRIT Moyenne (Weighted Average)
  const totalCoeff = courses.reduce((acc, curr) => acc + curr.coeff, 0);
  const weightedSum = courses.reduce((acc, curr) => acc + (curr.grade * curr.coeff), 0);
  const moyenne = totalCoeff > 0 ? (weightedSum / totalCoeff) : 0;

  // Compute honors status based on Tunisian/ESPRIT standards
  let mention = 'Refusé';
  let statusColor = '#ef4444';
  let passed = false;

  if (moyenne >= 16) {
    mention = 'Très Bien (Excellent)';
    statusColor = 'var(--cyan)';
    passed = true;
  } else if (moyenne >= 14) {
    mention = 'Bien';
    statusColor = 'var(--purple)';
    passed = true;
  } else if (moyenne >= 12) {
    mention = 'Assez Bien';
    statusColor = 'var(--green)';
    passed = true;
  } else if (moyenne >= 10) {
    mention = 'Passable';
    statusColor = 'var(--orange)';
    passed = true;
  }

  // Circular progress specs
  const RADIUS = 80;
  const CIRC = 2 * Math.PI * RADIUS;
  const strokeDashoffset = CIRC * (1 - (moyenne / 20));

  return (
    <div className="view" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      
      <div className="page-header" style={{ flexShrink: 0, marginBottom: 20 }}>
        <div className="page-eyebrow">Knowledge OS · Syllabus Tracker</div>
        <h1 className="page-title">📊 Grade Coefficient & GPA Tracker</h1>
        <p className="page-subtitle">Input your ESPRIT course grades and coefficients to calculate your overall engineering Weighted Moyenne!</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, paddingBottom: 40 }}>
        
        {/* Left Column: Grade Calculator Inputs & Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Form Creator */}
          <form onSubmit={addCourse} className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, padding: 20, alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>COURSE NAME</span>
              <input className="input" placeholder="e.g. Embedded Programming" value={newName} onChange={e => setNewName(e.target.value)} required />
            </div>
            
            <div style={{ width: 110 }}>
              <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>GRADE (0 - 20)</span>
              <input className="input" type="number" min="0" max="20" step="0.1" placeholder="e.g. 15.5" value={newGrade} onChange={e => setNewGrade(e.target.value)} required />
            </div>

            <div style={{ width: 110 }}>
              <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>COEFFICIENT</span>
              <input className="input" type="number" min="0.5" max="10" step="0.1" placeholder="e.g. 3" value={newCoeff} onChange={e => setNewCoeff(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-cyan" style={{ height: 40 }}>+ Add Course</button>
          </form>

          {/* Table list */}
          <div className="card" style={{ padding: 20 }}>
            <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1, display: 'block', marginBottom: 12 }}>ACTIVE SEMESTER SYLLABUS</span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {courses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: 13 }}>No courses added yet.</div>
              ) : (
                courses.map(c => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                    <div>
                      <strong style={{ fontSize: 14, color: 'var(--text-bright)' }}>{c.name}</strong>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Coefficient: {c.coeff}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 16, fontWeight: 'bold', color: c.grade >= 10 ? 'var(--green)' : '#ef4444' }}>{c.grade.toFixed(1)} / 20</div>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Weighted: {(c.grade * c.coeff).toFixed(1)}</span>
                      </div>
                      <button className="btn btn-danger btn-icon" style={{ width: 24, height: 24, fontSize: 10 }} onClick={() => removeCourse(c.id)}>✕</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Visual Weighted Moyenne gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Moyenne Visualizer Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 30, textAlign: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>WEIGHTED MOYENNE AVERAGE</span>
            
            <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="10" />
                <circle 
                  cx="100" cy="100" r={RADIUS} fill="none" 
                  stroke={statusColor} strokeWidth="10" 
                  strokeDasharray={CIRC}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ 
                    transform: 'rotate(-90deg)', transformOrigin: '50% 50%',
                    filter: `drop-shadow(0 0 10px ${statusColor}55)`,
                    transition: 'stroke-dashoffset 0.6s ease'
                  }}
                />
              </svg>

              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: '#fff', fontFamily: 'var(--font-display)' }}>{moyenne.toFixed(2)}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>out of 20</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, width: '100%', marginTop: 20 }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>HONORS Mentions</span>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: statusColor, textTransform: 'uppercase', marginTop: 4 }}>{mention}</div>
              <div style={{ 
                marginTop: 10, fontSize: 12, padding: '4px 12px', borderRadius: 20, display: 'inline-block',
                background: passed ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                border: passed ? '1px solid var(--green)' : '1px solid #ef4444',
                color: passed ? 'var(--green)' : '#ef4444'
              }}>
                {passed ? '🟢 ADMIS (Passed)' : '🔴 REFUSÉ (Below 10)'}
              </div>
            </div>
          </div>

          {/* Tunisian engineering guide */}
          <div className="card" style={{ padding: 20 }}>
            <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--purple)', display: 'block', marginBottom: 10 }}>📖 TUNISIAN HIERARCHY SCALE</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>16.00 - 20.00</span><strong style={{color:'var(--cyan)'}}>Très Bien</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>14.00 - 15.99</span><strong style={{color:'var(--purple)'}}>Bien</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>12.00 - 13.99</span><strong style={{color:'var(--green)'}}>Assez Bien</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>10.00 - 11.99</span><strong style={{color:'var(--orange)'}}>Passable</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Below 10.00</span><strong style={{color:'#ef4444'}}>Refusé</strong></div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
