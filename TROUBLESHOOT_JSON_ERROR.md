# Troubleshooting JSON Error

## Error: "Unexpected end of JSON input"

This error means the backend returned an empty or incomplete response.

### Possible Causes:

1. **Backend crashed or timed out**
   - Check the backend terminal for error messages
   - Look for Python tracebacks or exceptions

2. **ETF/Index funds may have limited data**
   - VOO is an ETF, not a stock
   - ETFs may have different data structures
   - Try analyzing individual stocks first (AAPL, MSFT, etc.)

3. **Backend not fully started**
   - Make sure you see "Application startup complete" in backend terminal
   - Wait a few seconds after starting backend before making requests

4. **Network/timeout issues**
   - yfinance API may be slow or rate-limited
   - Try again in a few seconds

### Solutions:

#### 1. Check Backend Terminal
Look at the backend terminal window. You should see error messages there. Common errors:
- `KeyError` - Missing data field
- `AttributeError` - Wrong data structure  
- `Timeout` - yfinance took too long
- `ConnectionError` - Can't reach Yahoo Finance

#### 2. Try a Different Ticker
Start with well-known stocks:
- `AAPL` - Apple
- `MSFT` - Microsoft
- `GOOGL` - Google

Avoid for now:
- ETFs (VOO, SPY, QQQ)
- Indexes
- New IPOs

#### 3. Restart Backend
1. Stop the backend (Ctrl+C)
2. Start it again:
   ```cmd
   cd backend
   venv\Scripts\python.exe main.py
   ```
3. Wait for "Application startup complete"
4. Try analyzing again

#### 4. Check Backend Health
Test if backend is responding:
- Open: http://localhost:8000
- Should see: `{"message":"Stock Analysis API is running"}`

#### 5. Check Backend Logs
When you try to analyze, watch the backend terminal. You'll see:
- `INFO: GET /api/analyze/VOO` - Request received
- Error messages if something fails
- `INFO: 200 OK` - Success

### If Still Having Issues:

1. **Test with simple ticker first:**
   ```
   AAPL
   ```

2. **Check yfinance directly:**
   ```python
   import yfinance as yf
   stock = yf.Ticker("VOO")
   print(stock.info)
   ```

3. **Check backend version:**
   Make sure all dependencies are installed:
   ```cmd
   cd backend
   venv\Scripts\pip.exe list
   ```

4. **Try with different ticker:**
   Some stocks/ETFs may not have complete data available from Yahoo Finance.

