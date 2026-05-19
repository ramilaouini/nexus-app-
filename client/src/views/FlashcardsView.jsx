import { useState, useEffect } from 'react';
import { api } from '../api';

function AddCardModal({ subjects, onClose, onSave, defaultSubjectId }) {
  const [form, setForm] = useState({ subject_id: defaultSubjectId || (subjects[0]?.id || ''), front:'', back:'' });
  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  const save = async () => {
    if (!form.front.trim() || !form.back.trim() || !form.subject_id) return;
    await onSave(form);
    onClose();
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">NEW FLASHCARD</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-form">
          <div>
            <div className="input-label">Subject</div>
            <select className="input" value={form.subject_id} onChange={e => set('subject_id', +e.target.value)}>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
            </select>
          </div>
          <div>
            <div className="input-label">Question (Front)</div>
            <textarea className="input" style={{ height:90, resize:'none', lineHeight:1.6 }}
              placeholder="What do you want to be asked?" value={form.front}
              onChange={e => set('front', e.target.value)} />
          </div>
          <div>
            <div className="input-label">Answer (Back)</div>
            <textarea className="input" style={{ height:90, resize:'none', lineHeight:1.6 }}
              placeholder="The answer…" value={form.back}
              onChange={e => set('back', e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-cyan" onClick={save}>+ Add Card</button>
        </div>
      </div>
    </div>
  );
}

function GenModal({ subjects, onClose, onGenerate }) {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [sid, setSid] = useState(subjects[0]?.id || '');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try { await onGenerate(topic, count, +sid); onClose(); }
    catch (e) { alert('AI Error: ' + e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">✦ AI GENERATE CARDS</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-form">
          <div>
            <div className="input-label">Topic</div>
            <input className="input" placeholder="e.g. Quantum Mechanics, World War II..." value={topic} onChange={e => setTopic(e.target.value)} />
          </div>
          <div className="grid-2">
            <div>
              <div className="input-label">Number of Cards</div>
              <select className="input" value={count} onChange={e => setCount(+e.target.value)}>
                {[3,5,8,10].map(n => <option key={n} value={n}>{n} cards</option>)}
              </select>
            </div>
            <div>
              <div className="input-label">Add to Subject</div>
              <select className="input" value={sid} onChange={e => setSid(e.target.value)}>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-cyan" onClick={generate} disabled={loading}>
            {loading ? <><div className="spinner" />Generating…</> : '✦ Generate'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FlashcardsView({ initialSubjectId }) {
  const [subjects, setSubjects]   = useState([]);
  const [cards, setCards]         = useState([]);
  const [filterSid, setFilterSid] = useState(initialSubjectId || 'all');
  const [idx, setIdx]             = useState(0);
  const [flipped, setFlipped]     = useState(false);
  const [modal, setModal]         = useState(null); // 'add' | 'gen'
  const [mode, setMode]           = useState('study'); // 'study' | 'list'
  const [saving, setSaving]       = useState(false);
  const [feedback, setFeedback]   = useState(null); // 'hard'|'medium'|'easy'

  const load = async () => {
    const [subs, allCards] = await Promise.all([api.subjects.list(), api.flashcards.list()]);
    setSubjects(subs);
    setCards(allCards);
  };
  useEffect(() => { load(); }, []);

  const filtered = filterSid === 'all' ? cards : cards.filter(c => c.subject_id === +filterSid);
  const current  = filtered[idx];

  const next = () => { setFlipped(false); setFeedback(null); setTimeout(() => setIdx(i => (i+1) % Math.max(filtered.length,1)), 100); };
  const prev = () => { setFlipped(false); setFeedback(null); setTimeout(() => setIdx(i => (i-1+filtered.length) % Math.max(filtered.length,1)), 100); };

  const review = async (rating) => {
    if (!current || saving) return;
    setSaving(true); setFeedback(['hard','medium','easy'][rating-1]);
    await api.flashcards.review(current.id, rating).catch(console.error);
    setSaving(false);
    setTimeout(next, 500);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this card?')) return;
    await api.flashcards.delete(id);
    load();
    setIdx(0);
  };

  const subjectColor = (sid) => subjects.find(s => s.id === sid)?.color || 'var(--cyan)';
  const subjectName  = (sid) => subjects.find(s => s.id === sid)?.name || '—';

  return (
    <div className="view">
      {/* Header */}
      <div className="page-header">
        <div className="page-eyebrow">Knowledge OS · Flashcards</div>
        <div className="flex items-center justify-between">
          <h1 className="page-title">Flashcards</h1>
          <div className="flex gap-3">
            <button className="btn btn-ghost" onClick={() => setModal('gen')}>✦ AI Generate</button>
            <button className="btn btn-cyan"  onClick={() => setModal('add')}>+ Add Card</button>
          </div>
        </div>
      </div>

      {/* Filter + Mode */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 flex-wrap">
          <button className={`btn ${filterSid==='all'?'btn-cyan':'btn-ghost'}`}
            style={{ fontSize:11 }} onClick={() => { setFilterSid('all'); setIdx(0); setFlipped(false); }}>
            All ({cards.length})
          </button>
          {subjects.map(s => (
            <button key={s.id}
              className={`btn ${filterSid===s.id?'btn-cyan':'btn-ghost'}`}
              style={{ fontSize:11, '--ac': s.color, ...(filterSid===s.id ? {'--cyan':s.color,'--cyan-dim':`${s.color}22`} : {}) }}
              onClick={() => { setFilterSid(s.id); setIdx(0); setFlipped(false); }}>
              {s.icon} {s.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button className={`btn ${mode==='study'?'btn-cyan':'btn-ghost'}`} style={{ fontSize:11 }} onClick={() => setMode('study')}>⬡ Study</button>
          <button className={`btn ${mode==='list'?'btn-cyan':'btn-ghost'}`}  style={{ fontSize:11 }} onClick={() => setMode('list')}>≡ List</button>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign:'center', padding:48 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>⟡</div>
          <p style={{ color:'var(--text-muted)', marginBottom:16 }}>No cards here. Add some or generate with AI.</p>
          <div className="flex gap-3 justify-center">
            <button className="btn btn-ghost" onClick={() => setModal('gen')}>✦ AI Generate</button>
            <button className="btn btn-cyan"  onClick={() => setModal('add')}>+ Add Card</button>
          </div>
        </div>
      )}

      {/* ── STUDY MODE ── */}
      {mode === 'study' && current && (
        <div>
          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-muted)' }}>
              {idx+1} / {filtered.length}
            </span>
            <div className="progress-bar" style={{ flex:1, margin:'0 16px', '--sc': subjectColor(current.subject_id) }}>
              <div className="progress-fill" style={{ width:`${((idx+1)/filtered.length)*100}%` }} />
            </div>
            <span className="badge badge-cyan" style={{ fontSize:9 }}>{subjectName(current.subject_id)}</span>
          </div>

          {/* 3D Card */}
          <div className="fc-scene" onClick={() => setFlipped(f => !f)}>
            <div className={`fc-inner${flipped?' flipped':''}`}>
              <div className="fc-face fc-front">
                <div className="fc-label">Question</div>
                <div className="fc-text">{current.front}</div>
                <div className="fc-hint">Click to reveal answer</div>
                {/* Decorative rings */}
                <div className="fc-glow-ring" style={{ borderColor:'var(--cyan)', top:-60, right:-60 }} />
              </div>
              <div className="fc-face fc-back">
                <div className="fc-label">Answer</div>
                <div className="fc-text">{current.back}</div>
                <div className="fc-glow-ring" style={{ borderColor:'var(--purple)', bottom:-60, left:-60 }} />
              </div>
            </div>
          </div>

          {/* Rating / Nav */}
          {flipped ? (
            <div>
              <p style={{ textAlign:'center', fontSize:11, letterSpacing:2, color:'var(--text-muted)', marginBottom:12, textTransform:'uppercase' }}>How well did you know it?</p>
              <div className="rating-btns">
                <button className={`rating-btn rating-hard${feedback==='hard'?' ring':''}`}   onClick={() => review(1)}>😓 Hard</button>
                <button className={`rating-btn rating-medium${feedback==='medium'?' ring':''}`} onClick={() => review(2)}>🤔 Medium</button>
                <button className={`rating-btn rating-easy${feedback==='easy'?' ring':''}`}   onClick={() => review(3)}>😎 Easy</button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center gap-4 mt-4">
              <button className="btn btn-ghost" onClick={prev}>← Prev</button>
              <button className="btn btn-ghost" onClick={next}>Next →</button>
            </div>
          )}

          {/* Card stats */}
          <div style={{ display:'flex', justifyContent:'center', gap:24, marginTop:20 }}>
            {[
              { label:'Reviews', val: current.review_count },
              { label:'Correct',  val: current.correct_count },
              { label:'Interval', val: `${current.interval_days}d` },
            ].map(s => (
              <div key={s.label} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:16, color:'var(--cyan)' }}>{s.val}</div>
                <div style={{ fontSize:10, letterSpacing:1.5, color:'var(--text-muted)', textTransform:'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── LIST MODE ── */}
      {mode === 'list' && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {filtered.map((c, i) => (
            <div key={c.id} className="card" style={{ padding:'16px 20px' }}>
              <div className="flex items-center justify-between">
                <div style={{ flex:1, marginRight:16 }}>
                  <div style={{ fontSize:13, color:'var(--text-bright)', marginBottom:5, fontWeight:600 }}>{c.front}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>{c.back}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="badge badge-cyan" style={{ fontSize:9 }}>{c.review_count} reviews</div>
                  <div style={{ width:6, height:6, borderRadius:'50%', background: subjectColor(c.subject_id), boxShadow:`0 0 8px ${subjectColor(c.subject_id)}` }} />
                  <button className="btn btn-danger btn-icon" style={{ width:28, height:28, fontSize:12 }} onClick={() => handleDelete(c.id)}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal === 'add' && (
        <AddCardModal subjects={subjects} defaultSubjectId={filterSid !== 'all' ? +filterSid : null}
          onClose={() => setModal(null)} onSave={async (d) => { await api.flashcards.create(d); load(); }} />
      )}
      {modal === 'gen' && (
        <GenModal subjects={subjects}
          onClose={() => setModal(null)}
          onGenerate={async (topic, count, sid) => { await api.ai.generateCards(topic, count, sid); load(); }} />
      )}
    </div>
  );
}
