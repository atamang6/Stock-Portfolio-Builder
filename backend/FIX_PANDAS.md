# Fix Pandas Installation Error

## The Problem

Pandas is trying to build from source, which requires a C compiler (Visual Studio Build Tools). This is complex and unnecessary.

## Solution: Use Pre-built Wheels

Instead of building from source, we'll use pre-built packages (wheels) that don't require compilation.

## Quick Fix

Run this command in PowerShell:

```powershell
# Make sure you're in the backend folder
cd "C:\Users\ea1\OneDrive - Case-mate\Desktop\Portfolio Builder\backend"

# Upgrade pip first
.\venv\Scripts\python.exe -m pip install --upgrade pip

# Install packages (pip will automatically use pre-built wheels)
.\venv\Scripts\python.exe -m pip install fastapi uvicorn[standard] python-multipart yfinance pandas numpy scipy ta python-dotenv pydantic httpx
```

## Or Use the Batch File

Double-click `install_dependencies.bat` in the `backend` folder.

## Why This Works

- Modern pip automatically prefers pre-built wheels over source builds
- The updated requirements.txt uses version ranges that allow pip to find compatible pre-built packages
- No C compiler needed!

## After Installation

Once dependencies are installed, start the server:

```powershell
.\venv\Scripts\python.exe main.py
```

## Alternative: Install Visual Studio Build Tools

If you really need to build from source (not recommended), install:
- Visual Studio Build Tools: https://visualstudio.microsoft.com/downloads/
- Select "Desktop development with C++" workload

But the wheel-based installation above is much easier and faster!

