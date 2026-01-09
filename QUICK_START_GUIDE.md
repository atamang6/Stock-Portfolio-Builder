# Quick Start Guide - Both Servers Required!

## ⚠️ IMPORTANT: You Need TWO Windows Running!

The app requires **BOTH** servers to be running:
1. **Backend** on port 8000 (Python/FastAPI)
2. **Frontend** on port 3000 (React/Vite)

---

## Step 1: Start Backend (Terminal 1)

### Option A: Double-Click Script (Easiest)
Double-click **`START_BACKEND.bat`** in the project root folder.

### Option B: Manual Command
Open **Command Prompt** and run:
```cmd
cd "C:\Users\ea1\OneDrive - Case-mate\Desktop\Portfolio Builder\backend"
venv\Scripts\activate.bat
python main.py
```

**✅ You should see:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

**⚠️ KEEP THIS WINDOW OPEN!**

---

## Step 2: Start Frontend (Terminal 2)

### Option A: Double-Click Script
Double-click **`frontend/start_frontend_cmd.bat`**

### Option B: Manual Command
Open a **NEW Command Prompt** window and run:
```cmd
cd "C:\Users\ea1\OneDrive - Case-mate\Desktop\Portfolio Builder\frontend"
npm install
npm run dev
```

**✅ You should see:**
```
  VITE v5.0.8  ready in 500 ms
  ➜  Local:   http://localhost:3000/
```

**⚠️ KEEP THIS WINDOW OPEN TOO!**

---

## Step 3: Verify Both Are Running

### Test Backend:
Open browser: **http://localhost:8000**
- Should see: `{"message":"Stock Analysis API is running"}`

### Test Frontend:
Open browser: **http://localhost:3000**
- Should see the Stock Analysis app interface

---

## Quick Check: Are Both Running?

**Backend (port 8000):**
- ✅ Terminal window open
- ✅ Shows "Uvicorn running on http://0.0.0.0:8000"
- ✅ Browser shows API message at http://localhost:8000

**Frontend (port 3000):**
- ✅ Terminal window open
- ✅ Shows "Local: http://localhost:3000/"
- ✅ Browser shows the app at http://localhost:3000

---

## Common Issues

### "Connection Failed" or "Cannot connect"
- Backend is not running
- Start it with `START_BACKEND.bat` or manual commands above

### "ERR_CONNECTION_REFUSED"
- Backend is not running
- Check if you see the backend terminal window

### Frontend works but analysis fails
- Backend is not running or crashed
- Check backend terminal for errors
- Restart backend

---

## Use the Helper Script

**Easiest way:** Double-click **`start_app.bat`** in the project root.
It will start both servers in separate windows automatically!

---

## Remember

- **TWO windows must stay open** (one for backend, one for frontend)
- Backend = port 8000
- Frontend = port 3000
- Both must run at the same time!

