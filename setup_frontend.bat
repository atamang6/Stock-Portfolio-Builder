@echo off
echo ========================================
echo   Frontend Setup Script
echo ========================================
echo.

REM Change to script directory
cd /d "%~dp0\frontend"

echo Current directory: %CD%
echo.

echo Checking if Node.js is installed...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Node.js is not installed or not in PATH!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version and make sure to check "Add to PATH" during installation.
    echo.
    pause
    exit /b 1
)

echo Node.js found!
node --version
npm --version
echo.

echo Step 1: Installing frontend dependencies...
echo This may take a few minutes...
npm install
if %errorlevel% neq 0 (
    echo.
    echo npm install failed. Trying with --legacy-peer-deps...
    npm install --legacy-peer-deps
)
echo.

echo Step 2: Starting frontend server...
echo.
echo ========================================
echo   Frontend Server Starting...
echo   Keep this window open!
echo ========================================
echo.

npm run dev

pause

