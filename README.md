# Stock Analysis & Decision Support System

A comprehensive web application for analyzing stocks and making informed investment decisions. This tool provides fundamental analysis, valuation metrics, technical indicators, and risk assessment to help users decide whether to Buy, Hold, or Avoid a stock.

## Features

### Core Functionality

- **Stock Search**: Search by ticker symbol (NYSE & NASDAQ)
- **Fundamental Analysis**: 
  - Revenue growth (YoY & 5-year CAGR)
  - EPS growth
  - P/E, Forward P/E, PEG ratios
  - ROE, ROIC
  - Debt-to-Equity
  - Free Cash Flow & FCF margin
  - Current ratio, Profit margin

- **Valuation Analysis**:
  - Current price vs fair value estimate
  - Historical P/E comparison
  - Industry P/E comparison
  - DCF-based valuation

- **Technical Analysis**:
  - Moving averages (50D, 200D)
  - RSI (14-period)
  - MACD
  - Support & resistance levels
  - Trend direction (Bullish/Neutral/Bearish)

- **Risk Analysis**:
  - Beta (volatility measure)
  - Max drawdown (1-year)
  - Earnings variability
  - Debt risk score
  - Overall risk level

- **Scoring & Recommendation**:
  - Weighted scoring system (0-100)
    - Fundamentals: 40%
    - Valuation: 30%
    - Technicals: 20%
    - Risk: 10%
  - Clear recommendations: ✅ Buy, ⚠️ Hold, ❌ Avoid
  - Confidence percentage
  - Plain English insights

## Tech Stack

### Backend
- **Python 3.8+**
- **FastAPI**: Modern, fast web framework
- **yfinance**: Yahoo Finance data fetching
- **pandas, numpy**: Data processing
- **ta**: Technical analysis library
- **scipy**: Statistical calculations

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Axios**: HTTP client

## Project Structure

```
Portfolio Builder/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── stock_analyzer.py    # Core analysis engine
│   ├── models.py            # Pydantic data models
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json         # Node dependencies
│   └── vite.config.js       # Vite configuration
└── README.md
```

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 16+ and npm
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the FastAPI server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### GET `/api/analyze/{ticker}`
Analyzes a stock by ticker symbol.

**Parameters:**
- `ticker` (path): Stock ticker symbol (e.g., AAPL, MSFT)

**Response:**
Returns comprehensive stock analysis including fundamentals, valuation, technicals, risk metrics, scoring, and recommendation.

**Example:**
```bash
curl http://localhost:8000/api/analyze/AAPL
```

### GET `/`
Health check endpoint.

## Usage

1. Start both backend and frontend servers
2. Open your browser to `http://localhost:3000`
3. Enter a stock ticker symbol (e.g., AAPL, MSFT, GOOGL)
4. Click "Analyze Stock"
5. Review the comprehensive analysis and recommendation

## Scoring Algorithm

The scoring system uses weighted categories:

- **Fundamentals (40%)**: Revenue growth, EPS growth, ROE, FCF margin
- **Valuation (30%)**: Price to fair value, P/E comparisons
- **Technicals (20%)**: Trend direction, RSI, moving averages
- **Risk (10%)**: Debt risk, beta, volatility (inverted - lower risk = higher score)

**Recommendation Thresholds:**
- Score ≥ 70: ✅ **Buy** (Confidence: 60-90%)
- Score 50-69: ⚠️ **Hold** (Confidence: 50-69%)
- Score < 50: ❌ **Avoid** (Confidence: 30-50%)

## Financial Reasoning

### Fundamental Analysis
- **Revenue Growth**: Indicates business expansion and market share gains
- **EPS Growth**: Shows profitability improvement
- **P/E Ratio**: Price relative to earnings (lower = potentially undervalued)
- **PEG Ratio**: P/E adjusted for growth (ideal < 1.5)
- **ROE/ROIC**: Return on capital efficiency (higher = better)
- **Debt-to-Equity**: Financial leverage risk (lower = safer)
- **FCF Margin**: Cash generation ability (higher = better)

### Valuation Analysis
- **Fair Value**: Estimated using earnings-based approach with growth adjustment
- **Historical Comparison**: Current P/E vs historical average
- **Industry Comparison**: Relative valuation within sector

### Technical Analysis
- **Moving Averages**: Trend identification (price above MAs = bullish)
- **RSI**: Momentum indicator (30-70 = healthy range)
- **MACD**: Trend-following momentum indicator
- **Support/Resistance**: Key price levels

### Risk Assessment
- **Beta**: Market correlation and volatility (1.0 = market average)
- **Drawdown**: Maximum peak-to-trough decline
- **Earnings Variability**: Consistency of profitability
- **Debt Risk**: Financial stability assessment

## Limitations & Disclaimers

⚠️ **Important**: This tool is for informational and educational purposes only. It does not constitute financial, investment, or trading advice. Always:

- Conduct your own research
- Consult with qualified financial advisors
- Consider your risk tolerance and investment goals
- Understand that past performance doesn't guarantee future results
- Be aware that stock markets are volatile and unpredictable

The analysis is based on publicly available data and may contain inaccuracies. The scoring algorithm is a simplified model and should not be the sole basis for investment decisions.

## Future Enhancements

Potential features for future versions:

- [ ] Compare multiple stocks side-by-side
- [ ] Long-term investor vs short-term trader mode
- [ ] Save favorite stocks
- [ ] Export analysis to Excel or PDF
- [ ] Historical analysis tracking
- [ ] Portfolio analysis
- [ ] Real-time price updates
- [ ] Advanced charting with Plotly
- [ ] Email alerts for price targets
- [ ] Integration with brokerage APIs

## Contributing

This is a portfolio project. Contributions and suggestions are welcome!

## License

This project is for educational purposes. Use at your own risk.

## Support

For issues or questions, please review the code comments and documentation. The codebase includes detailed explanations of financial calculations and reasoning.

Navigate to Portfolio Builder\backend"
Run Following command to Run backend - venv\Scripts\activate.bat
python main.py



Navigate to \Portfolio Builder\frontend> npm run dev



