const initSqlJs = require('sql.js');
const path = require('path');
const fs   = require('fs');

const DB_PATH = path.join(__dirname, '../nexus.db');
let _db = null;

async function getDb() {
  if (_db) return _db;
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    _db = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    _db = new SQL.Database();
  }
  _db.run('PRAGMA foreign_keys = ON;');
  initSchema();
  return _db;
}

function save() {
  if (!_db) return;
  fs.writeFileSync(DB_PATH, Buffer.from(_db.export()));
}

function all(sql, p=[]) {
  const s = _db.prepare(sql); s.bind(p);
  const rows = [];
  while (s.step()) rows.push(s.getAsObject());
  s.free();
  return rows;
}

function run(sql, p=[]) {
  _db.run(sql, p);
  save();
  const r = _db.exec('SELECT last_insert_rowid() as id');
  return { lastInsertRowid: r[0]?.values[0][0] };
}

function get(sql, p=[]) { return all(sql,p)[0] || null; }

function initSchema() {
  _db.run(`
    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL, icon TEXT DEFAULT '📚', color TEXT DEFAULT '#00e5ff',
      category TEXT DEFAULT 'General', description TEXT DEFAULT '',
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
      completed_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT, subject_id INTEGER,
      title TEXT NOT NULL, content TEXT DEFAULT '',
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
  save();

  if (get('SELECT COUNT(*) as c FROM subjects').c === 0) {
    const ids = {};
    for (const [n,ic,co,ca,d] of [
      ['Mathematics','∑','#00e5ff','Science','Numbers, algebra, calculus'],
      ['Physics','⚛','#a855f7','Science','Laws of the universe'],
      ['History','🏛','#ff7043','Humanities','Events that shaped civilization'],
      ['Computer Science','</','#40c4ff','Technology','Algorithms and data structures'],
    ]) { ids[n] = run(`INSERT INTO subjects (name,icon,color,category,description) VALUES (?,?,?,?,?)`,[n,ic,co,ca,d]).lastInsertRowid; }

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
    for (const [sid,f,b] of cards) run(`INSERT INTO flashcards (subject_id,front,back) VALUES (?,?,?)`,[sid,f,b]);
  }

  if (get('SELECT COUNT(*) as c FROM snippets').c === 0) {
    const defaultSnippets = [
      ['C++ Fast I/O', 'cpp', 'ios_base::sync_with_stdio(false);\ncin.tie(NULL);', 'C++,Competitive Programming'],
      ['Python List Comprehension', 'python', 'squares = [x**2 for x in range(10) if x % 2 == 0]', 'Python,Shortcuts'],
      ['CSS Glassmorphism', 'css', '.glass {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 16px;\n}', 'CSS,Design,UI'],
      ['HTML5 Boilerplate', 'html', '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Document</title>\n</head>\n<body>\n  \n</body>\n</html>', 'HTML,Starter'],
      ['React UseEffect Fetch', 'javascript', 'useEffect(() => {\n  const fetchData = async () => {\n    const res = await fetch("/api/data");\n    const json = await res.json();\n    setData(json);\n  };\n  fetchData();\n}, []);', 'React,JavaScript'],
      ['JSON Example', 'json', '{\n  "name": "Nexus",\n  "version": "1.0.0",\n  "features": ["AI", "Flashcards", "Snippets"]\n}', 'JSON,Config']
    ];
    for (const [t,l,c,tags] of defaultSnippets) run(`INSERT INTO snippets (title,lang,code,tags) VALUES (?,?,?,?)`, [t,l,c,tags]);
  }

  // Seed Dummy Sessions for the Dashboard Activity Chart
  if (get('SELECT COUNT(*) as c FROM sessions').c === 0) {
    for (let i = 0; i < 7; i++) {
      const numSessions = Math.floor(Math.random() * 4) + 1; // 1 to 4 sessions per day
      for (let j = 0; j < numSessions; j++) {
        const duration = [15, 25, 45, 60][Math.floor(Math.random() * 4)];
        run(`INSERT INTO sessions (subject_id, duration, mode, completed_at) VALUES (1, ?, 'focus', datetime('now', '-${i} days'))`, [duration]);
      }
    }
  }

  try { run('ALTER TABLE users ADD COLUMN avatar TEXT DEFAULT ""'); } catch(e) { /* already exists */ }
}

module.exports = { getDb, all, run, get };
