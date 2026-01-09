@echo off
echo ========================================
echo   Backend Setup Script
echo ========================================
echo.

REM Change to script directory
cd /d "%~dp0\backend"

echo Current directory: %CD%
echo.

echo Step 1: Creating virtual environment...
if not exist "venv" (
    python -m venv venv
    echo Virtual environment created!
) else (
    echo Virtual environment already exists.
)
echo.

echo Step 2: Activating virtual environment...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo Warning: Could not activate virtual environment automatically.
    echo You may need to activate it manually.
)
echo.

echo Step 3: Installing Python dependencies...
pip install -r requirements.txt
echo.

echo Step 4: Starting backend server...
echo.
echo ========================================
echo   Backend Server Starting...
echo   Keep this window open!
echo ========================================
echo.

python main.py

pause

