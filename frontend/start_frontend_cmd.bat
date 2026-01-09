@echo off
REM Start frontend using Command Prompt (avoids PowerShell execution policy issues)
cd /d "%~dp0"
echo Installing dependencies...
call npm.cmd install
if %errorlevel% neq 0 (
    echo.
    echo npm install failed. Trying with --legacy-peer-deps...
    call npm.cmd install --legacy-peer-deps
)
echo.
echo Starting frontend server...
call npm.cmd run dev
pause

