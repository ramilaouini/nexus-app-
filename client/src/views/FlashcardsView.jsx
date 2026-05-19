import { useState, useEffect } from 'react';
import { api } from '../api';

function AddCardModal({ subjects, onClose, onSave, defaultSubjectId }) {
  const [form, setForm] = useState({ subject_id: defaultSubjectId || (subjects[0]?.id || ''), front: '', back: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
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
            <textarea className="input" style={{ height: 90, resize: 'none', lineHeight: 1.6 }}
              placeholder="What do you want to be asked?" value={form.front}
              onChange={e => set('front', e.target.value)} />
          </div>
          <div>
            <div className="input-label">Answer (Back)</div>
            <textarea className="input" style={{ height: 90, resize: 'none', lineHeight: 1.6 }}
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

export default function FlashcardsView({ initialSubjectId }) {
  const [subjects, setSubjects] = useState([]);
  const [cards, setCards] = useState([]);
  const [filterSid, setFilterSid] = useState(initialSubjectId || 'all');
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [modal, setModal] = useState(null); // 'add'
  const [mode, setMode] = useState('study'); // 'study' | 'list'
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'hard'|'medium'|'easy'
  const [generating, setGenerating] = useState(false);

  // Spaced Repetition Leitner Box mappings
  const [leitnerBoxes, setLeitnerBoxes] = useState(() => {
    return JSON.parse(localStorage.getItem('leitner_boxes') || '{}');
  });

  const load = async () => {
    const [subs, allCards] = await Promise.all([api.subjects.list(), api.flashcards.list()]);
    setSubjects(subs);
    setCards(allCards);
  };
  useEffect(() => { load(); }, []);

  const filtered = filterSid === 'all' ? cards : cards.filter(c => c.subject_id === +filterSid);
  const current = filtered[idx];

  const next = () => { setFlipped(false); setFeedback(null); setTimeout(() => setIdx(i => (i + 1) % Math.max(filtered.length, 1)), 100); };
  const prev = () => { setFlipped(false); setFeedback(null); setTimeout(() => setIdx(i => (i - 1 + filtered.length) % Math.max(filtered.length, 1)), 100); };

  const reviewLeitner = async (rating) => {
    if (!current || saving) return;
    setSaving(true);
    setFeedback(['hard', 'medium', 'easy'][rating - 1]);

    const cardId = current.id;
    const currentBox = leitnerBoxes[cardId] || 1;
    let nextBox = currentBox;

    if (rating === 1) {
      // Hard/Incorrect: demote to Box 1
      nextBox = 1;
    } else if (rating === 2) {
      // Medium: stay in current box
    } else if (rating === 3) {
      // Easy/Correct: Promote Box!
      nextBox = Math.min(currentBox + 1, 3);
      
      // If promoted to a higher box, reward +10 ByteCoins!
      if (nextBox > currentBox) {
        const coins = Number(localStorage.getItem('nexus_coins') || '100');
        localStorage.setItem('nexus_coins', (coins + 10).toString());
        alert(`📦 Spaced Repetition Promotion! Card promoted to Box ${nextBox}! +10 ByteCoins earned!`);
      }
    }

    const updatedBoxes = { ...leitnerBoxes, [cardId]: nextBox };
    setLeitnerBoxes(updatedBoxes);
    localStorage.setItem('leitner_boxes', JSON.stringify(updatedBoxes));

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
  const subjectName = (sid) => subjects.find(s => s.id === sid)?.name || '—';

  const handleRandomAI = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/ai/random-cards', {});
      const sid = filterSid !== 'all' ? +filterSid : subjects[0]?.id;
      if (!sid) throw new Error("Please create a subject first");
      for (const c of res.cards) {
        await api.flashcards.create({ subject_id: sid, front: c.front, back: c.back });
      }
      await load();
    } catch (e) {
      alert('AI Generation failed: ' + e.message);
    }
    setGenerating(false);
  };

  // Box counters
  const box1Count = filtered.filter(c => (leitnerBoxes[c.id] || 1) === 1).length;
  const box2Count = filtered.filter(c => (leitnerBoxes[c.id] || 1) === 2).length;
  const box3Count = filtered.filter(c => (leitnerBoxes[c.id] || 1) === 3).length;

  return (
    <div className="view" style={{ overflowY: 'auto' }}>
      
      {/* Header */}
      <div className="page-header">
        <div className="page-eyebrow">Knowledge OS · Flashcards</div>
        <div className="flex items-center justify-between">
          <h1 className="page-title">Flashcards & Leitner Spaced Repetition</h1>
          <div className="flex gap-3">
            <button className="btn btn-purple" onClick={handleRandomAI} disabled={generating}>
              {generating ? 'Generating...' : '✦ AI Random Cards'}
            </button>
            <button className="btn btn-cyan" onClick={() => setModal('add')}>+ Add Card</button>
          </div>
        </div>
      </div>

      {/* Leitner Box Status Analyzer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 14, borderLeft: '3px solid #ef4444' }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 'bold' }}>📦 BOX 1 (REVIEW DAILY)</span>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#ef4444', marginTop: 4 }}>{box1Count} Cards</div>
        </div>
        <div className="card" style={{ padding: 14, borderLeft: '3px solid var(--cyan)' }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 'bold' }}>📦 BOX 2 (REVIEW ALTERNATE)</span>
          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--cyan)', marginTop: 4 }}>{box2Count} Cards</div>
        </div>
        <div className="card" style={{ padding: 14, borderLeft: '3px solid var(--green)' }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 'bold' }}>📦 BOX 3 (REVIEW WEEKLY)</span>
          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--green)', marginTop: 4 }}>{box3Count} Cards</div>
        </div>
      </div>

      {/* Filter + Mode */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 flex-wrap">
          <button className={`btn ${filterSid === 'all' ? 'btn-cyan' : 'btn-ghost'}`}
            style={{ fontSize: 11 }} onClick={() => { setFilterSid('all'); setIdx(0); setFlipped(false); }}>
            All ({cards.length})
          </button>
          {subjects.map(s => (
            <button key={s.id}
              className={`btn ${filterSid === s.id ? 'btn-cyan' : 'btn-ghost'}`}
              style={{ fontSize: 11, '--ac': s.color, ...(filterSid === s.id ? { '--cyan': s.color, '--cyan-dim': `${s.color}22` } : {}) }}
              onClick={() => { setFilterSid(s.id); setIdx(0); setFlipped(false); }}>
              {s.icon} {s.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button className={`btn ${mode === 'study' ? 'btn-cyan' : 'btn-ghost'}`} style={{ fontSize: 11 }} onClick={() => setMode('study')}>⬡ Study</button>
          <button className={`btn ${mode === 'list' ? 'btn-cyan' : 'btn-ghost'}`} style={{ fontSize: 11 }} onClick={() => setMode('list')}>≡ List</button>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⟡</div>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>No cards here. Add some or generate with AI.</p>
          <div className="flex gap-3 justify-center">
            <button className="btn btn-purple" onClick={handleRandomAI} disabled={generating}>
              {generating ? 'Generating...' : '✦ AI Random Cards'}
            </button>
            <button className="btn btn-cyan" onClick={() => setModal('add')}>+ Add Card</button>
          </div>
        </div>
      )}

      {/* ── STUDY MODE ── */}
      {mode === 'study' && current && (
        <div>
          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
              {idx + 1} / {filtered.length}
            </span>
            <div className="progress-bar" style={{ flex: 1, margin: '0 16px', '--sc': subjectColor(current.subject_id) }}>
              <div className="progress-fill" style={{ width: `${((idx + 1) / filtered.length) * 100}%` }} />
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span className="badge badge-purple" style={{ fontSize: 9 }}>📦 Box {leitnerBoxes[current.id] || 1}</span>
              <span className="badge badge-cyan" style={{ fontSize: 9 }}>{subjectName(current.subject_id)}</span>
            </div>
          </div>

          {/* 3D Card */}
          <div className="fc-scene" onClick={() => setFlipped(f => !f)}>
            <div className={`fc-inner${flipped ? ' flipped' : ''}`}>
              <div className="fc-face fc-front" style={{ position: 'relative', overflow: 'hidden' }}>
                <img src={`https://picsum.photos/seed/${current.id}-front/400/250`} alt="bg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18, mixBlendMode: 'overlay', pointerEvents: 'none' }} />
                <div className="fc-label" style={{ zIndex: 2 }}>Question</div>
                <div className="fc-text" style={{ zIndex: 2 }}>{current.front}</div>
                <div className="fc-hint" style={{ zIndex: 2 }}>Click to reveal answer</div>
                <div className="fc-glow-ring" style={{ borderColor: 'var(--cyan)', top: -60, right: -60, zIndex: 1 }} />
              </div>
              <div className="fc-face fc-back" style={{ position: 'relative', overflow: 'hidden' }}>
                <img src={`https://picsum.photos/seed/${current.id}-back/400/250`} alt="bg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18, mixBlendMode: 'overlay', pointerEvents: 'none' }} />
                <div className="fc-label" style={{ zIndex: 2 }}>Answer</div>
                <div className="fc-text" style={{ zIndex: 2 }}>{current.back}</div>
                <div className="fc-glow-ring" style={{ borderColor: 'var(--purple)', bottom: -60, left: -60, zIndex: 1 }} />
              </div>
            </div>
          </div>

          {/* Rating / Nav */}
          {flipped ? (
            <div>
              <p style={{ textAlign: 'center', fontSize: 11, letterSpacing: 2, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase' }}>How well did you know it?</p>
              <div className="rating-btns">
                <button className={`rating-btn rating-hard${feedback === 'hard' ? ' ring' : ''}`} onClick={() => reviewLeitner(1)}>😓 Hard / Forgot</button>
                <button className={`rating-btn rating-medium${feedback === 'medium' ? ' ring' : ''}`} onClick={() => reviewLeitner(2)}>🤔 Medium / Normal</button>
                <button className={`rating-btn rating-easy${feedback === 'easy' ? ' ring' : ''}`} onClick={() => reviewLeitner(3)}>😎 Easy / Promote</button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center gap-4 mt-4">
              <button className="btn btn-ghost" onClick={prev}>← Prev</button>
              <button className="btn btn-ghost" onClick={next}>Next →</button>
            </div>
          )}

          {/* Card stats */}
          <div style={{ display: 'flex', justifycontent: 'center', gap: 24, marginTop: 20 }}>
            {[
              { label: 'Box Position', val: `Box ${leitnerBoxes[current.id] || 1}` },
              { label: 'Reviews', val: current.review_count },
              { label: 'Correct', val: current.correct_count },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--cyan)' }}>{s.val}</div>
                <div style={{ fontSize: 10, letterSpacing: 1.5, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── LIST MODE ── */}
      {mode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((c, i) => (
            <div key={c.id} className="card" style={{ padding: '16px 20px' }}>
              <div className="flex items-center justify-between">
                <div style={{ flex: 1, marginRight: 16 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-bright)', marginBottom: 5, fontWeight: 600 }}>{c.front}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.back}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge badge-purple" style={{ fontSize: 9 }}>Box {leitnerBoxes[c.id] || 1}</span>
                  <div className="badge badge-cyan" style={{ fontSize: 9 }}>{c.review_count} reviews</div>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: subjectColor(c.subject_id), boxShadow: `0 0 8px ${subjectColor(c.subject_id)}` }} />
                  <button className="btn btn-danger btn-icon" style={{ width: 28, height: 28, fontSize: 12 }} onClick={() => handleDelete(c.id)}>✕</button>
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
    </div>
  );
}
