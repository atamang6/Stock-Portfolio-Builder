@echo off
echo ========================================
echo   Node.js PATH Checker
echo ========================================
echo.

echo Checking if Node.js is in PATH...
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js is in PATH!
    echo.
    echo Node.js location:
    where node
    echo.
    node --version
    npm --version
) else (
    echo [X] Node.js is NOT in PATH
    echo.
    echo Checking common installation locations...
    echo.
    
    if exist "C:\Program Files\nodejs\node.exe" (
        echo [FOUND] Node.js at: C:\Program Files\nodejs\
        echo.
        echo To add to PATH:
        echo 1. Press Win+R, type: sysdm.cpl
        echo 2. Click "Advanced" tab
        echo 3. Click "Environment Variables"
        echo 4. Under "Path", click "Edit"
        echo 5. Click "New"
        echo 6. Add: C:\Program Files\nodejs\
        echo 7. Click OK on all windows
        echo 8. Restart your terminal
    ) else if exist "C:\Program Files (x86)\nodejs\node.exe" (
        echo [FOUND] Node.js at: C:\Program Files (x86)\nodejs\
        echo Follow the same PATH instructions above with this path.
    ) else (
        echo [NOT FOUND] Node.js is not installed!
        echo.
        echo Please install Node.js from: https://nodejs.org/
        echo Make sure to check "Add to PATH" during installation.
    )
)

echo.
echo ========================================
pause

