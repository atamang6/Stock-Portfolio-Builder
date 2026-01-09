# Quick Start Guide

Get the Stock Analysis app running in 5 minutes!

## Step 1: Backend Setup

Open a terminal and run:

```bash
# Navigate to backend
cd backend

# Create virtual environment (Windows)
python -m venv venv
venv\Scripts\activate

# Create virtual environment (Mac/Linux)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

You should see: `Uvicorn running on http://0.0.0.0:8000`

## Step 2: Frontend Setup

Open a **new terminal** and run:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

You should see: `Local: http://localhost:3000`

## Step 3: Use the App

1. Open your browser to `http://localhost:3000`
2. Enter a stock ticker (e.g., `AAPL`, `MSFT`, `GOOGL`)
3. Click "Analyze Stock"
4. Review the comprehensive analysis!

## Troubleshooting

### Backend Issues

- **Port 8000 already in use**: Change the port in `backend/main.py` (last line)
- **Module not found**: Make sure virtual environment is activated and dependencies are installed
- **yfinance errors**: Check your internet connection; yfinance requires internet access

### Frontend Issues

- **Port 3000 already in use**: Vite will automatically use the next available port
- **npm install fails**: Try `npm install --legacy-peer-deps`
- **API connection error**: Make sure backend is running on port 8000

## Example Tickers to Try

- **AAPL** - Apple Inc.
- **MSFT** - Microsoft Corporation
- **GOOGL** - Alphabet Inc.
- **TSLA** - Tesla, Inc.
- **AMZN** - Amazon.com Inc.
- **NVDA** - NVIDIA Corporation

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the code to understand the analysis algorithms
- Customize the scoring weights in `backend/stock_analyzer.py`

Happy analyzing! 📈

