@echo off
cd /d %~dp0
start "NEXUS Server" cmd /k "node server/index.js"
timeout /t 2 /nobreak > nul
start "NEXUS Client" cmd /k "cd client && npm run dev"
timeout /t 3 /nobreak > nul
start http://localhost:5173
