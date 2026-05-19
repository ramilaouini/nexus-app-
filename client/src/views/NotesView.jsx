import { useState, useEffect, useRef } from 'react';
import { api } from '../api';

export default function NotesView() {
  const [notes,     setNotes]     = useState([]);
  const [subjects,  setSubjects]  = useState([]);
  const [activeId,  setActiveId]  = useState(null);
  const [draft,     setDraft]     = useState({ title: '', content: '' });
  const [filterSid, setFilterSid] = useState('all');
  const [search,    setSearch]    = useState('');
  const [saving,    setSaving]    = useState(false);
  const [dirty,     setDirty]     = useState(false);
  const saveTimer   = useRef(null);

  const load = async () => {
    const [n, s] = await Promise.all([api.notes.list(), api.subjects.list()]);
    setNotes(n); setSubjects(s);
  };
  useEffect(() => { load(); }, []);

  const activeNote = notes.find(n => n.id === activeId);

  const selectNote = (note) => {
    setActiveId(note.id);
    setDraft({ title: note.title, content: note.content });
    setDirty(false);
  };

  const newNote = async () => {
    const sid = filterSid !== 'all' ? +filterSid : null;
    const note = await api.notes.create({ subject_id: sid, title: 'Untitled Note', content: '' });
    await load();
    selectNote(note);
  };

  const autosave = (field, val) => {
    setDraft(d => ({ ...d, [field]: val }));
    setDirty(true);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      if (!activeId) return;
      setSaving(true);
      await api.notes.update(activeId, { ...draft, [field]: val }).catch(console.error);
      setSaving(false);
      setDirty(false);
      load();
    }, 800);
  };

  const deleteNote = async (id) => {
    if (!confirm('Delete this note?')) return;
    await api.notes.delete(id);
    if (activeId === id) { setActiveId(null); setDraft({ title: '', content: '' }); }
    load();
  };

  const filtered = notes
    .filter(n => filterSid === 'all' || n.subject_id === +filterSid)
    .filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));

  const subjectColor = (sid) => subjects.find(s => s.id === sid)?.color || 'var(--cyan)';
  const subjectName  = (sid) => subjects.find(s => s.id === sid)?.name;

  const fmtDate = (str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="view">
      <div className="page-header">
        <div className="page-eyebrow">Knowledge OS · Notes</div>
        <div className="flex items-center justify-between">
          <h1 className="page-title">Notes</h1>
          <button className="btn btn-cyan" onClick={newNote}>+ New Note</button>
        </div>
      </div>

      <div className="notes-layout">
        {/* Sidebar */}
        <div>
          <input className="input mb-3" style={{ fontSize: 13 }} placeholder="Search notes…"
            value={search} onChange={e => setSearch(e.target.value)} />

          <select className="input mb-3" style={{ fontSize: 12 }} value={filterSid} onChange={e => setFilterSid(e.target.value)}>
            <option value="all">All Subjects</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
          </select>

          <div className="notes-list">
            {filtered.length === 0 && (
              <div style={{ padding: '24px 0', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 12 }}>No notes yet.</p>
                <button className="btn btn-ghost" style={{ fontSize: 11 }} onClick={newNote}>+ New Note</button>
              </div>
            )}
            {filtered.map(note => (
              <div key={note.id}
                className={`note-item${activeId === note.id ? ' active' : ''}`}
                onClick={() => selectNote(note)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {note.subject_id && (
                      <div style={{ width: 18, height: 2, background: subjectColor(note.subject_id), borderRadius: 1, marginBottom: 5, boxShadow: `0 0 6px ${subjectColor(note.subject_id)}` }} />
                    )}
                    <div className="note-title">{note.title}</div>
                    <div className="note-meta">{fmtDate(note.updated_at)}{note.subject_id ? ` · ${subjectName(note.subject_id)}` : ''}</div>
                    {note.content && (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {note.content.slice(0, 80)}
                      </div>
                    )}
                  </div>
                  <button className="btn btn-danger btn-icon"
                    style={{ width: 24, height: 24, fontSize: 10, flexShrink: 0, opacity: 0.6 }}
                    onClick={e => { e.stopPropagation(); deleteNote(note.id); }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        {activeNote ? (
          <div className="note-editor">
            <div className="flex items-center justify-between">
              <input
                className="input"
                style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: 0.5, border: '1px solid transparent', background: 'transparent', padding: '4px 0' }}
                value={draft.title}
                onChange={e => autosave('title', e.target.value)}
                placeholder="Note title…"
              />
              <div className="flex items-center gap-2">
                {saving && <div className="spinner" style={{ width: 14, height: 14 }} />}
                {!saving && dirty && <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>unsaved</span>}
                {!saving && !dirty && <span style={{ fontSize: 10, color: 'var(--green)', letterSpacing: 1 }}>✓ saved</span>}
                {activeNote.subject_id && (
                  <div className="badge badge-cyan" style={{ fontSize: 9 }}>
                    {subjectName(activeNote.subject_id)}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>
                Created {fmtDate(activeNote.created_at)} · Updated {fmtDate(activeNote.updated_at)}
                {activeNote.content && ` · ${activeNote.content.split(/\s+/).filter(Boolean).length} words`}
              </div>
            </div>

            <textarea
              style={{
                flex: 1, background: 'var(--card)', border: '1px solid var(--border)',
                color: 'var(--text-bright)', fontFamily: 'var(--font-body)', fontSize: 14,
                borderRadius: 'var(--radius)', padding: 20, resize: 'none', outline: 'none',
                lineHeight: 1.8, transition: 'border-color 0.2s', minHeight: 0
              }}
              value={draft.content}
              onChange={e => autosave('content', e.target.value)}
              placeholder="Start writing… Your notes auto-save as you type."
              onFocus={e => e.target.style.borderColor = 'var(--border-md)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        ) : (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>≡</div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>Select a note or create a new one</p>
            <button className="btn btn-cyan" onClick={newNote}>+ New Note</button>
          </div>
        )}
      </div>
    </div>
  );
}
