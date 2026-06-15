@echo off
cd /d "%~dp0"

echo Starting PCR Dashboard...

:: Start the Node.js server in a new window
start "PCR Dashboard Server" cmd /k "node server.js"

:: Wait for the server to start
timeout /t 5 /nobreak > nul

:: Open the dashboard in the default browser
start "" "http://localhost:3001"

exit