# Architecture Documentation

## System Overview

The Stock Analysis & Decision Support System is a full-stack web application with a Python FastAPI backend and React frontend. It provides comprehensive stock analysis by aggregating data from Yahoo Finance and applying financial analysis algorithms.

## Architecture Diagram

```
┌─────────────────┐
│   React UI      │  (Frontend - Port 3000)
│   (Tailwind)    │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│   FastAPI       │  (Backend - Port 8000)
│   REST API      │
└────────┬────────┘
         │
┌────────▼────────┐
│ Stock Analyzer  │  (Core Analysis Engine)
│   - Fundamentals│
│   - Valuation   │
│   - Technicals  │
│   - Risk        │
└────────┬────────┘
         │
┌────────▼────────┐
│  yfinance API   │  (External Data Source)
│  Yahoo Finance  │
└─────────────────┘
```

## Backend Architecture

### Components

#### 1. `main.py` - FastAPI Application
- **Purpose**: API server and routing
- **Responsibilities**:
  - CORS middleware configuration
  - API endpoint definitions
  - Request/response handling
  - Error handling

**Key Endpoints:**
- `GET /` - Health check
- `GET /api/analyze/{ticker}` - Main analysis endpoint

#### 2. `models.py` - Data Models
- **Purpose**: Pydantic models for type safety and validation
- **Models**:
  - `FundamentalMetrics`: Financial ratios and growth metrics
  - `ValuationMetrics`: Price and valuation comparisons
  - `TechnicalMetrics`: Technical indicators
  - `RiskMetrics`: Risk assessment metrics
  - `ScoringBreakdown`: Score components
  - `Recommendation`: Final recommendation with reasoning
  - `StockAnalysisResponse`: Complete analysis response

#### 3. `stock_analyzer.py` - Core Analysis Engine
- **Purpose**: Performs all stock analysis calculations
- **Key Methods**:
  - `analyze()`: Main entry point
  - `_analyze_fundamentals()`: Revenue, EPS, ratios, FCF
  - `_analyze_valuation()`: Fair value, P/E comparisons
  - `_analyze_technicals()`: MA, RSI, MACD, trend
  - `_analyze_risk()`: Beta, drawdown, volatility, debt risk
  - `_calculate_scores()`: Weighted scoring algorithm
  - `_generate_recommendation()`: Buy/Hold/Avoid decision
  - `_generate_insights()`: Plain English summaries

### Data Flow

1. **Request**: User enters ticker → Frontend → FastAPI endpoint
2. **Data Fetching**: StockAnalyzer → yfinance → Stock info + Historical data
3. **Analysis**: Multiple analysis methods process data
4. **Scoring**: Weighted algorithm calculates scores
5. **Recommendation**: Decision logic generates recommendation
6. **Response**: Structured JSON → Frontend → UI rendering

## Frontend Architecture

### Component Hierarchy

```
App
├── StockSearch
├── LoadingSpinner
└── StockDashboard
    ├── RecommendationCard
    ├── ScoreBreakdown
    ├── InsightsCard
    ├── FundamentalsCard
    ├── ValuationCard
    ├── TechnicalsCard
    └── RiskCard
```

### Key Components

#### 1. `App.jsx`
- **Purpose**: Main application container
- **State Management**: 
  - `analysis`: Current stock analysis data
  - `loading`: Loading state
  - `error`: Error messages
- **Functions**:
  - `handleAnalyze()`: Fetches analysis from API

#### 2. `StockSearch.jsx`
- **Purpose**: Ticker input form
- **Features**: Form validation, ticker normalization

#### 3. `StockDashboard.jsx`
- **Purpose**: Main analysis display
- **Layout**: Grid-based responsive layout
- **Sections**: All analysis cards

#### 4. Analysis Cards
Each card displays a specific category:
- **RecommendationCard**: Buy/Hold/Avoid with confidence
- **ScoreBreakdown**: Visual score breakdown with progress bars
- **FundamentalsCard**: Financial metrics grid
- **ValuationCard**: Price and valuation metrics
- **TechnicalsCard**: Technical indicators
- **RiskCard**: Risk metrics and levels
- **InsightsCard**: Plain English insights

## Scoring Algorithm

### Weight Distribution

```
Total Score (100 points)
├── Fundamentals: 40 points
│   ├── Revenue Growth: 15 pts
│   ├── EPS Growth: 10 pts
│   ├── ROE: 8 pts
│   └── FCF Margin: 7 pts
│
├── Valuation: 30 points
│   ├── Price to Fair Value: 20 pts
│   └── P/E Comparison: 10 pts
│
├── Technicals: 20 points
│   ├── Trend Direction: 10 pts
│   ├── RSI: 5 pts
│   └── Price vs MAs: 5 pts
│
└── Risk: 10 points (inverted)
    └── Lower risk = Higher score
```

### Recommendation Logic

```python
if score >= 70:
    action = "Buy"
    confidence = 60 + (score - 70) * 1.5  # 60-90%
elif score >= 50:
    action = "Hold"
    confidence = 50 + (score - 50) * 1.0  # 50-69%
else:
    action = "Avoid"
    confidence = 50 - (50 - score) * 0.8  # 30-50%
```

## Data Sources

### Yahoo Finance (yfinance)
- **Stock Info**: Company details, financials, ratios
- **Historical Data**: Price history, volume
- **Financial Statements**: Income statement, balance sheet, cash flow

### Limitations
- Free tier has rate limits
- Data may have delays
- Some metrics may be unavailable for certain stocks

## Security Considerations

1. **Input Validation**: Ticker symbols validated and sanitized
2. **Error Handling**: Graceful error messages, no sensitive data exposure
3. **CORS**: Configured for development (restrict in production)
4. **Rate Limiting**: Not implemented (add in production)

## Performance Considerations

1. **Caching**: Not implemented (consider Redis for production)
2. **Async Operations**: FastAPI async endpoints
3. **Data Processing**: Efficient pandas operations
4. **Frontend**: React optimizations, component memoization possible

## Scalability

### Current Limitations
- Single-threaded analysis
- No caching
- No database
- No user sessions

### Production Enhancements
- Add Redis for caching
- Database for user preferences
- Background job queue for heavy analysis
- CDN for static assets
- Load balancing for API
- Rate limiting per user/IP

## Testing Strategy

### Recommended Tests
1. **Unit Tests**: Individual analysis functions
2. **Integration Tests**: API endpoints
3. **E2E Tests**: Full user flows
4. **Data Validation**: Edge cases (missing data, invalid tickers)

## Deployment

### Backend
- **Platform**: Any Python hosting (Heroku, AWS, DigitalOcean)
- **Requirements**: Python 3.8+, pip
- **Environment**: Set production CORS origins

### Frontend
- **Platform**: Vercel, Netlify, AWS S3+CloudFront
- **Build**: `npm run build`
- **Configuration**: Update API URL in production

## Future Enhancements

1. **Database**: PostgreSQL for user data, favorites
2. **Authentication**: User accounts, saved analyses
3. **Real-time Updates**: WebSocket for live prices
4. **Advanced Charts**: Plotly integration
5. **Export**: PDF/Excel generation
6. **Comparisons**: Multi-stock side-by-side
7. **Alerts**: Price target notifications

## Code Quality

### Backend
- Type hints with Pydantic
- Clear function documentation
- Error handling
- Modular design

### Frontend
- Component-based architecture
- Reusable components
- Responsive design
- Accessible UI

## Maintenance

### Regular Updates
- Update dependencies quarterly
- Monitor yfinance API changes
- Review scoring algorithm effectiveness
- Update financial thresholds based on market conditions

### Monitoring
- API response times
- Error rates
- Data availability
- User feedback

