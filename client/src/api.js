const BASE = '/api';

async function req(path, opts = {}) {
  const r = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  if (!r.ok) {
    const e = await r.json().catch(() => ({ error: r.statusText }));
    throw new Error(e.error || r.statusText);
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
  },
  post: (path, body) => req(path, { method: 'POST', body }),
  get: (path) => req(path),
  put: (path, body) => req(path, { method: 'PUT', body }),
  delete: (path) => req(path, { method: 'DELETE' }),
};
