@echo off
cd /d "%~dp0"

:: Check if port 5173 is already active/listening
netstat -ano | findstr :5173 | findstr LISTENING > nul
if %errorlevel%==0 (
  if "%~1"=="--no-browser" (
    exit
  )
  if exist "C:\Program Files\Google\Chrome\Application\chrome_proxy.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome_proxy.exe" --profile-directory=Default --app-id=idemibpphagihbobmgmaojhjfidlfpdl
  ) else (
    start http://localhost:5173
  )
  exit
)

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
ping 127.0.0.1 -n 3 > nul
cd client && start "NEXUS Client" cmd /k "npm run dev"
cd ..

echo Waiting for NEXUS client to start...
:wait_client
netstat -ano | findstr :5173 | findstr LISTENING > nul
if errorlevel 1 (
  ping 127.0.0.1 -n 2 > nul
  goto wait_client
)
if "%~1"=="--no-browser" (
  echo NEXUS Services started successfully in the background!
) else (
  echo NEXUS Client started successfully! Opening application...
  if exist "C:\Program Files\Google\Chrome\Application\chrome_proxy.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome_proxy.exe" --profile-directory=Default --app-id=idemibpphagihbobmgmaojhjfidlfpdl
  ) else (
    start http://localhost:5173
  )
)

