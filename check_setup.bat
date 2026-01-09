@echo off
echo ========================================
echo   Setup Checker
echo ========================================
echo.

echo Checking Python...
where python >nul 2>&1
if %errorlevel% equ 0 (
    python --version
    echo [OK] Python is installed
) else (
    echo [X] Python is NOT installed or not in PATH
)
echo.

echo Checking Node.js...
where node >nul 2>&1
if %errorlevel% equ 0 (
    node --version
    echo [OK] Node.js is installed
) else (
    echo [X] Node.js is NOT installed or not in PATH
    echo     Download from: https://nodejs.org/
)
echo.

echo Checking npm...
where npm >nul 2>&1
if %errorlevel% equ 0 (
    npm --version
    echo [OK] npm is installed
) else (
    echo [X] npm is NOT installed or not in PATH
)
echo.

echo Checking project structure...
if exist "backend\main.py" (
    echo [OK] Backend files found
) else (
    echo [X] Backend files NOT found
)

if exist "frontend\package.json" (
    echo [OK] Frontend files found
) else (
    echo [X] Frontend files NOT found
)
echo.

echo Checking if servers are running...
echo.
echo Testing Backend (http://localhost:8000)...
curl -s http://localhost:8000 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend server is running
) else (
    echo [X] Backend server is NOT running
    echo     Run: setup_backend.bat
)
echo.

echo Testing Frontend (http://localhost:3000)...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend server is running
) else (
    echo [X] Frontend server is NOT running
    echo     Run: setup_frontend.bat
)
echo.

echo ========================================
pause

