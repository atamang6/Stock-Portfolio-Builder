# Install Node.js - Quick Guide

## The Problem
Node.js is not installed on your system, which is required to run the frontend.

## Solution: Install Node.js

### Step 1: Download Node.js
1. Go to: **https://nodejs.org/**
2. Download the **LTS version** (recommended)
   - It will be something like "Node.js v20.x.x LTS"
   - Choose the **Windows Installer (.msi)** - 64-bit

### Step 2: Install Node.js
1. Run the installer you just downloaded
2. Follow the installation wizard:
   - Click "Next" through the setup
   - **IMPORTANT**: Make sure **"Add to PATH"** is checked ✅
   - Accept the license agreement
   - Choose installation location (default is fine)
   - Click "Install"
   - Wait for installation to complete
   - Click "Finish"

### Step 3: Restart Your Terminal
**CRITICAL**: After installing Node.js:
1. **Close ALL PowerShell/Command Prompt windows**
2. **Open a NEW PowerShell window**
3. Verify installation:
   ```powershell
   node --version
   npm --version
   ```
   You should see version numbers (e.g., `v20.11.0` and `10.2.4`)

### Step 4: Install Frontend Dependencies
Once Node.js is installed and verified:

```powershell
cd "C:\Users\ea1\OneDrive - Case-mate\Desktop\Portfolio Builder\frontend"
npm install
npm run dev
```

---

## Troubleshooting

### "node is not recognized" after installing
1. **Restart your computer** (sometimes needed for PATH changes)
2. Or manually add Node.js to PATH:
   - Search "Environment Variables" in Windows
   - Edit "Path" in User variables
   - Add: `C:\Program Files\nodejs\`

### Installation takes time
The `npm install` command downloads many packages and may take 2-5 minutes. Be patient!

### Port already in use
If port 3000 is busy, Vite will automatically use 3001, 3002, etc. Check the terminal output for the actual port.

---

## After Installation

Once Node.js is installed and frontend is running:
- Backend should be on: `http://localhost:8000`
- Frontend should be on: `http://localhost:3000`
- Open your browser to `http://localhost:3000` to use the app!

