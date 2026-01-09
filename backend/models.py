"""
Data models for stock analysis API
"""

from pydantic import BaseModel
from typing import Optional, Dict, Any, List


class FundamentalMetrics(BaseModel):
    """Fundamental analysis metrics"""
    revenue_growth_yoy: Optional[float] = None
    revenue_growth_5y_cagr: Optional[float] = None
    eps_growth: Optional[float] = None
    pe_ratio: Optional[float] = None
    forward_pe: Optional[float] = None
    peg_ratio: Optional[float] = None
    roe: Optional[float] = None
    roic: Optional[float] = None
    debt_to_equity: Optional[float] = None
    free_cash_flow: Optional[float] = None
    fcf_margin: Optional[float] = None
    current_ratio: Optional[float] = None
    profit_margin: Optional[float] = None


class ValuationMetrics(BaseModel):
    """Valuation analysis metrics"""
    current_price: Optional[float] = None
    fair_value_estimate: Optional[float] = None
    valuation_method: Optional[str] = None
    price_to_fair_value: Optional[float] = None
    historical_pe_avg: Optional[float] = None
    industry_pe_avg: Optional[float] = None
    price_vs_historical: Optional[str] = None  # "Overvalued", "Fair", "Undervalued"
    price_vs_industry: Optional[str] = None


class TechnicalMetrics(BaseModel):
    """Technical analysis metrics"""
    price_50d_ma: Optional[float] = None
    price_200d_ma: Optional[float] = None
    price_vs_50d_ma: Optional[float] = None  # Percentage
    price_vs_200d_ma: Optional[float] = None
    rsi_14: Optional[float] = None
    macd: Optional[float] = None
    macd_signal: Optional[float] = None
    macd_histogram: Optional[float] = None
    support_level: Optional[float] = None
    resistance_level: Optional[float] = None
    trend_direction: Optional[str] = None  # "Bullish", "Neutral", "Bearish"


class RiskMetrics(BaseModel):
    """Risk analysis metrics"""
    beta: Optional[float] = None
    max_drawdown_1y: Optional[float] = None
    volatility_1y: Optional[float] = None
    earnings_variability: Optional[float] = None
    debt_risk_score: Optional[float] = None  # 0-100, higher = riskier
    overall_risk_level: Optional[str] = None  # "Low", "Medium", "High"


class ScoringBreakdown(BaseModel):
    """Detailed scoring breakdown"""
    fundamentals_score: float
    valuation_score: float
    technicals_score: float
    risk_score: float
    total_score: float
    max_score: float = 100.0


class Recommendation(BaseModel):
    """Final recommendation"""
    action: str  # "Buy", "Hold", "Avoid"
    confidence: float  # 0-100
    score: float  # 0-100
    reasoning: List[str]  # List of key reasons


class StockAnalysisResponse(BaseModel):
    """Complete stock analysis response"""
    ticker: str
    company_name: Optional[str] = None
    sector: Optional[str] = None
    industry: Optional[str] = None
    fundamentals: FundamentalMetrics
    valuation: ValuationMetrics
    technicals: TechnicalMetrics
    risk: RiskMetrics
    scoring: ScoringBreakdown
    recommendation: Recommendation
    insights: List[str]  # Plain English insights
    last_updated: Optional[str] = None

