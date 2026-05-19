import { useState, useEffect, useRef } from 'react';
import { api } from '../api';

export default function NotesView() {
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'kanban'
  
  // Notes State
  const [notes,     setNotes]     = useState([]);
  const [subjects,  setSubjects]  = useState([]);
  const [activeId,  setActiveId]  = useState(null);
  const [draft,     setDraft]     = useState({ title: '', content: '' });
  const [filterSid, setFilterSid] = useState('all');
  const [search,    setSearch]    = useState('');
  const [saving,    setSaving]    = useState(false);
  const [dirty,     setDirty]     = useState(false);
  const saveTimer   = useRef(null);

  // Kanban State
  const [tasks, setTasks] = useState(() => {
    return JSON.parse(localStorage.getItem('nexus_tasks') || JSON.stringify([
      { id: 1, title: 'Revise C++ Pointers', col: 'todo', subject: 'C++', priority: 'High' },
      { id: 2, title: 'Complete HTML structure', col: 'in_progress', subject: 'HTML', priority: 'Medium' },
      { id: 3, title: 'Submit database schema', col: 'completed', subject: 'SQL', priority: 'Low' }
    ]));
  });
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubj, setNewTaskSubj] = useState('');
  const [newTaskPrior, setNewTaskPrior] = useState('Medium');

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

  // Kanban Handlers
  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const item = {
      id: Date.now(),
      title: newTaskTitle,
      col: 'todo',
      subject: newTaskSubj || 'General',
      priority: newTaskPrior
    };
    const next = [...tasks, item];
    setTasks(next);
    localStorage.setItem('nexus_tasks', JSON.stringify(next));
    setNewTaskTitle('');
    setNewTaskSubj('');
  };

  const moveTask = (taskId, targetCol) => {
    const next = tasks.map(t => {
      if (t.id === taskId) {
        // If moving to completed, reward +10 ByteCoins!
        if (targetCol === 'completed' && t.col !== 'completed') {
          const coins = Number(localStorage.getItem('nexus_coins') || '100');
          localStorage.setItem('nexus_coins', (coins + 10).toString());
          alert("🎉 Task Completed! +10 ByteCoins added to your Wallet!");
        }
        return { ...t, col: targetCol };
      }
      return t;
    });
    setTasks(next);
    localStorage.setItem('nexus_tasks', JSON.stringify(next));
  };

  const deleteTask = (taskId) => {
    const next = tasks.filter(t => t.id !== taskId);
    setTasks(next);
    localStorage.setItem('nexus_tasks', JSON.stringify(next));
  };

  const filtered = notes
    .filter(n => filterSid === 'all' || n.subject_id === +filterSid)
    .filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));

  const subjectColor = (sid) => subjects.find(s => s.id === sid)?.color || 'var(--cyan)';
  const subjectName  = (sid) => subjects.find(s => s.id === sid)?.name;
  const fmtDate = (str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="view" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header with double tabs */}
      <div className="page-header" style={{ flexShrink: 0, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="page-eyebrow">Knowledge OS · Workspace</div>
            <h1 className="page-title">{activeTab === 'notes' ? '📝 Notebook' : '📋 Kanban Board'}</h1>
          </div>
          
          <div className="flex gap-2">
            <button className={`btn ${activeTab === 'notes' ? 'btn-cyan' : 'btn-ghost'}`} onClick={() => setActiveTab('notes')}>
              Notes
            </button>
            <button className={`btn ${activeTab === 'kanban' ? 'btn-purple' : 'btn-ghost'}`} onClick={() => setActiveTab('kanban')}>
              Kanban Board
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'notes' ? (
        /* STANDARD NOTES LAYOUT */
        <div className="notes-layout" style={{ flex: 1, minHeight: 0 }}>
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
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, flex: 1 }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>≡</div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>Select a note or create a new one</p>
              <button className="btn btn-cyan" onClick={newNote}>+ New Note</button>
            </div>
          )}
        </div>
      ) : (
        /* INTERACTIVE KANBAN LAYOUT */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, minHeight: 0, paddingBottom: 40 }}>
          
          {/* Quick Task Creator Form */}
          <form onSubmit={addTask} className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, padding: 20, alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>NEW STUDY TASK</span>
              <input className="input" placeholder="Enter task title (e.g. Solve matrix algorithm)..." value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} />
            </div>
            
            <div style={{ width: 140 }}>
              <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>SUBJECT</span>
              <select className="input" value={newTaskSubj} onChange={e => setNewTaskSubj(e.target.value)}>
                <option value="">General</option>
                {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>

            <div style={{ width: 120 }}>
              <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>PRIORITY</span>
              <select className="input" value={newTaskPrior} onChange={e => setNewTaskPrior(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <button type="submit" className="btn btn-purple" style={{ height: 40 }}>Add Task</button>
          </form>

          {/* Kanban Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, flex: 1, minHeight: 400 }}>
            
            {/* Column 1: To Do */}
            <div className="card" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 12 }}>
                <strong style={{ color: '#ef4444', fontSize: 13, letterSpacing: 1 }}>🔴 TO DO</strong>
                <span className="badge badge-cyan" style={{ fontSize: 9 }}>{tasks.filter(t => t.col === 'todo').length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tasks.filter(t => t.col === 'todo').map(t => (
                  <div key={t.id} className="card" style={{ padding: 12, background: 'var(--surface)', border: '1px solid var(--border-hi)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-purple" style={{ fontSize: 8 }}>{t.subject}</span>
                      <span style={{ fontSize: 8, color: t.priority === 'High' ? '#ef4444' : t.priority === 'Medium' ? 'var(--cyan)' : 'var(--text-muted)' }}>{t.priority}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-bright)', fontWeight: 600 }}>{t.title}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <button className="btn btn-ghost" style={{ fontSize: 10, padding: '3px 6px' }} onClick={() => deleteTask(t.id)}>Delete</button>
                      <button className="btn btn-cyan" style={{ fontSize: 10, padding: '3px 6px' }} onClick={() => moveTask(t.id, 'in_progress')}>Start →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="card" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 12 }}>
                <strong style={{ color: 'var(--cyan)', fontSize: 13, letterSpacing: 1 }}>🟡 IN PROGRESS</strong>
                <span className="badge badge-cyan" style={{ fontSize: 9 }}>{tasks.filter(t => t.col === 'in_progress').length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tasks.filter(t => t.col === 'in_progress').map(t => (
                  <div key={t.id} className="card" style={{ padding: 12, background: 'var(--surface)', border: '1px solid var(--border-hi)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-purple" style={{ fontSize: 8 }}>{t.subject}</span>
                      <span style={{ fontSize: 8, color: t.priority === 'High' ? '#ef4444' : t.priority === 'Medium' ? 'var(--cyan)' : 'var(--text-muted)' }}>{t.priority}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-bright)', fontWeight: 600 }}>{t.title}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <button className="btn btn-ghost" style={{ fontSize: 10, padding: '3px 6px' }} onClick={() => moveTask(t.id, 'todo')}>← Back</button>
                      <button className="btn btn-purple" style={{ fontSize: 10, padding: '3px 6px' }} onClick={() => moveTask(t.id, 'completed')}>Finish →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Completed */}
            <div className="card" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 12 }}>
                <strong style={{ color: 'var(--green)', fontSize: 13, letterSpacing: 1 }}>🟢 COMPLETED</strong>
                <span className="badge badge-cyan" style={{ fontSize: 9 }}>{tasks.filter(t => t.col === 'completed').length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tasks.filter(t => t.col === 'completed').map(t => (
                  <div key={t.id} className="card" style={{ padding: 12, background: 'var(--surface)', border: '1px solid var(--border-hi)', display: 'flex', flexDirection: 'column', gap: 8, opacity: 0.8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-cyan" style={{ fontSize: 8 }}>{t.subject}</span>
                      <span style={{ fontSize: 8, textDecoration: 'line-through' }}>{t.priority}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'line-through', fontWeight: 600 }}>{t.title}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <button className="btn btn-ghost" style={{ fontSize: 10, padding: '3px 6px' }} onClick={() => deleteTask(t.id)}>Delete</button>
                      <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 'bold' }}>✓ Done (+10🪙)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
