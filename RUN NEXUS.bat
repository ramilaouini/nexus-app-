@echo off
cd /d %~dp0
start "NEXUS Server" cmd /k "node server/index.js"
ping 127.0.0.1 -n 3 > nul
start "NEXUS Client" cmd /k "cd client && npm run dev"
echo Waiting for NEXUS client to start...
:wait_client
netstat -ano | findstr :5173 | findstr LISTENING > nul
if errorlevel 1 (
  ping 127.0.0.1 -n 2 > nul
  goto wait_client
)
echo NEXUS Client started successfully! Opening application...

if exist "C:\Program Files\Google\Chrome\Application\chrome_proxy.exe" (
  start "" "C:\Program Files\Google\Chrome\Application\chrome_proxy.exe" --profile-directory=Default --app-id=idemibpphagihbobmgmaojhjfidlfpdl
) else (
  start http://localhost:5173
)
