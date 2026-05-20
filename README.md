# 🌌 Nexus Knowledge OS

> *The ultimate AI-powered brain for scholars, developers, and lifelong learners.*

Nexus is a state-of-the-art, entirely self-hosted educational operating system. It moves beyond the simple "flashcard app" by providing a highly gamified, AI-integrated learning environment designed to help you master new subjects faster, manage code snippets effortlessly, and track your deep-focus sessions.

---

## ✨ Features

### 🤖 True AI Co-Pilot
- **Random Flashcard Generation**: Want to learn something new? The AI generates completely random, fascinating educational flashcards for you with one click.
- **Code Snippet Generation**: Hit the "AI Random Snippet" button, and watch as Nexus populates your code vault with useful algorithms, CSS tricks, and React patterns.
- **Dynamic Dashboard Insights**: Every time you log in, your dashboard greets you with a highly-motivational, AI-generated insight tailored to accelerate your learning.

### 🎮 Gamification & Analytics
- **Achievements Hub**: Unlock 12 beautifully designed badges like *Code Wizard*, *Deep Focus*, and *Grandmaster* by hitting learning milestones. 
- **Activity Heatmaps**: Your dashboard visualizes your study sessions over the last 7 days with premium Area Charts and Bar Charts.

### 🎧 Lo-Fi & Focus Mode
- **Built-in Music Player**: Stay in the zone with an integrated lo-fi music, podcast, and radio player to accompany your study and coding sessions.
- **High-Quality Audio**: Dynamic track metadata and reliable audio fetching for uninterrupted deep focus.

### 🔐 Secure & Persistent Profile
- **Account Management**: Log in safely with an integrated authentication layer. 
- **Custom Avatars**: Upload a custom profile picture directly to your user dashboard. 
- **Offline SQLite Storage**: All your progress, snippets, and notes are securely stored in your local `.db` file.

---

## 🛠 Tech Stack
- **Frontend**: React (Vite), CSS3 Glassmorphism UI, Recharts (Data Visualization)
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Artificial Intelligence**: Groq API (`llama-3.1-8b-instant`)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- A Groq API Key (You can get one for free at [groq.com](https://groq.com/))

### 2. Installation
Clone the repository and set up your environment variables:
```bash
git clone https://github.com/ramilaouini/nexus-app-.git
cd nexus-app-
```

Create a `.env` file in the root of your folder and add your Groq API Key:
```env
GROQ_API_KEY=your_api_key_here
```

### 3. Run the App
To start both the client and the server simultaneously, simply use the provided batch script or run:
```bash
npm run dev
```

The server will automatically seed your database with useful coding templates (HTML, CSS, JSON, Python, C++) if your vault is empty!

---

## 🎨 Design Philosophy
Nexus distances itself from boring, clinical study apps. We use heavy glassmorphism, dynamic glowing drop-shadows, and curated color palettes (deep cyan, vibrant purple) to make learning an aesthetically stunning experience.

*Developed with passion for absolute productivity.*
