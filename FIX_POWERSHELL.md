# Fix PowerShell Execution Policy Error

## The Problem

PowerShell is blocking the virtual environment activation script due to security settings.

**Error you're seeing:**
```
File ...\Activate.ps1 cannot be loaded because running scripts is disabled on this system.
```

## Solution 1: Fix Execution Policy (Recommended)

Run this command in PowerShell **as Administrator**:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Steps:**
1. Right-click PowerShell → "Run as Administrator"
2. Run the command above
3. Type `Y` when prompted
4. Close and reopen your terminal
5. Try activating the venv again

## Solution 2: Use Command Prompt Instead

**Use Command Prompt (cmd.exe) instead of PowerShell:**

1. Open **Command Prompt** (not PowerShell)
2. Navigate to backend:
   ```cmd
   cd "C:\Users\ea1\OneDrive - Case-mate\Desktop\Portfolio Builder\backend"
   ```
3. Activate venv:
   ```cmd
   venv\Scripts\activate.bat
   ```
4. Continue with setup:
   ```cmd
   pip install -r requirements.txt
   python main.py
   ```

## Solution 3: Use the Batch File

I've created a helper script. In **Command Prompt** (not PowerShell):

```cmd
cd "C:\Users\ea1\OneDrive - Case-mate\Desktop\Portfolio Builder\backend"
activate_venv.bat
```

Then in the new window that opens:
```cmd
pip install -r requirements.txt
python main.py
```

## Solution 4: Bypass for Single Command

If you just need to run one command, you can call Python directly:

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe main.py
```

## Quick Setup (Command Prompt Method)

**Terminal 1 - Backend (use Command Prompt):**
```cmd
cd "C:\Users\ea1\OneDrive - Case-mate\Desktop\Portfolio Builder\backend"
venv\Scripts\activate.bat
pip install -r requirements.txt
python main.py
```

**Terminal 2 - Frontend (PowerShell is fine):**
```powershell
cd "C:\Users\ea1\OneDrive - Case-mate\Desktop\Portfolio Builder\frontend"
npm install
npm run dev
```

## Why This Happens

Windows PowerShell has execution policies to prevent malicious scripts from running. The virtual environment activation script is a PowerShell script (`.ps1`), so it gets blocked.

The batch file (`.bat`) version doesn't have this restriction, which is why Solution 2 works.

## Recommended Approach

**For easiest setup, use Command Prompt for the backend:**
- Command Prompt doesn't have execution policy restrictions
- The `.bat` activation script works immediately
- No need to change system settings

