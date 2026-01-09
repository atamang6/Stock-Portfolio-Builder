@echo off
REM Simple script to run backend - activates venv and starts server
cd /d "%~dp0"
call venv\Scripts\activate.bat
pip install -r requirements.txt
echo.
echo ========================================
echo   Starting Backend Server...
echo   Keep this window open!
echo ========================================
echo.
python main.py
pause

