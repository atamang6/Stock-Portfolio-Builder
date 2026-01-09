@echo off
echo ========================================
echo   Installing Python Dependencies
echo ========================================
echo.
echo This will install packages with pre-built wheels.
echo.

cd /d "%~dp0"

REM Activate venv
call venv\Scripts\activate.bat

echo Upgrading pip...
python -m pip install --upgrade pip

echo.
echo Installing packages (this may take a few minutes)...
echo.

REM Install packages one by one to avoid compilation issues
python -m pip install fastapi uvicorn[standard] python-multipart yfinance python-dotenv httpx --upgrade

echo.
echo Installing pandas, numpy, scipy...
python -m pip install pandas numpy scipy --upgrade

echo.
echo Installing ta (technical analysis library)...
python -m pip install ta --upgrade

echo.
echo Installing pydantic (latest version with pre-built wheels)...
python -m pip install pydantic --upgrade

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo You can now start the server with:
echo   python main.py
echo.
pause

