import { useState, useEffect, useRef } from 'react';
import { api } from '../api';

const COLORS = ['#00e5ff','#a855f7','#ff7043','#00e676','#ffd740','#40c4ff','#ff4081','#69f0ae'];
const ICONS   = ['📚','∑','⚛','🏛','語','φ','</','🔬','🎨','🌍','⚗','🧬','🎵','📐'];
const CATS    = ['Science','Technology','Humanities','Arts','Mathematics','Languages','General'];

function SubjectCard({ s, onEdit, onDelete, onClick }) {
  const cardRef = useRef();

  const onMouseMove = (e) => {
    const el = cardRef.current;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = ((e.clientX - left) / width  - 0.5) * 18;
    const y = ((e.clientY - top)  / height - 0.5) * -14;
    el.style.transform = `translateY(-6px) rotateY(${x}deg) rotateX(${y}deg)`;
  };
  const onMouseLeave = () => {
    cardRef.current.style.transform = '';
  };

  const pct = s.card_count > 0 ? Math.min(Math.round(s.accuracy || 0), 100) : 0;

  return (
    <div
      ref={cardRef}
      className="subject-card"
      style={{ '--sc': s.color, transition:'transform 0.15s, border-color 0.25s, box-shadow 0.25s' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={() => onClick(s)}
    >
      <span className="subject-icon">{s.icon}</span>
      <div className="subject-name">{s.name}</div>
      <div className="subject-category">{s.category}</div>
      <div className="subject-stats">
        <div className="subject-stat"><strong>{s.card_count}</strong> cards</div>
        <div className="subject-stat"><strong>{s.note_count}</strong> notes</div>
        <div className="subject-stat"><strong>{Math.round(s.total_minutes || 0)}</strong> min</div>
      </div>
      <div className="progress-bar mb-3">
        <div className="progress-fill" style={{ width:`${pct}%` }} />
      </div>
      <div className="flex justify-between items-center">
        <span style={{ fontSize:10, color:'var(--text-muted)', letterSpacing:1 }}>
          {pct}% accuracy
        </span>
        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          <button className="btn btn-ghost btn-icon" style={{ width:28, height:28, fontSize:13 }}
            onClick={() => onEdit(s)}>✎</button>
          <button className="btn btn-danger btn-icon" style={{ width:28, height:28, fontSize:13 }}
            onClick={() => onDelete(s.id)}>✕</button>
        </div>
      </div>
    </div>
  );
}

function SubjectModal({ subject, onClose, onSave }) {
  const [form, setForm] = useState(subject || { name:'', icon:'📚', color:'#00e5ff', category:'General', description:'' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name.trim()) return;
    await onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{subject ? 'EDIT SUBJECT' : 'NEW SUBJECT'}</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-form">
          <div>
            <div className="input-label">Name</div>
            <input className="input" placeholder="Subject name" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="grid-2">
            <div>
              <div className="input-label">Icon</div>
              <select className="input" value={form.icon} onChange={e => set('icon', e.target.value)}>
                {ICONS.map(i => <option key={i} value={i}>{i} {i}</option>)}
              </select>
            </div>
            <div>
              <div className="input-label">Category</div>
              <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <div className="input-label">Color</div>
            <div className="color-picker">
              {COLORS.map(c => (
                <div key={c} className={`color-dot${form.color===c?' selected':''}`}
                  style={{ background: c, boxShadow: form.color===c ? `0 0 12px ${c}` : 'none' }}
                  onClick={() => set('color', c)} />
              ))}
            </div>
          </div>
          <div>
            <div className="input-label">Description</div>
            <input className="input" placeholder="Short description (optional)" value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-cyan" onClick={save}>
            {subject ? 'Save Changes' : '+ Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SubjectsView({ onSelectSubject }) {
  const [subjects, setSubjects] = useState([]);
  const [modal, setModal]   = useState(null); // null | 'add' | subject obj
  const [search, setSearch] = useState('');

  const load = () => api.subjects.list().then(setSubjects);
  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (typeof modal === 'object' && modal?.id) {
      await api.subjects.update(modal.id, form);
    } else {
      await api.subjects.create(form);
    }
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this subject and all its cards/notes?')) return;
    await api.subjects.delete(id);
    load();
  };

  const filtered = subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="view">
      <div className="page-header">
        <div className="page-eyebrow">Knowledge OS · Subjects</div>
        <div className="flex items-center justify-between">
          <h1 className="page-title">Subjects</h1>
          <div className="flex gap-3 items-center">
            <input className="input" style={{ width:200 }} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
            <button className="btn btn-cyan" onClick={() => setModal('add')}>+ New Subject</button>
          </div>
        </div>
        <p className="page-subtitle">{subjects.length} subject{subjects.length !== 1 ? 's' : ''} · Click a card to study its flashcards</p>
      </div>

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign:'center', padding:48 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>◈</div>
          <p style={{ color:'var(--text-muted)', marginBottom:16 }}>No subjects yet. Create your first one.</p>
          <button className="btn btn-cyan" onClick={() => setModal('add')}>+ Create Subject</button>
        </div>
      )}

      <div className="subjects-grid">
        {filtered.map(s => (
          <SubjectCard key={s.id} s={s}
            onEdit={() => setModal(s)}
            onDelete={handleDelete}
            onClick={onSelectSubject}
          />
        ))}
      </div>

      {modal && (
        <SubjectModal
          subject={typeof modal === 'object' && modal?.id ? modal : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
