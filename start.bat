@echo off
echo.
echo  ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗
echo  ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝
echo  ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗
echo  ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║
echo  ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║
echo  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
echo                   Knowledge OS
echo.

if not exist ".env" (
  echo [SETUP] Copying .env.example to .env ...
  copy .env.example .env
  echo [ACTION] Open .env and add your ANTHROPIC_API_KEY for AI features.
  echo.
)

if not exist "node_modules" (
  echo [INSTALL] Installing server dependencies...
  call npm install
)

if not exist "client\node_modules" (
  echo [INSTALL] Installing client dependencies...
  cd client && call npm install && cd ..
)

echo [START] Starting NEXUS...
echo  - API:      http://localhost:3001
echo  - App:      http://localhost:5173
echo.

start "NEXUS Server" cmd /k "node server/index.js"
timeout /t 2 /nobreak > nul
cd client && start "NEXUS Client" cmd /k "npm run dev"
cd ..

timeout /t 3 /nobreak > nul
start http://localhost:5173
