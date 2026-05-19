# ✦ NEXUS — Knowledge OS

A professional, full-stack learning application with a dark futuristic UI, 3D animations, AI-powered features, and spaced repetition flashcards.

---

## Features

| Module | Description |
|--------|-------------|
| **Dashboard** | Live stats, activity chart, study streak, subject progress |
| **Subjects** | Create/manage subjects with 3D holographic card hover |
| **Flashcards** | 3D flip cards, spaced repetition (SM-2 algorithm), list view |
| **Focus Timer** | Pomodoro timer with animated SVG ring, session tracking |
| **Notes** | Per-subject notes with auto-save |
| **AI Tutor** | Chat with Claude AI, generate flashcards from any topic |

---

## Requirements

- **Node.js** v18 or later → https://nodejs.org
- **npm** (comes with Node.js)
- **Anthropic API Key** (optional, for AI features) → https://console.anthropic.com

---

## Quick Start

### Windows
```
Double-click  start.bat
```

### Mac / Linux
```bash
chmod +x start.sh
./start.sh
```

### Manual
```bash
# 1. Install dependencies
npm install
cd client && npm install && cd ..

# 2. Configure environment
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# 3. Run both servers
# Terminal 1:
node server/index.js

# Terminal 2:
cd client && npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## Project Structure

```
nexus-app/
├── server/
│   ├── index.js      ← Express API server
│   └── db.js         ← SQLite database + schema
├── client/
│   └── src/
│       ├── views/    ← Dashboard, Subjects, Flashcards, Timer, Notes, AI
│       ├── components/ ← Background3D (Three.js), Sidebar
│       ├── api.js    ← API client
│       └── index.css ← Full design system
├── .env.example      ← Environment template
├── start.bat         ← Windows launcher
└── start.sh          ← Mac/Linux launcher
```

---

## AI Features

Add your Anthropic API key to `.env`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

Then you can:
- Chat with NEXUS AI about any subject
- Generate flashcards on any topic instantly
- Get personalized study tips

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start/pause Focus Timer |
| `Enter` | Send AI message |
| `Shift+Enter` | New line in AI input |

---

## Tech Stack

- **Backend**: Node.js, Express, SQLite (better-sqlite3)
- **Frontend**: React 18, Vite, Three.js, Recharts
- **AI**: Anthropic Claude API
- **Design**: Custom CSS, Google Fonts (Orbitron, Rajdhani, Space Mono)
