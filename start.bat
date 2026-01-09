@echo off
echo ========================================
echo   Stock Analysis App - Startup Helper
echo ========================================
echo.
echo This will help you start both servers.
echo You need TWO terminals - one for backend, one for frontend.
echo.
echo.

:menu
echo.
echo What would you like to do?
echo.
echo [1] Start Backend Server
echo [2] Start Frontend Server
echo [3] Check if servers are running
echo [4] Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto start_backend
if "%choice%"=="2" goto start_frontend
if "%choice%"=="3" goto check_servers
if "%choice%"=="4" goto end
goto menu

:start_backend
echo.
echo Starting Backend Server...
echo Make sure virtual environment is activated!
echo.
cd backend
call venv\Scripts\activate
python main.py
pause
goto menu

:start_frontend
echo.
echo Starting Frontend Server...
echo.
cd frontend
call npm run dev
pause
goto menu

:check_servers
echo.
echo Checking servers...
echo.
echo Testing Backend (http://localhost:8000)...
curl -s http://localhost:8000 >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Backend is running!
) else (
    echo [X] Backend is NOT running
)
echo.
echo Testing Frontend (http://localhost:3000)...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Frontend is running!
) else (
    echo [X] Frontend is NOT running
)
echo.
pause
goto menu

:end
echo.
echo Goodbye!
exit

