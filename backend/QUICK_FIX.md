# Quick Fix - Backend Setup

## The Problem
The virtual environment isn't activating properly in PowerShell, so `pip` isn't found.

## Solution: Use Full Path to Python/pip

Instead of activating the venv, use the full path directly:

### In PowerShell, run these commands:

```powershell
# Navigate to backend (you're already here)
cd "C:\Users\ea1\OneDrive - Case-mate\Desktop\Portfolio Builder\backend"

# Install dependencies using venv's pip directly
.\venv\Scripts\python.exe -m pip install -r requirements.txt

# Start the server using venv's python directly
.\venv\Scripts\python.exe main.py
```

**That's it!** No need to activate the venv.

---

## Alternative: Use the Batch File

Just double-click `run_backend.bat` in the `backend` folder. It will:
1. Activate the venv (using Command Prompt method)
2. Install dependencies
3. Start the server

---

## Why This Works

The virtual environment's Python and pip are located at:
- `venv\Scripts\python.exe`
- `venv\Scripts\pip.exe`

You can use them directly without activating the environment!

---

## After This Works

Once the backend is running, you should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Then open a **NEW terminal** for the frontend!

