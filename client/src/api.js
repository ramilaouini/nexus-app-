const BASE = '/api';

function getUserId() {
  try {
    const u = JSON.parse(localStorage.getItem('nexus_user') || 'null');
    return u?.id || null;
  } catch { return null; }
}

async function req(path, opts = {}) {
  const userId = getUserId();
  const headers = { 'Content-Type': 'application/json', ...opts.headers };
  if (userId) headers['X-User-Id'] = String(userId);

  const r = await fetch(BASE + path, {
    ...opts,
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  if (!r.ok) {
    let errorMsg = `HTTP Error ${r.status}`;
    try {
      const e = await r.json();
      if (e && e.error) errorMsg = e.error;
    } catch {
      if (r.statusText) errorMsg = `${r.statusText} (${r.status})`;
    }
    throw new Error(errorMsg);
  }
  return r.json();
}

export const api = {
  subjects: {
    list:   ()       => req('/subjects'),
    create: (data)   => req('/subjects', { method: 'POST', body: data }),
    update: (id, d)  => req(`/subjects/${id}`, { method: 'PUT', body: d }),
    delete: (id)     => req(`/subjects/${id}`, { method: 'DELETE' }),
  },
  flashcards: {
    list:   (sid)    => req(`/flashcards${sid ? `?subject_id=${sid}` : ''}`),
    create: (data)   => req('/flashcards', { method: 'POST', body: data }),
    update: (id, d)  => req(`/flashcards/${id}`, { method: 'PUT', body: d }),
    delete: (id)     => req(`/flashcards/${id}`, { method: 'DELETE' }),
    review: (id, r)  => req(`/flashcards/${id}/review`, { method: 'POST', body: { rating: r } }),
  },
  sessions: {
    list:   ()       => req('/sessions'),
    create: (data)   => req('/sessions', { method: 'POST', body: data }),
  },
  notes: {
    list:   (sid)    => req(`/notes${sid ? `?subject_id=${sid}` : ''}`),
    create: (data)   => req('/notes', { method: 'POST', body: data }),
    update: (id, d)  => req(`/notes/${id}`, { method: 'PUT', body: d }),
    delete: (id)     => req(`/notes/${id}`, { method: 'DELETE' }),
  },
  stats:   ()        => req('/stats'),
  ai: {
    chat:          (messages, subject) => req('/ai/chat', { method: 'POST', body: { messages, subject } }),
    generateCards: (topic, count, sid) => req('/ai/generate-cards', { method: 'POST', body: { topic, count, subject_id: sid } }),
    generateStudyMaterials: (notesText, sid) => req('/ai/generate-study-materials', { method: 'POST', body: { notesText, subject_id: sid } }),
  },
  post: (path, body) => req(path, { method: 'POST', body }),
  get: (path) => req(path),
  put: (path, body) => req(path, { method: 'PUT', body }),
  delete: (path) => req(path, { method: 'DELETE' }),
};
