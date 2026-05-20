const { createClient } = require('@libsql/client');
const path = require('path');

const dbUrl = process.env.DATABASE_URL || `file:${path.join(__dirname, '../nexus.db')}`;
const dbToken = process.env.DATABASE_AUTH_TOKEN || '';

const client = createClient({
  url: dbUrl,
  authToken: dbToken
});

async function getDb() {
  await client.execute("SELECT 1;");
  await initSchema();
  return client;
}

async function all(sql, p = []) {
  const rs = await client.execute({ sql, args: p });
  return rs.rows.map(row => ({ ...row }));
}

async function run(sql, p = []) {
  const rs = await client.execute({ sql, args: p });
  return { lastInsertRowid: rs.lastInsertRowid !== undefined ? Number(rs.lastInsertRowid) : null };
}

async function get(sql, p = []) {
  const rows = await all(sql, p);
  return rows[0] || null;
}

async function initSchema() {
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL, icon TEXT DEFAULT '📚', color TEXT DEFAULT '#00e5ff',
      category TEXT DEFAULT 'General', description TEXT DEFAULT '',
      user_id INTEGER,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS flashcards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL, front TEXT NOT NULL, back TEXT NOT NULL,
      difficulty INTEGER DEFAULT 0, ease_factor REAL DEFAULT 2.5,
      interval_days INTEGER DEFAULT 1, next_review TEXT DEFAULT (datetime('now')),
      review_count INTEGER DEFAULT 0, correct_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT, subject_id INTEGER,
      duration INTEGER DEFAULT 25, mode TEXT DEFAULT 'focus',
      user_id INTEGER,
      completed_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT, subject_id INTEGER,
      title TEXT NOT NULL, content TEXT DEFAULT '',
      user_id INTEGER,
      created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS snippets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL, lang TEXT DEFAULT 'javascript',
      code TEXT NOT NULL, tags TEXT DEFAULT '',
      user_id INTEGER,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS user_achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      badge_id INTEGER NOT NULL,
      unlocked_at TEXT DEFAULT (datetime('now')),
      UNIQUE(user_id, badge_id)
    );
  `);

  // Migrations for existing databases
  try { await run('ALTER TABLE subjects ADD COLUMN user_id INTEGER'); } catch(e) { /* already exists */ }
  try { await run('ALTER TABLE sessions ADD COLUMN user_id INTEGER'); } catch(e) { /* already exists */ }
  try { await run('ALTER TABLE notes ADD COLUMN user_id INTEGER'); } catch(e) { /* already exists */ }
  try { await run('ALTER TABLE users ADD COLUMN avatar TEXT DEFAULT ""'); } catch(e) { /* already exists */ }

  const subjectsCount = await get('SELECT COUNT(*) as c FROM subjects');
  if (subjectsCount.c === 0) {
    const ids = {};
    for (const [n,ic,co,ca,d] of [
      ['Mathematics','∑','#00e5ff','Science','Numbers, algebra, calculus'],
      ['Physics','⚛','#a855f7','Science','Laws of the universe'],
      ['History','🏛','#ff7043','Humanities','Events that shaped civilization'],
      ['Computer Science','</','#40c4ff','Technology','Algorithms and data structures'],
    ]) { 
      const res = await run(`INSERT INTO subjects (name,icon,color,category,description) VALUES (?,?,?,?,?)`,[n,ic,co,ca,d]);
      ids[n] = res.lastInsertRowid;
    }

    const cards = [
      [ids['Mathematics'],'What is the Pythagorean theorem?','a² + b² = c², where c is the hypotenuse'],
      [ids['Mathematics'],'What is the derivative of sin(x)?','cos(x)'],
      [ids['Mathematics'],'What is the integral of 1/x?','ln|x| + C'],
      [ids['Physics'],"What is Newton's Second Law?",'F = ma — Force equals mass times acceleration'],
      [ids['Physics'],'Speed of light?','≈ 299,792,458 m/s in vacuum'],
      [ids['History'],'When did WWII end?','September 2, 1945'],
      [ids['History'],'When did the French Revolution begin?','1789'],
      [ids['Computer Science'],'What is Big O notation?','A way to describe algorithm efficiency relative to input size'],
      [ids['Computer Science'],'What is a BST?','Tree where left < node < right for all nodes'],
    ];
    for (const [sid,f,b] of cards) {
      await run(`INSERT INTO flashcards (subject_id,front,back) VALUES (?,?,?)`,[sid,f,b]);
    }
  }

  const snippetsCount = await get('SELECT COUNT(*) as c FROM snippets');
  if (snippetsCount.c === 0) {
    const defaultSnippets = [
      ['C++ Fast I/O', 'cpp', 'ios_base::sync_with_stdio(false);\ncin.tie(NULL);', 'C++,Competitive Programming'],
      ['Python List Comprehension', 'python', 'squares = [x**2 for x in range(10) if x % 2 == 0]', 'Python,Shortcuts'],
      ['CSS Glassmorphism', 'css', '.glass {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 16px;\n}', 'CSS,Design,UI'],
      ['HTML5 Boilerplate', 'html', '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Document</title>\n</head>\n<body>\n  \n</body>\n</html>', 'HTML,Starter'],
      ['React UseEffect Fetch', 'javascript', 'useEffect(() => {\n  const fetchData = async () => {\n    const res = await fetch("/api/data");\n    const json = await res.json();\n    setData(json);\n  };\n  fetchData();\n}, []);', 'React,JavaScript'],
      ['JSON Example', 'json', '{\n  "name": "Nexus",\n  "version": "1.0.0",\n  "features": ["AI", "Flashcards", "Snippets"]\n}', 'JSON,Config']
    ];
    for (const [t,l,c,tags] of defaultSnippets) {
      await run(`INSERT INTO snippets (title,lang,code,tags) VALUES (?,?,?,?)`, [t,l,c,tags]);
    }
  }

  const sessionsCount = await get('SELECT COUNT(*) as c FROM sessions');
  if (sessionsCount.c === 0) {
    for (let i = 0; i < 7; i++) {
      const numSessions = Math.floor(Math.random() * 4) + 1;
      for (let j = 0; j < numSessions; j++) {
        const duration = [15, 25, 45, 60][Math.floor(Math.random() * 4)];
        await run(`INSERT INTO sessions (subject_id, duration, mode, completed_at) VALUES (1, ?, 'focus', datetime('now', '-${i} days'))`, [duration]);
      }
    }
  }
}

module.exports = { getDb, all, run, get };
