# Node.js PATH Configuration

## Where Should Node.js Be in PATH?

### Default Installation Location
Node.js typically installs to:
```
C:\Program Files\nodejs\
```

### Check if Node.js is in PATH

**Method 1: Check in PowerShell**
```powershell
$env:PATH -split ';' | Select-String node
```
If you see a line with `nodejs` in it, it's in PATH!

**Method 2: Check if Node.js works**
```powershell
node --version
npm --version
```
If these show version numbers, Node.js is in PATH ✅

---

## How to Add Node.js to PATH (If Missing)

### Option 1: Reinstall Node.js (Easiest)
1. Download Node.js from https://nodejs.org/
2. Run the installer
3. **IMPORTANT**: Check the box that says **"Add to PATH"** or **"Automatically install the necessary tools"**
4. Complete installation
5. **Restart your computer** (or at least close and reopen all terminals)

### Option 2: Manually Add to PATH

1. **Find Node.js Installation Location**
   - Usually: `C:\Program Files\nodejs\`
   - Or: `C:\Users\YourUsername\AppData\Roaming\npm` (for npm)
   - Check if these folders exist:
     ```powershell
     Test-Path "C:\Program Files\nodejs\node.exe"
     Test-Path "C:\Program Files\nodejs\npm.cmd"
     ```

2. **Add to PATH via Windows Settings**
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Click "Advanced" tab → "Environment Variables"
   - Under "User variables" or "System variables", find "Path"
   - Click "Edit"
   - Click "New"
   - Add: `C:\Program Files\nodejs\`
   - Click "OK" on all windows
   - **Restart your terminal** (close and reopen PowerShell)

3. **Add to PATH via PowerShell (Temporary)**
   ```powershell
   $env:PATH += ";C:\Program Files\nodejs\"
   ```
   This only works for the current PowerShell session. Use Option 2 for permanent fix.

---

## Verify PATH is Set Correctly

After adding to PATH, **close and reopen PowerShell**, then run:

```powershell
# Check PATH contains nodejs
$env:PATH -split ';' | Select-String node

# Should show something like:
# C:\Program Files\nodejs\

# Then verify commands work
node --version
npm --version
```

---

## Quick Test Script

Run this in PowerShell to check everything:

```powershell
Write-Host "Checking Node.js installation..." -ForegroundColor Cyan

# Check if node.exe exists in common locations
$nodePaths = @(
    "C:\Program Files\nodejs\node.exe",
    "C:\Program Files (x86)\nodejs\node.exe",
    "$env:APPDATA\npm\node.exe"
)

$found = $false
foreach ($path in $nodePaths) {
    if (Test-Path $path) {
        Write-Host "[FOUND] Node.js at: $path" -ForegroundColor Green
        $found = $true
        break
    }
}

if (-not $found) {
    Write-Host "[NOT FOUND] Node.js not found in common locations" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
}

# Check if in PATH
Write-Host "`nChecking PATH..." -ForegroundColor Cyan
$pathEntries = $env:PATH -split ';'
$nodeInPath = $pathEntries | Where-Object { $_ -like '*nodejs*' }

if ($nodeInPath) {
    Write-Host "[OK] Node.js found in PATH:" -ForegroundColor Green
    $nodeInPath | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
} else {
    Write-Host "[NOT FOUND] Node.js not in PATH" -ForegroundColor Red
    Write-Host "Add this to PATH: C:\Program Files\nodejs\" -ForegroundColor Yellow
}

# Try to run node
Write-Host "`nTesting 'node' command..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version 2>&1
    Write-Host "[OK] Node.js works! Version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] 'node' command not found" -ForegroundColor Red
    Write-Host "You may need to:" -ForegroundColor Yellow
    Write-Host "  1. Install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "  2. Add it to PATH (see instructions above)" -ForegroundColor Yellow
    Write-Host "  3. Restart your terminal" -ForegroundColor Yellow
}
```

---

## Most Common Issue

**Problem**: Node.js is installed but not in PATH

**Solution**: 
1. Reinstall Node.js and make sure "Add to PATH" is checked
2. OR manually add `C:\Program Files\nodejs\` to your PATH
3. **Always restart your terminal** after changing PATH

