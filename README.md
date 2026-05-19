# Nexus Knowledge OS ✦

Nexus is a state-of-the-art, AI-powered learning and knowledge management dashboard built for serious scholars, developers, and students. With a futuristic dark mode design, it seamlessly integrates focus tools, flashcards, a code snippet vault, and an embedded AI Co-Pilot powered by Groq.

## 🚀 Features

- **Hub & Analytics**: A beautiful, scrollable dashboard with AI-generated daily insights, study activity charts, and subject mastery tracking.
- **AI Flashcards**: One-click generation of educational flashcards on any topic, integrated with a spaced repetition study mode and 3D flip effects.
- **Code Vault**: Save, manage, and edit code snippets in multiple languages (C++, Python, React, HTML, CSS, JSON). Includes an AI code generator to instantly generate useful random snippets.
- **Gamification**: An achievements system that tracks your progress and unlocks beautiful badges (e.g., *Early Bird*, *Grandmaster*, *AI Whisperer*).
- **Authentication**: Fully functioning local user login and registration system with secure local storage persistence.
- **Focus Timer**: A built-in Pomodoro timer with dynamic focus waves.

## 🛠 Tech Stack

- **Frontend**: React, Vite, Recharts, Vanilla CSS (Glassmorphism & Neon Design)
- **Backend**: Node.js, Express, SQLite3 (Local Persistence)
- **AI Integration**: Groq API (`llama-3.1-8b-instant`)

## 📦 Getting Started

### 1. Configure the AI
Create a `.env` file in the root directory and add your Groq API key:
```env
GROQ_API_KEY=gsk_your_api_key_here
```

### 2. Run the App
Double-click the `RUN NEXUS.bat` file in the project directory, or manually run:
```bash
npm run dev
```
The app will automatically start the Node server (port 3001) and the Vite frontend (port 5173).

## 🏆 Default Snippets
The application automatically seeds a library of essential starter snippets for you, including C++ Fast I/O, CSS Glassmorphism, React Hooks, and Python logic!
