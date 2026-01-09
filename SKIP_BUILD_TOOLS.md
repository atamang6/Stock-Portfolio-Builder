# Skip Build Tools Installation

## You Don't Need This!

The installer is asking to install Python and Visual Studio Build Tools for compiling native Node.js modules.

**For this project, you can skip this!** 

### Why?
- We're using pre-built packages (wheels) for Python dependencies
- The frontend uses standard JavaScript packages that don't require compilation
- This installation would take a long time and use ~7GB of space

### What to Do:
1. **Close the installer window** - just close it or press Esc
2. Node.js will still work fine for our project
3. Continue with starting the frontend server

---

## Continue Setup

After closing the installer, follow these steps:

### Step 1: Verify Node.js Works

Open a **new** PowerShell window and run:
```powershell
node --version
npm --version
```

If you see version numbers, Node.js is ready!

### Step 2: Start Backend (Terminal 1)

```powershell
cd "C:\Users\ea1\OneDrive - Case-mate\Desktop\Portfolio Builder\backend"
.\venv\Scripts\python.exe main.py
```

Keep this window open!

### Step 3: Start Frontend (Terminal 2 - NEW window)

```powershell
cd "C:\Users\ea1\OneDrive - Case-mate\Desktop\Portfolio Builder\frontend"
npm install
npm run dev
```

### Step 4: Open Browser

Go to: `http://localhost:3000`

---

## If npm install fails

If you get errors during `npm install`, try:
```powershell
npm install --legacy-peer-deps
```

This is usually enough to fix dependency issues without needing build tools.

