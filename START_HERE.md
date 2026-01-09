# 🚀 START HERE - Quick Setup Guide

## ⚠️ IMPORTANT: You Need TWO Terminals Running!

This app requires **both** the backend AND frontend servers to be running at the same time.

---

## Step 1: Start the Backend Server

### Option A: Using Command Line (Recommended)

1. **Open Terminal/Command Prompt #1**
2. Navigate to backend folder:
   ```bash
   cd backend
   ```
3. Create virtual environment (if not done already):
   ```bash
   python -m venv venv
   ```
4. Activate virtual environment:
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```
5. Install dependencies (if not done already):
   ```bash
   pip install -r requirements.txt
   ```
6. Start the backend server:
   ```bash
   python main.py
   ```

**✅ Success looks like:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**⚠️ KEEP THIS TERMINAL OPEN!** The server must keep running.

### Option B: Using the Script (Windows)

1. Double-click `backend/start_server.bat`
2. Make sure virtual environment is activated first!

---

## Step 2: Start the Frontend Server

### Option A: Using Command Line (Recommended)

1. **Open a NEW Terminal/Command Prompt #2** (keep backend terminal open!)
2. Navigate to frontend folder:
   ```bash
   cd frontend
   ```
3. Install dependencies (if not done already):
   ```bash
   npm install
   ```
4. Start the frontend server:
   ```bash
   npm run dev
   ```

**✅ Success looks like:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**⚠️ KEEP THIS TERMINAL OPEN TOO!** The frontend server must keep running.

### Option B: Using the Script (Windows)

1. Double-click `frontend/start_frontend.bat`

---

## Step 3: Open the App

1. Open your web browser
2. Go to: **http://localhost:3000**
3. You should see the Stock Analysis interface!

---

## ✅ Verification Checklist

Before using the app, verify:

- [ ] Backend terminal shows "Uvicorn running on http://0.0.0.0:8000"
- [ ] Frontend terminal shows "Local: http://localhost:3000/"
- [ ] Browser can access http://localhost:3000 (you see the search page)
- [ ] Browser can access http://localhost:8000 (you see `{"message":"Stock Analysis API is running"}`)

---

## 🐛 Common Issues

### "ERR_CONNECTION_REFUSED" on Frontend
- **Problem**: Frontend server not running
- **Solution**: Start frontend with `npm run dev` in the `frontend` folder

### "ERR_CONNECTION_REFUSED" on Backend API calls
- **Problem**: Backend server not running
- **Solution**: Start backend with `python main.py` in the `backend` folder

### "Module not found" errors
- **Backend**: Run `pip install -r requirements.txt` in `backend` folder
- **Frontend**: Run `npm install` in `frontend` folder

### Port already in use
- **Backend (8000)**: Close other apps using port 8000, or change port in `backend/main.py`
- **Frontend (3000)**: Vite will auto-use next port (3001, 3002, etc.)

---

## 📝 Quick Reference

**Terminal 1 (Backend):**
```bash
cd backend
venv\Scripts\activate    # Windows
# OR
source venv/bin/activate # Mac/Linux
python main.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

**Browser:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

---

## 🆘 Still Not Working?

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed help!

