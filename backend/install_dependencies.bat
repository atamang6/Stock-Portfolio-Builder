@echo off
echo ========================================
echo   Installing Python Dependencies
echo ========================================
echo.
echo This will install all required packages.
echo It may take a few minutes...
echo.

cd /d "%~dp0"

REM Use venv's pip directly
echo Using virtual environment Python...
.\venv\Scripts\python.exe -m pip install --upgrade pip
echo.

echo Installing packages (this may take a while)...
.\venv\Scripts\python.exe -m pip install fastapi uvicorn[standard] python-multipart yfinance pandas numpy scipy ta python-dotenv pydantic httpx

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo You can now start the server with:
echo   .\venv\Scripts\python.exe main.py
echo.
pause

