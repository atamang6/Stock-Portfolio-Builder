# Complete Setup Guide

## Step 1: Navigate to Your Project

Your project is located at:
```
C:\Users\ea1\OneDrive - Case-mate\Desktop\Portfolio Builder
```

**In PowerShell/Command Prompt, run:**
```powershell
cd "C:\Users\ea1\OneDrive - Case-mate\Desktop\Portfolio Builder"
```

Or use the shorter path if available:
```powershell
cd "~\Desktop\Portfolio Builder"
```

---

## Step 2: Check if Node.js is Installed

**Check if Node.js is installed:**
```powershell
node --version
npm --version
```

### If you see version numbers:
✅ Node.js is installed! Skip to Step 3.

### If you see "not recognized" error:
❌ Node.js is NOT installed. You need to install it first.

---

## Step 3: Install Node.js (If Needed)

1. **Download Node.js:**
   - Go to: https://nodejs.org/
   - Download the **LTS version** (recommended)
   - Choose the Windows Installer (.msi)

2. **Install Node.js:**
   - Run the installer
   - Follow the installation wizard
   - **IMPORTANT**: Make sure "Add to PATH" is checked during installation
   - Restart your terminal/PowerShell after installation

3. **Verify Installation:**
   ```powershell
   node --version
   npm --version
   ```
   You should see version numbers (e.g., `v18.17.0` and `9.6.7`)

---

## Step 4: Set Up Backend

**Open Terminal/PowerShell #1:**

```powershell
# Navigate to project
cd "C:\Users\ea1\OneDrive - Case-mate\Desktop\Portfolio Builder"

# Go to backend folder
cd backend

# Create virtual environment (if not done)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# If you get an execution policy error, run this first:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Install Python dependencies
pip install -r requirements.txt

# Start backend server
python main.py
```

**✅ You should see:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**⚠️ KEEP THIS TERMINAL OPEN!**

---

## Step 5: Set Up Frontend

**Open a NEW Terminal/PowerShell #2:**

```powershell
# Navigate to project
cd "C:\Users\ea1\OneDrive - Case-mate\Desktop\Portfolio Builder"

# Go to frontend folder
cd frontend

# Install dependencies
npm install

# If npm install fails, try:
# npm install --legacy-peer-deps

# Start frontend server
npm run dev
```

**✅ You should see:**
```
  VITE v5.0.8  ready in 500 ms
  ➜  Local:   http://localhost:3000/
```

**⚠️ KEEP THIS TERMINAL OPEN TOO!**

---

## Step 6: Open the App

1. Open your web browser
2. Go to: **http://localhost:3000**
3. You should see the Stock Analysis interface!

---

## Quick Troubleshooting

### "Execution Policy" Error in PowerShell
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then try activating the virtual environment again.

### "npm is not recognized" After Installing Node.js
1. Close and reopen your terminal
2. Restart your computer (if needed)
3. Verify Node.js is in PATH:
   ```powershell
   $env:PATH -split ';' | Select-String node
   ```

### "Cannot find path" Error
Make sure you're in the correct directory:
```powershell
# Check current directory
pwd

# Should show: C:\Users\ea1\OneDrive - Case-mate\Desktop\Portfolio Builder
```

### Port Already in Use
- Backend (8000): Close other apps or change port in `backend/main.py`
- Frontend (3000): Vite will auto-use next port

---

## Summary Checklist

- [ ] Node.js installed and working (`node --version` works)
- [ ] Navigated to project directory
- [ ] Backend virtual environment created and activated
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Backend server running (`python main.py`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend server running (`npm run dev`)
- [ ] Browser can access http://localhost:3000

---

## Need More Help?

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed troubleshooting steps.

