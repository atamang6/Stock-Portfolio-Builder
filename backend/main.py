"""
Stock Analysis API - FastAPI Backend
Provides comprehensive stock analysis including fundamentals, valuation, technicals, and risk metrics
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
import uvicorn

from stock_analyzer import StockAnalyzer
from stock_screener import StockScreener
from daily_stock_picker import DailyStockPicker
from models import StockAnalysisResponse

app = FastAPI(
    title="Stock Analysis API",
    description="Comprehensive stock analysis and decision support system",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize stock analyzer, screener, and daily picker
analyzer = StockAnalyzer()
screener = StockScreener()
daily_picker = DailyStockPicker()


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Stock Analysis API is running"}


@app.get("/api/analyze/{ticker}")
async def analyze_stock(ticker: str):
    """
    Analyze a stock by ticker symbol
    
    Args:
        ticker: Stock ticker symbol (e.g., AAPL, MSFT)
    
    Returns:
        Comprehensive stock analysis including fundamentals, valuation, technicals, and recommendation
    """
    try:
        ticker = ticker.upper().strip()
        analysis = analyzer.analyze(ticker)
        return analysis
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        import traceback
        error_detail = f"Error analyzing {ticker}: {str(e)}"
        print(f"Backend Error: {error_detail}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=error_detail)


@app.get("/api/search/{query}")
async def search_stocks(query: str):
    """
    Search for stocks by ticker or company name
    Note: This is a simplified version. In production, use a proper stock search API.
    """
    # This would typically connect to a stock search service
    # For now, return a simple response
    return {
        "query": query,
        "results": [],
        "message": "Stock search feature - implement with proper API in production"
    }


class ScreenRequest(BaseModel):
    tickers: List[str]
    top_n: int = 10


@app.post("/api/screen")
async def screen_stocks(request: ScreenRequest):
    """
    Screen and rank multiple stocks
    
    Args:
        request: ScreenRequest with tickers list and top_n
    
    Returns:
        Ranked list of stocks with scores and recommendations
    """
    try:
        if not request.tickers:
            raise HTTPException(status_code=400, detail="No tickers provided")
        
        if len(request.tickers) > 50:
            raise HTTPException(status_code=400, detail="Maximum 50 tickers allowed per request")
        
        results = screener.screen_stocks(request.tickers, request.top_n)
        
        return {
            "date": datetime.now().isoformat(),
            "total_analyzed": len(request.tickers),
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error screening stocks: {str(e)}")


@app.get("/api/daily-picks")
async def get_daily_picks():
    """
    Get daily top 10 stock picks with detailed reasoning
    
    Returns:
        Top 10 stocks with comprehensive analysis and buy/avoid reasoning
    """
    try:
        results = daily_picker.analyze_and_rank(top_n=10)
        
        return {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "generated_at": datetime.now().isoformat(),
            "total_analyzed": len(daily_picker.get_top_stocks_list()),
            "results": results
        }
    except Exception as e:
        import traceback
        error_detail = f"Error generating daily picks: {str(e)}"
        print(f"Backend Error: {error_detail}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=error_detail)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

