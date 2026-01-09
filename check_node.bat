@echo off
echo ========================================
echo   Node.js Installation Checker
echo ========================================
echo.

echo Checking if Node.js is installed...
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js is installed!
    node --version
    echo.
    echo Checking npm...
    where npm >nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] npm is installed!
        npm --version
    ) else (
        echo [X] npm is NOT found
    )
) else (
    echo [X] Node.js is NOT installed!
    echo.
    echo To install Node.js:
    echo 1. Go to: https://nodejs.org/
    echo 2. Download the LTS version
    echo 3. Run the installer
    echo 4. Make sure "Add to PATH" is checked
    echo 5. Restart your terminal after installation
    echo.
)

echo.
echo ========================================
pause

