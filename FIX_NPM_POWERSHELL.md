# Fix npm PowerShell Execution Policy Error

## The Problem

PowerShell is blocking npm because of execution policy restrictions.

**Error:**
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled
```

## Solution 1: Fix Execution Policy (Recommended)

Run PowerShell **as Administrator**:

1. Right-click PowerShell → "Run as Administrator"
2. Run this command:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Type `Y` when prompted
4. Close and reopen your terminal
5. Try `npm install` again

## Solution 2: Use Command Prompt Instead (Easiest)

**Just use Command Prompt (cmd.exe) instead of PowerShell:**

1. Open **Command Prompt** (search "cmd" in Windows)
2. Navigate to frontend:
   ```cmd
   cd "C:\Users\ea1\OneDrive - Case-mate\Desktop\Portfolio Builder\frontend"
   ```
3. Run npm commands:
   ```cmd
   npm install
   npm run dev
   ```

Command Prompt doesn't have execution policy restrictions!

## Solution 3: Use npm.cmd Directly

In PowerShell, use the `.cmd` version instead:

```powershell
npm.cmd install
npm.cmd run dev
```

## Solution 4: Bypass for Single Session

In PowerShell, run this once per session:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

Then run your npm commands. This only affects the current PowerShell window.

---

## Recommended: Use Command Prompt

For the easiest experience, just use Command Prompt for npm commands:

**Terminal 1 - Backend (Command Prompt):**
```cmd
cd "C:\Users\ea1\OneDrive - Case-mate\Desktop\Portfolio Builder\backend"
venv\Scripts\activate.bat
python main.py
```

**Terminal 2 - Frontend (Command Prompt):**
```cmd
cd "C:\Users\ea1\OneDrive - Case-mate\Desktop\Portfolio Builder\frontend"
npm install
npm run dev
```

Command Prompt works immediately without any policy changes!

