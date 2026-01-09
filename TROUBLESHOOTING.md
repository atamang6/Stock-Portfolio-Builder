# Troubleshooting Guide

## Common Issues and Solutions

### ❌ Error: "localhost refused to connect" or "ERR_CONNECTION_REFUSED"

**Problem**: The backend server is not running.

**Solution**:
1. Open a terminal/command prompt
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Activate your virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Start the backend server:
   ```bash
   python main.py
   ```
5. You should see: `Uvicorn running on http://0.0.0.0:8000`
6. Keep this terminal open - the server must stay running!

### ❌ Error: "Failed to fetch" or Network Error

**Problem**: Backend is running but frontend can't connect.

**Solutions**:
1. **Check backend is running**: Open `http://localhost:8000` in your browser. You should see: `{"message":"Stock Analysis API is running"}`
2. **Check ports**: Backend should be on port 8000, frontend on port 3000
3. **Check CORS**: Make sure backend CORS settings include your frontend URL
4. **Firewall**: Temporarily disable firewall to test if it's blocking connections

### ❌ Error: "ModuleNotFoundError" in Backend

**Problem**: Python dependencies not installed.

**Solution**:
```bash
cd backend
# Activate virtual environment first
pip install -r requirements.txt
```

### ❌ Error: "Cannot find module" in Frontend

**Problem**: Node modules not installed.

**Solution**:
```bash
cd frontend
npm install
```

### ❌ Error: Port Already in Use

**Problem**: Another application is using port 8000 or 3000.

**Solutions**:

**Backend (port 8000)**:
- Find and close the process using port 8000
- Windows: `netstat -ano | findstr :8000` then `taskkill /PID <pid> /F`
- Mac/Linux: `lsof -ti:8000 | xargs kill`
- Or change port in `backend/main.py` (last line)

**Frontend (port 3000)**:
- Vite will automatically use the next available port (3001, 3002, etc.)
- Or change in `frontend/vite.config.js`

### ❌ Error: "Invalid ticker symbol"

**Problem**: The ticker doesn't exist or yfinance can't fetch data.

**Solutions**:
1. Verify the ticker symbol is correct (e.g., AAPL, not APPLE)
2. Check your internet connection
3. Try a different ticker (MSFT, GOOGL, TSLA)
4. Some stocks may have limited data availability

### ❌ Error: yfinance Timeout

**Problem**: Yahoo Finance API is slow or unavailable.

**Solutions**:
1. Wait a few seconds and try again
2. Check your internet connection
3. Try a different ticker
4. The free yfinance API has rate limits - wait between requests

### ✅ Quick Health Check

Test if everything is working:

1. **Backend Health Check**:
   - Open browser: `http://localhost:8000`
   - Should see: `{"message":"Stock Analysis API is running"}`

2. **Backend API Test**:
   - Open browser: `http://localhost:8000/api/analyze/AAPL`
   - Should see JSON response with stock analysis (may take 10-30 seconds)

3. **Frontend**:
   - Open browser: `http://localhost:3000`
   - Should see the search interface
   - Enter "AAPL" and click "Analyze Stock"

### 🔍 Debugging Steps

1. **Check Backend Logs**: Look at the terminal where backend is running for error messages
2. **Check Browser Console**: Press F12 → Console tab for frontend errors
3. **Check Network Tab**: Press F12 → Network tab to see API requests
4. **Verify URLs**: Make sure frontend is calling `http://localhost:8000/api/analyze/{ticker}`

### 📝 Step-by-Step Startup Checklist

- [ ] Backend virtual environment created and activated
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Backend server running (`python main.py`)
- [ ] Backend health check works (`http://localhost:8000`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend server running (`npm run dev`)
- [ ] Frontend loads (`http://localhost:3000`)
- [ ] Can search and analyze a stock

### 🆘 Still Having Issues?

1. **Restart Everything**:
   - Close all terminals
   - Restart backend
   - Restart frontend
   - Clear browser cache (Ctrl+Shift+Delete)

2. **Check Python Version**:
   ```bash
   python --version  # Should be 3.8 or higher
   ```

3. **Check Node Version**:
   ```bash
   node --version  # Should be 16 or higher
   ```

4. **Reinstall Dependencies**:
   ```bash
   # Backend
   cd backend
   pip install --upgrade -r requirements.txt
   
   # Frontend
   cd frontend
   rm -rf node_modules
   npm install
   ```

