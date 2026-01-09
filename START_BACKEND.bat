@echo off
echo ========================================
echo   Starting Backend Server
echo ========================================
echo.

cd /d "%~dp0\backend"

echo Current directory: %CD%
echo.

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Checking if dependencies are installed...
python -c "import fastapi" 2>nul
if %errorlevel% neq 0 (
    echo.
    echo Dependencies not found. Installing now...
    echo This may take a few minutes...
    echo.
    python -m pip install --upgrade pip
    python -m pip install -r requirements.txt
    echo.
    echo Dependencies installed!
    echo.
)

echo.
echo Starting backend server on http://localhost:8000
echo.
echo ========================================
echo   KEEP THIS WINDOW OPEN!
echo ========================================
echo.
echo The server must stay running for the app to work.
echo Close this window only when you're done using the app.
echo.

python main.py

pause

