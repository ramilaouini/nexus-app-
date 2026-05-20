require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fetch   = require('node-fetch');
const { getDb, all, run, get } = require('./db');
let discordRpc;
try {
  discordRpc = require('./discord-rpc');
} catch (error) {
  console.log("Discord RPC module not loaded: " + error.message);
}

const app = express();
app.use(cors({ origin: ['http://localhost:5173','http://127.0.0.1:5173'] }));
app.use(express.json());

let db;
(async () => { db = await getDb(); })();
const wait = (fn) => async (req, res, next) => { if (!db) db = await getDb(); fn(req,res,next); };

// ─── DISCORD RPC ────────────────────────────────────────────────────────────
app.post('/api/presence', (req, res) => {
  if (discordRpc) {
    const { details, state } = req.body;
    discordRpc.updatePresence(details, state);
  }
  res.json({ success: true });
});

// ─── SUBJECTS ───────────────────────────────────────────────────────────────
app.get('/api/subjects', wait((req,res) => {
  const rows = all(`
    SELECT s.*, COUNT(DISTINCT f.id) as card_count, COUNT(DISTINCT n.id) as note_count,
      COALESCE(SUM(se.duration),0) as total_minutes,
      COALESCE(
        CASE WHEN COUNT(CASE WHEN f.review_count>0 THEN 1 END)>0
        THEN (SUM(CASE WHEN f.review_count>0 THEN (CAST(f.correct_count AS REAL)/f.review_count)*100 ELSE 0 END)/COUNT(CASE WHEN f.review_count>0 THEN 1 END))
        ELSE 0 END, 0) as accuracy
    FROM subjects s
    LEFT JOIN flashcards f ON f.subject_id=s.id
    LEFT JOIN notes n ON n.subject_id=s.id
    LEFT JOIN sessions se ON se.subject_id=s.id
    GROUP BY s.id ORDER BY s.created_at DESC
  `);
  res.json(rows);
}));

app.post('/api/subjects', wait((req,res) => {
  const { name, icon='📚', color='#00e5ff', category='General', description='' } = req.body;
  if (!name) return res.status(400).json({ error:'name required' });
  const { lastInsertRowid: id } = run(`INSERT INTO subjects (name,icon,color,category,description) VALUES (?,?,?,?,?)`,[name,icon,color,category,description]);
  res.status(201).json({ ...get('SELECT * FROM subjects WHERE id=?',[id]), card_count:0, note_count:0, total_minutes:0, accuracy:0 });
}));

app.put('/api/subjects/:id', wait((req,res) => {
  const { name, icon, color, category, description } = req.body;
  run(`UPDATE subjects SET name=?,icon=?,color=?,category=?,description=? WHERE id=?`,[name,icon,color,category,description,req.params.id]);
  res.json({ success:true });
}));

app.delete('/api/subjects/:id', wait((req,res) => {
  run('DELETE FROM flashcards WHERE subject_id=?',[req.params.id]);
  run('DELETE FROM notes WHERE subject_id=?',[req.params.id]);
  run('DELETE FROM subjects WHERE id=?',[req.params.id]);
  res.json({ success:true });
}));

// ─── FLASHCARDS ─────────────────────────────────────────────────────────────
app.get('/api/flashcards', wait((req,res) => {
  const { subject_id } = req.query;
  res.json(subject_id
    ? all('SELECT * FROM flashcards WHERE subject_id=? ORDER BY created_at DESC',[+subject_id])
    : all('SELECT * FROM flashcards ORDER BY created_at DESC'));
}));

app.post('/api/flashcards', wait((req,res) => {
  const { subject_id, front, back } = req.body;
  if (!subject_id||!front||!back) return res.status(400).json({ error:'subject_id,front,back required' });
  const { lastInsertRowid: id } = run(`INSERT INTO flashcards (subject_id,front,back) VALUES (?,?,?)`,[+subject_id,front,back]);
  res.status(201).json(get('SELECT * FROM flashcards WHERE id=?',[id]));
}));

app.put('/api/flashcards/:id', wait((req,res) => {
  const { front, back } = req.body;
  run('UPDATE flashcards SET front=?,back=? WHERE id=?',[front,back,req.params.id]);
  res.json({ success:true });
}));

app.delete('/api/flashcards/:id', wait((req,res) => {
  run('DELETE FROM flashcards WHERE id=?',[req.params.id]);
  res.json({ success:true });
}));

app.post('/api/flashcards/:id/review', wait((req,res) => {
  const { rating } = req.body;
  const card = get('SELECT * FROM flashcards WHERE id=?',[req.params.id]);
  if (!card) return res.status(404).json({ error:'not found' });
  let { ease_factor, interval_days } = card;
  if (rating===1) { interval_days=1; ease_factor=Math.max(1.3,ease_factor-0.2); }
  else if (rating===2) { interval_days=Math.round(interval_days*ease_factor); }
  else { interval_days=Math.round(interval_days*ease_factor*1.3); ease_factor=Math.min(3.0,ease_factor+0.1); }
  const next = new Date(Date.now()+interval_days*86400000).toISOString();
  run(`UPDATE flashcards SET ease_factor=?,interval_days=?,next_review=?,review_count=review_count+1,correct_count=correct_count+? WHERE id=?`,
    [ease_factor,interval_days,next,rating>=2?1:0,req.params.id]);
  res.json({ success:true, next_review:next, interval_days });
}));

// ─── SESSIONS ───────────────────────────────────────────────────────────────
app.get('/api/sessions', wait((req,res) => {
  res.json(all(`SELECT se.*, s.name as subject_name, s.color as subject_color
    FROM sessions se LEFT JOIN subjects s ON s.id=se.subject_id
    ORDER BY se.completed_at DESC LIMIT 50`));
}));

app.post('/api/sessions', wait((req,res) => {
  const { subject_id, duration=25, mode='focus' } = req.body;
  const { lastInsertRowid: id } = run('INSERT INTO sessions (subject_id,duration,mode) VALUES (?,?,?)',[subject_id||null,duration,mode]);
  res.status(201).json({ id });
}));

// ─── NOTES ──────────────────────────────────────────────────────────────────
app.get('/api/notes', wait((req,res) => {
  const { subject_id } = req.query;
  res.json(subject_id
    ? all('SELECT * FROM notes WHERE subject_id=? ORDER BY updated_at DESC',[+subject_id])
    : all('SELECT * FROM notes ORDER BY updated_at DESC'));
}));

app.post('/api/notes', wait((req,res) => {
  const { subject_id, title, content='' } = req.body;
  if (!title) return res.status(400).json({ error:'title required' });
  const { lastInsertRowid: id } = run('INSERT INTO notes (subject_id,title,content) VALUES (?,?,?)',[subject_id||null,title,content]);
  res.status(201).json(get('SELECT * FROM notes WHERE id=?',[id]));
}));

app.put('/api/notes/:id', wait((req,res) => {
  const { title, content } = req.body;
  run(`UPDATE notes SET title=?,content=?,updated_at=datetime('now') WHERE id=?`,[title,content,req.params.id]);
  res.json({ success:true });
}));

app.delete('/api/notes/:id', wait((req,res) => {
  run('DELETE FROM notes WHERE id=?',[req.params.id]);
  res.json({ success:true });
}));

// ─── STATS ───────────────────────────────────────────────────────────────────
app.get('/api/stats', wait((req,res) => {
  const totalSubjects = get('SELECT COUNT(*) as c FROM subjects').c;
  const totalCards    = get('SELECT COUNT(*) as c FROM flashcards').c;
  const totalNotes    = get('SELECT COUNT(*) as c FROM notes').c;
  const totalMinutes  = get("SELECT COALESCE(SUM(duration),0) as t FROM sessions WHERE mode='focus'").t;
  const todaySessions = get("SELECT COUNT(*) as c FROM sessions WHERE date(completed_at)=date('now') AND mode='focus'").c;
  const cardsReviewed = get('SELECT COALESCE(SUM(review_count),0) as c FROM flashcards').c;

  const days = all(`SELECT DISTINCT date(completed_at) as d FROM sessions WHERE mode='focus' ORDER BY d DESC LIMIT 30`).map(r=>r.d);
  let streak = 0;
  for (let i=0; i<days.length; i++) {
    const exp = new Date(Date.now()-i*86400000).toISOString().slice(0,10);
    if (days[i]===exp) streak++; else break;
  }

  const activity = all(`SELECT date(completed_at) as day, COUNT(*) as sessions, COALESCE(SUM(duration),0) as minutes
    FROM sessions WHERE mode='focus' AND completed_at>=date('now','-6 days')
    GROUP BY day ORDER BY day`);

  res.json({ totalSubjects, totalCards, totalNotes, totalMinutes, todaySessions, cardsReviewed, streak, activity });
}));

// ─── AI ──────────────────────────────────────────────────────────────────────
app.post('/api/ai/chat', async (req,res) => {
  const { messages, subject } = req.body;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(400).json({ error:'Add GROQ_API_KEY to your .env file' });
  const system = subject
    ? `You are NEXUS AI, an intelligent study assistant. The user is studying "${subject}". Help them understand concepts, test their knowledge, and provide sharp explanations. Use markdown.`
    : `You are NEXUS AI, an intelligent study assistant in a futuristic learning app. Help users learn efficiently, understand topics, and master their subjects. Be sharp and concise. Use markdown.`;
  try {
    const r = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ 
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'system', content: system }, ...messages.map(m => ({ role: m.role, content: m.content }))]
      })
    });
    const data = await r.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    res.json({ response: data.choices[0].message.content });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/ai/generate-cards', async (req,res) => {
  const { topic, count=5, subject_id } = req.body;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(400).json({ error:'Add GROQ_API_KEY to your .env file' });
  try {
    const r = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ 
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: `Generate ${count} flashcards about "${topic}". Return ONLY a JSON array, no markdown. Format: [{"front":"question","back":"answer"}]` }] 
      })
    });
    const data = await r.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const text = data.choices[0].message.content.replace(/```json|```/g,'').trim();
    const cards = JSON.parse(text);
    if (subject_id) for (const c of cards) run(`INSERT INTO flashcards (subject_id,front,back) VALUES (?,?,?)`,[+subject_id,c.front,c.back]);
    res.json({ cards });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/ai/random-snippet', async (req,res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(400).json({ error:'Add GROQ_API_KEY to your .env file' });
  try {
    const r = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ 
        model: 'llama-3.1-8b-instant',
        response_format: { type: "json_object" },
        messages: [{ role: 'user', content: `Generate a random, useful, and interesting code snippet (e.g. JS, Python, C++, CSS). Return ONLY a JSON object exactly like this: {"title":"Snippet Title","lang":"javascript","code":"actual_code","tags":["tag1","tag2"]}. Do not include markdown blocks or any other text.` }] 
      })
    });
    const data = await r.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const text = data.choices[0].message.content;
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI did not return valid JSON");
    const snippet = JSON.parse(match[0]);
    res.json({ snippet });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/ai/random-cards', async (req,res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(400).json({ error:'Add GROQ_API_KEY to your .env file' });
  try {
    const r = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ 
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: `Generate 5 random educational flashcards about any interesting academic subject. Return ONLY a JSON array, no markdown. Format: [{"front":"question","back":"answer"}]` }] 
      })
    });
    const data = await r.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const text = data.choices[0].message.content.replace(/```json|```/g,'').trim();
    const cards = JSON.parse(text);
    res.json({ cards });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ─── AUTH & USERS ───────────────────────────────────────────────────────────
app.post('/api/auth/login', wait((req,res) => {
  const { username, password } = req.body;
  const user = get('SELECT * FROM users WHERE username=?', [username]);
  if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ success: true, user: { id: user.id, username: user.username, avatar: user.avatar } });
}));

app.post('/api/auth/register', wait((req,res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  try {
    const { lastInsertRowid: id } = run('INSERT INTO users (username, password, avatar) VALUES (?,?,?)', [username, password, '']);
    res.status(201).json({ success: true, user: { id, username, avatar: '' } });
  } catch(e) {
    res.status(400).json({ error: 'Username may already exist' });
  }
}));

app.post('/api/auth/update-password', wait((req,res) => {
  const { username, newPassword } = req.body;
  const user = get('SELECT * FROM users WHERE username=?', [username]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  run('UPDATE users SET password=? WHERE username=?', [newPassword, username]);
  res.json({ success: true });
}));

app.post('/api/auth/update-avatar', wait((req,res) => {
  const { username, avatar } = req.body;
  const user = get('SELECT * FROM users WHERE username=?', [username]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  run('UPDATE users SET avatar=? WHERE username=?', [avatar, username]);
  res.json({ success: true, avatar });
}));

// ─── SNIPPETS ───────────────────────────────────────────────────────────────
app.get('/api/snippets', wait((req,res) => {
  const { user_id } = req.query;
  const query = user_id ? 'SELECT * FROM snippets WHERE user_id=? OR user_id IS NULL ORDER BY created_at DESC' : 'SELECT * FROM snippets ORDER BY created_at DESC';
  const params = user_id ? [user_id] : [];
  res.json(all(query, params).map(s => ({...s, tags: s.tags ? s.tags.split(',').filter(Boolean) : []})));
}));

app.post('/api/snippets', wait((req,res) => {
  const { title, lang, code, tags=[], user_id } = req.body;
  const { lastInsertRowid: id } = run('INSERT INTO snippets (title,lang,code,tags,user_id) VALUES (?,?,?,?,?)', [title, lang, code, tags.join(','), user_id]);
  res.status(201).json({ id, title, lang, code, tags });
}));

app.put('/api/snippets/:id', wait((req,res) => {
  const { title, lang, code, tags=[] } = req.body;
  run('UPDATE snippets SET title=?,lang=?,code=?,tags=? WHERE id=?', [title, lang, code, tags.join(','), req.params.id]);
  res.json({ success: true });
}));

app.delete('/api/snippets/:id', wait((req,res) => {
  run('DELETE FROM snippets WHERE id=?', [req.params.id]);
  res.json({ success: true });
}));

// ─── ACHIEVEMENTS ───────────────────────────────────────────────────────────
app.get('/api/achievements/:userId', wait((req,res) => {
  res.json(all('SELECT badge_id FROM user_achievements WHERE user_id=?', [req.params.userId]).map(r => r.badge_id));
}));

app.post('/api/achievements/:userId', wait((req,res) => {
  const { badge_id } = req.body;
  try {
    run('INSERT INTO user_achievements (user_id, badge_id) VALUES (?,?)', [req.params.userId, badge_id]);
    res.json({ success: true });
  } catch(e) {
    res.json({ success: true }); // already unlocked
  }
}));

// Serve static
app.use(express.static(path.join(__dirname,'../client/dist')));
app.get('*',(req,res) => { if (!req.path.startsWith('/api')) res.sendFile(path.join(__dirname,'../client/dist/index.html')); });

const PORT = process.env.PORT||3001;
app.listen(PORT, () => {
  console.log('\n  ✦  NEXUS API  →  http://localhost:'+PORT+'\n');
});
