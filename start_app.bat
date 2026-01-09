@echo off
echo ========================================
echo   Starting Stock Analysis App
echo ========================================
echo.
echo This will open TWO windows:
echo   1. Backend server (Terminal 1)
echo   2. Frontend server (Terminal 2)
echo.
echo Keep BOTH windows open while using the app!
echo.
pause

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0backend && venv\Scripts\python.exe main.py"

timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Server...
echo Note: If you see npm errors, make sure Node.js is installed and in PATH
start "Frontend Server" cmd /k "cd /d %~dp0frontend && npm.cmd install && npm.cmd run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo The app will open automatically once ready.
echo Keep both terminal windows open!
echo.
pause

