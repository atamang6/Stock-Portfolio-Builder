# Fix Pydantic Installation Error

## The Problem

`pydantic-core` is trying to compile from source, which requires Rust. This happens because:
- Python 3.14 is very new
- Some older package versions don't have pre-built wheels for Python 3.14

## Solution: Install Latest Versions

Install packages without strict version pins to get versions with pre-built wheels:

### In PowerShell (you're already in backend folder):

```powershell
# Make sure venv is activated
venv\Scripts\activate.bat

# Upgrade pip
python -m pip install --upgrade pip

# Install packages (let pip choose compatible versions with pre-built wheels)
python -m pip install fastapi uvicorn[standard] python-multipart yfinance python-dotenv httpx --upgrade

# Install pandas, numpy, scipy
python -m pip install pandas numpy scipy --upgrade

# Install ta
python -m pip install ta --upgrade

# Install pydantic (latest version should have wheels for Python 3.14)
python -m pip install "pydantic>=2.5.0" --upgrade
```

---

## Or Use the Batch File

Double-click `backend/install_deps_simple.bat` - it will install everything automatically!

---

## After Installation

Once all packages install successfully:

```powershell
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## Alternative: Use Python 3.11 or 3.12

If issues persist, Python 3.14 is very new. Consider using Python 3.11 or 3.12 which have better package support:

1. Install Python 3.12 from python.org
2. Create a new venv: `python3.12 -m venv venv`
3. Install dependencies again

But try the latest versions first - they should work!

