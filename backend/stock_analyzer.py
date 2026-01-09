"""
Stock Analyzer - Core analysis engine
Performs comprehensive stock analysis including fundamentals, valuation, technicals, and risk
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, Optional, Tuple
import ta
from scipy import stats

from models import (
    StockAnalysisResponse,
    FundamentalMetrics,
    ValuationMetrics,
    TechnicalMetrics,
    RiskMetrics,
    ScoringBreakdown,
    Recommendation
)


class StockAnalyzer:
    """Main stock analysis engine"""
    
    def __init__(self):
        self.lookback_years = 5
        self.lookback_days = 252  # Trading days in a year
    
    def analyze(self, ticker: str) -> StockAnalysisResponse:
        """
        Perform comprehensive stock analysis
        
        Args:
            ticker: Stock ticker symbol
            
        Returns:
            Complete stock analysis response
        """
        try:
            # Fetch stock data
            stock = yf.Ticker(ticker)
            info = stock.info
            
            # Validate ticker
            if not info or 'symbol' not in info:
                raise ValueError(f"Invalid ticker symbol: {ticker}")
            
            # Get historical data
            hist = stock.history(period="2y")
            if hist.empty:
                raise ValueError(f"No historical data available for {ticker}")
            
            # Perform analyses
            fundamentals = self._analyze_fundamentals(stock, info)
            valuation = self._analyze_valuation(stock, info, hist)
            technicals = self._analyze_technicals(hist)
            risk = self._analyze_risk(stock, hist, info)
            
            # Calculate scores and recommendation
            scoring = self._calculate_scores(fundamentals, valuation, technicals, risk)
            recommendation = self._generate_recommendation(scoring, fundamentals, valuation, technicals, risk)
            insights = self._generate_insights(fundamentals, valuation, technicals, risk, scoring)
            
            return StockAnalysisResponse(
                ticker=ticker,
                company_name=info.get('longName', ticker),
                sector=info.get('sector'),
                industry=info.get('industry'),
                fundamentals=fundamentals,
                valuation=valuation,
                technicals=technicals,
                risk=risk,
                scoring=scoring,
                recommendation=recommendation,
                insights=insights,
                last_updated=datetime.now().isoformat()
            )
            
        except Exception as e:
            raise ValueError(f"Error analyzing {ticker}: {str(e)}")
    
    def _analyze_fundamentals(self, stock: yf.Ticker, info: Dict) -> FundamentalMetrics:
        """Analyze fundamental metrics"""
        
        # Get financials
        financials = stock.financials
        balance_sheet = stock.balance_sheet
        cashflow = stock.cashflow
        
        # Revenue growth
        revenue_growth_yoy = None
        revenue_growth_5y_cagr = None
        
        if not financials.empty and 'Total Revenue' in financials.index:
            revenues = financials.loc['Total Revenue'].dropna()
            if len(revenues) >= 2:
                revenue_growth_yoy = ((revenues.iloc[0] - revenues.iloc[1]) / abs(revenues.iloc[1])) * 100
            if len(revenues) >= 5:
                # Calculate 5-year CAGR
                first_rev = revenues.iloc[-1]
                last_rev = revenues.iloc[0]
                if first_rev > 0:
                    revenue_growth_5y_cagr = ((last_rev / first_rev) ** (1/5) - 1) * 100
        
        # EPS growth
        eps_growth = None
        if 'earningsQuarterlyGrowth' in info and info['earningsQuarterlyGrowth']:
            eps_growth = info['earningsQuarterlyGrowth'] * 100
        
        # P/E ratios
        pe_ratio = info.get('trailingPE')
        forward_pe = info.get('forwardPE')
        
        # PEG ratio
        peg_ratio = info.get('pegRatio')
        
        # ROE and ROIC
        roe = info.get('returnOnEquity')
        if roe:
            roe = roe * 100
        
        roic = info.get('returnOnInvestedCapital')
        if roic:
            roic = roic * 100
        
        # Debt-to-Equity
        debt_to_equity = info.get('debtToEquity')
        
        # Free Cash Flow
        free_cash_flow = None
        fcf_margin = None
        
        if not cashflow.empty:
            if 'Free Cash Flow' in cashflow.index:
                free_cash_flow = cashflow.loc['Free Cash Flow'].iloc[0]
            elif 'Operating Cash Flow' in cashflow.index and 'Capital Expenditure' in cashflow.index:
                ocf = cashflow.loc['Operating Cash Flow'].iloc[0]
                capex = abs(cashflow.loc['Capital Expenditure'].iloc[0])
                free_cash_flow = ocf - capex
            
            # FCF Margin
            if free_cash_flow and not financials.empty and 'Total Revenue' in financials.index:
                revenue = financials.loc['Total Revenue'].iloc[0]
                if revenue > 0:
                    fcf_margin = (free_cash_flow / revenue) * 100
        
        # Current Ratio
        current_ratio = info.get('currentRatio')
        
        # Profit Margin
        profit_margin = info.get('profitMargins')
        if profit_margin:
            profit_margin = profit_margin * 100
        
        return FundamentalMetrics(
            revenue_growth_yoy=revenue_growth_yoy,
            revenue_growth_5y_cagr=revenue_growth_5y_cagr,
            eps_growth=eps_growth,
            pe_ratio=pe_ratio,
            forward_pe=forward_pe,
            peg_ratio=peg_ratio,
            roe=roe,
            roic=roic,
            debt_to_equity=debt_to_equity,
            free_cash_flow=free_cash_flow,
            fcf_margin=fcf_margin,
            current_ratio=current_ratio,
            profit_margin=profit_margin
        )
    
    def _analyze_valuation(self, stock: yf.Ticker, info: Dict, hist: pd.DataFrame) -> ValuationMetrics:
        """Analyze valuation metrics"""
        
        current_price = hist['Close'].iloc[-1]
        
        # Historical P/E average
        historical_pe_avg = None
        if 'trailingPE' in info and info['trailingPE']:
            # Use current P/E as proxy (in production, fetch historical P/E data)
            historical_pe_avg = info['trailingPE']
        
        # Industry P/E (from info)
        industry_pe_avg = info.get('industryTrailingPE')
        
        # Fair value estimate using DCF-like approach
        fair_value_estimate = None
        valuation_method = None
        
        # Simple DCF approximation using earnings and growth
        if 'trailingEps' in info and info['trailingEps'] and 'earningsQuarterlyGrowth' in info:
            eps = info['trailingEps']
            growth = info.get('earningsQuarterlyGrowth', 0)
            pe_ratio = info.get('trailingPE', 15)
            
            if eps > 0:
                # Simple fair value = EPS * reasonable P/E
                # Adjust P/E based on growth
                adjusted_pe = pe_ratio
                if growth:
                    # Growth-adjusted P/E
                    adjusted_pe = min(pe_ratio * (1 + growth), 30)  # Cap at 30
                
                fair_value_estimate = eps * adjusted_pe
                valuation_method = "Earnings-based with growth adjustment"
        
        # Price to fair value ratio
        price_to_fair_value = None
        if fair_value_estimate and fair_value_estimate > 0:
            price_to_fair_value = current_price / fair_value_estimate
        
        # Compare to historical
        price_vs_historical = None
        if historical_pe_avg and info.get('trailingPE'):
            current_pe = info['trailingPE']
            if current_pe > historical_pe_avg * 1.2:
                price_vs_historical = "Overvalued"
            elif current_pe < historical_pe_avg * 0.8:
                price_vs_historical = "Undervalued"
            else:
                price_vs_historical = "Fair"
        
        # Compare to industry
        price_vs_industry = None
        if industry_pe_avg and info.get('trailingPE'):
            current_pe = info['trailingPE']
            if current_pe > industry_pe_avg * 1.2:
                price_vs_industry = "Overvalued"
            elif current_pe < industry_pe_avg * 0.8:
                price_vs_industry = "Undervalued"
            else:
                price_vs_industry = "Fair"
        
        return ValuationMetrics(
            current_price=float(current_price),
            fair_value_estimate=fair_value_estimate,
            valuation_method=valuation_method,
            price_to_fair_value=price_to_fair_value,
            historical_pe_avg=historical_pe_avg,
            industry_pe_avg=industry_pe_avg,
            price_vs_historical=price_vs_historical,
            price_vs_industry=price_vs_industry
        )
    
    def _analyze_technicals(self, hist: pd.DataFrame) -> TechnicalMetrics:
        """Analyze technical indicators"""
        
        if hist.empty or len(hist) < 200:
            return TechnicalMetrics()
        
        current_price = hist['Close'].iloc[-1]
        
        # Moving averages
        ma_50 = hist['Close'].rolling(window=50).mean().iloc[-1]
        ma_200 = hist['Close'].rolling(window=200).mean().iloc[-1]
        
        price_vs_50d_ma = ((current_price - ma_50) / ma_50) * 100
        price_vs_200d_ma = ((current_price - ma_200) / ma_200) * 100
        
        # RSI
        rsi = ta.momentum.RSIIndicator(close=hist['Close'], window=14)
        rsi_14 = rsi.rsi().iloc[-1]
        
        # MACD
        macd_indicator = ta.trend.MACD(close=hist['Close'])
        macd = macd_indicator.macd().iloc[-1]
        macd_signal = macd_indicator.macd_signal().iloc[-1]
        macd_histogram = macd_indicator.macd_diff().iloc[-1]
        
        # Support and resistance (simplified - using recent lows/highs)
        lookback = min(60, len(hist))
        recent_lows = hist['Low'].tail(lookback).min()
        recent_highs = hist['High'].tail(lookback).max()
        
        support_level = recent_lows
        resistance_level = recent_highs
        
        # Trend direction
        trend_direction = "Neutral"
        if current_price > ma_50 > ma_200 and price_vs_50d_ma > 2:
            trend_direction = "Bullish"
        elif current_price < ma_50 < ma_200 and price_vs_50d_ma < -2:
            trend_direction = "Bearish"
        
        return TechnicalMetrics(
            price_50d_ma=float(ma_50),
            price_200d_ma=float(ma_200),
            price_vs_50d_ma=float(price_vs_50d_ma),
            price_vs_200d_ma=float(price_vs_200d_ma),
            rsi_14=float(rsi_14) if not pd.isna(rsi_14) else None,
            macd=float(macd) if not pd.isna(macd) else None,
            macd_signal=float(macd_signal) if not pd.isna(macd_signal) else None,
            macd_histogram=float(macd_histogram) if not pd.isna(macd_histogram) else None,
            support_level=float(support_level),
            resistance_level=float(resistance_level),
            trend_direction=trend_direction
        )
    
    def _analyze_risk(self, stock: yf.Ticker, hist: pd.DataFrame, info: Dict) -> RiskMetrics:
        """Analyze risk metrics"""
        
        # Beta
        beta = info.get('beta', 1.0)
        
        # Volatility (annualized)
        if len(hist) >= 30:
            returns = hist['Close'].pct_change().dropna()
            volatility_1y = returns.std() * np.sqrt(252) * 100  # Annualized percentage
        else:
            volatility_1y = None
        
        # Max drawdown (1 year)
        max_drawdown_1y = None
        if len(hist) >= 252:
            one_year = hist.tail(252)
            cumulative = (1 + one_year['Close'].pct_change()).cumprod()
            running_max = cumulative.expanding().max()
            drawdown = (cumulative - running_max) / running_max
            max_drawdown_1y = drawdown.min() * 100
        elif len(hist) >= 30:
            # Use available data
            cumulative = (1 + hist['Close'].pct_change()).cumprod()
            running_max = cumulative.expanding().max()
            drawdown = (cumulative - running_max) / running_max
            max_drawdown_1y = drawdown.min() * 100
        
        # Earnings variability (coefficient of variation of earnings)
        earnings_variability = None
        try:
            financials = stock.financials
            if not financials.empty and 'Net Income' in financials.index:
                earnings = financials.loc['Net Income'].dropna()
                if len(earnings) >= 3:
                    earnings_abs = earnings.abs()
                    mean_earnings = earnings_abs.mean()
                    std_earnings = earnings_abs.std()
                    if mean_earnings > 0:
                        earnings_variability = (std_earnings / mean_earnings) * 100
        except:
            pass
        
        # Debt risk score (0-100, higher = riskier)
        debt_risk_score = 0
        debt_to_equity = info.get('debtToEquity', 0)
        current_ratio = info.get('currentRatio', 1)
        
        # Debt risk
        if debt_to_equity:
            if debt_to_equity > 2.0:
                debt_risk_score += 40
            elif debt_to_equity > 1.0:
                debt_risk_score += 20
        
        # Liquidity risk
        if current_ratio:
            if current_ratio < 1.0:
                debt_risk_score += 30
            elif current_ratio < 1.5:
                debt_risk_score += 15
        
        # Beta risk
        if abs(beta) > 1.5:
            debt_risk_score += 20
        elif abs(beta) > 1.2:
            debt_risk_score += 10
        
        debt_risk_score = min(debt_risk_score, 100)
        
        # Overall risk level
        overall_risk_level = "Medium"
        if debt_risk_score >= 70 or (beta and abs(beta) > 1.5):
            overall_risk_level = "High"
        elif debt_risk_score <= 30 and (beta and abs(beta) < 1.0):
            overall_risk_level = "Low"
        
        return RiskMetrics(
            beta=beta,
            max_drawdown_1y=max_drawdown_1y,
            volatility_1y=volatility_1y,
            earnings_variability=earnings_variability,
            debt_risk_score=debt_risk_score,
            overall_risk_level=overall_risk_level
        )
    
    def _calculate_scores(self, fundamentals: FundamentalMetrics, valuation: ValuationMetrics,
                         technicals: TechnicalMetrics, risk: RiskMetrics) -> ScoringBreakdown:
        """Calculate weighted scores for each category"""
        
        # Fundamentals Score (40% weight)
        fundamentals_score = 0
        max_fundamentals = 0
        
        # Revenue growth (0-15 points)
        if fundamentals.revenue_growth_yoy is not None:
            max_fundamentals += 15
            if fundamentals.revenue_growth_yoy > 20:
                fundamentals_score += 15
            elif fundamentals.revenue_growth_yoy > 10:
                fundamentals_score += 12
            elif fundamentals.revenue_growth_yoy > 5:
                fundamentals_score += 8
            elif fundamentals.revenue_growth_yoy > 0:
                fundamentals_score += 5
        
        # EPS growth (0-10 points)
        if fundamentals.eps_growth is not None:
            max_fundamentals += 10
            if fundamentals.eps_growth > 20:
                fundamentals_score += 10
            elif fundamentals.eps_growth > 10:
                fundamentals_score += 8
            elif fundamentals.eps_growth > 5:
                fundamentals_score += 5
            elif fundamentals.eps_growth > 0:
                fundamentals_score += 3
        
        # ROE (0-8 points)
        if fundamentals.roe is not None:
            max_fundamentals += 8
            if fundamentals.roe > 20:
                fundamentals_score += 8
            elif fundamentals.roe > 15:
                fundamentals_score += 6
            elif fundamentals.roe > 10:
                fundamentals_score += 4
            elif fundamentals.roe > 5:
                fundamentals_score += 2
        
        # FCF margin (0-7 points)
        if fundamentals.fcf_margin is not None:
            max_fundamentals += 7
            if fundamentals.fcf_margin > 20:
                fundamentals_score += 7
            elif fundamentals.fcf_margin > 10:
                fundamentals_score += 5
            elif fundamentals.fcf_margin > 5:
                fundamentals_score += 3
            elif fundamentals.fcf_margin > 0:
                fundamentals_score += 1
        
        # Normalize to 40 points
        if max_fundamentals > 0:
            fundamentals_score = (fundamentals_score / max_fundamentals) * 40
        else:
            fundamentals_score = 20  # Neutral if no data
        
        # Valuation Score (30% weight)
        valuation_score = 0
        
        # Price to fair value (0-20 points)
        if valuation.price_to_fair_value is not None:
            if valuation.price_to_fair_value < 0.8:
                valuation_score += 20  # Undervalued
            elif valuation.price_to_fair_value < 0.95:
                valuation_score += 15
            elif valuation.price_to_fair_value < 1.05:
                valuation_score += 10  # Fair value
            elif valuation.price_to_fair_value < 1.2:
                valuation_score += 5
            else:
                valuation_score += 0  # Overvalued
        
        # P/E comparison (0-10 points)
        if valuation.price_vs_historical:
            if valuation.price_vs_historical == "Undervalued":
                valuation_score += 10
            elif valuation.price_vs_historical == "Fair":
                valuation_score += 5
            else:
                valuation_score += 0
        
        # Technicals Score (20% weight)
        technicals_score = 0
        
        # Trend (0-10 points)
        if technicals.trend_direction:
            if technicals.trend_direction == "Bullish":
                technicals_score += 10
            elif technicals.trend_direction == "Neutral":
                technicals_score += 5
            else:
                technicals_score += 0
        
        # RSI (0-5 points)
        if technicals.rsi_14 is not None:
            if 30 < technicals.rsi_14 < 70:
                technicals_score += 5  # Healthy range
            elif 20 < technicals.rsi_14 < 80:
                technicals_score += 3
            else:
                technicals_score += 1  # Overbought/oversold
        
        # Price vs MAs (0-5 points)
        if technicals.price_vs_50d_ma is not None:
            if technicals.price_vs_50d_ma > 0 and technicals.price_vs_200d_ma > 0:
                technicals_score += 5
            elif technicals.price_vs_50d_ma > 0:
                technicals_score += 3
            else:
                technicals_score += 1
        
        # Risk Score (10% weight) - Inverted (lower risk = higher score)
        risk_score = 10
        
        if risk.debt_risk_score is not None:
            risk_score -= (risk.debt_risk_score / 100) * 5  # Deduct up to 5 points
        
        if risk.beta is not None:
            if abs(risk.beta) > 1.5:
                risk_score -= 3
            elif abs(risk.beta) > 1.2:
                risk_score -= 1.5
        
        risk_score = max(0, risk_score)  # Don't go negative
        
        # Total score
        total_score = fundamentals_score + valuation_score + technicals_score + risk_score
        
        return ScoringBreakdown(
            fundamentals_score=round(fundamentals_score, 2),
            valuation_score=round(valuation_score, 2),
            technicals_score=round(technicals_score, 2),
            risk_score=round(risk_score, 2),
            total_score=round(total_score, 2),
            max_score=100.0
        )
    
    def _generate_recommendation(self, scoring: ScoringBreakdown, fundamentals: FundamentalMetrics,
                                valuation: ValuationMetrics, technicals: TechnicalMetrics,
                                risk: RiskMetrics) -> Recommendation:
        """Generate final recommendation"""
        
        score = scoring.total_score
        reasoning = []
        
        # Determine action
        if score >= 70:
            action = "Buy"
            confidence = min(90, 60 + (score - 70) * 1.5)
        elif score >= 50:
            action = "Hold"
            confidence = 50 + (score - 50) * 1.0
        else:
            action = "Avoid"
            confidence = max(30, 50 - (50 - score) * 0.8)
        
        # Generate reasoning
        if scoring.fundamentals_score >= 30:
            reasoning.append("Strong fundamental metrics")
        elif scoring.fundamentals_score < 20:
            reasoning.append("Weak fundamental performance")
        
        if scoring.valuation_score >= 20:
            reasoning.append("Attractive valuation")
        elif scoring.valuation_score < 10:
            reasoning.append("Overvalued relative to fundamentals")
        
        if scoring.technicals_score >= 15:
            reasoning.append("Positive technical indicators")
        elif scoring.technicals_score < 8:
            reasoning.append("Weak technical setup")
        
        if risk.overall_risk_level == "High":
            reasoning.append("Elevated risk profile")
        elif risk.overall_risk_level == "Low":
            reasoning.append("Lower risk profile")
        
        if not reasoning:
            reasoning.append("Mixed signals - review carefully")
        
        return Recommendation(
            action=action,
            confidence=round(confidence, 1),
            score=round(score, 2),
            reasoning=reasoning
        )
    
    def _generate_insights(self, fundamentals: FundamentalMetrics, valuation: ValuationMetrics,
                          technicals: TechnicalMetrics, risk: RiskMetrics,
                          scoring: ScoringBreakdown) -> list:
        """Generate plain English insights"""
        
        insights = []
        
        # Fundamental insights
        if fundamentals.revenue_growth_yoy is not None:
            if fundamentals.revenue_growth_yoy > 15:
                insights.append(f"Strong revenue growth of {fundamentals.revenue_growth_yoy:.1f}% YoY")
            elif fundamentals.revenue_growth_yoy < 0:
                insights.append(f"Revenue declining by {abs(fundamentals.revenue_growth_yoy):.1f}% YoY")
        
        if fundamentals.pe_ratio is not None:
            if fundamentals.pe_ratio < 15:
                insights.append(f"Trading at attractive P/E ratio of {fundamentals.pe_ratio:.1f}")
            elif fundamentals.pe_ratio > 30:
                insights.append(f"High P/E ratio of {fundamentals.pe_ratio:.1f} suggests premium valuation")
        
        # Valuation insights
        if valuation.price_to_fair_value is not None:
            if valuation.price_to_fair_value < 0.9:
                discount = (1 - valuation.price_to_fair_value) * 100
                insights.append(f"Trading at {discount:.1f}% discount to estimated fair value")
            elif valuation.price_to_fair_value > 1.1:
                premium = (valuation.price_to_fair_value - 1) * 100
                insights.append(f"Trading at {premium:.1f}% premium to estimated fair value")
        
        # Technical insights
        if technicals.trend_direction:
            insights.append(f"Technical trend: {technicals.trend_direction}")
        
        if technicals.rsi_14 is not None:
            if technicals.rsi_14 > 70:
                insights.append("RSI indicates overbought conditions")
            elif technicals.rsi_14 < 30:
                insights.append("RSI indicates oversold conditions")
        
        # Risk insights
        if risk.beta is not None:
            if abs(risk.beta) > 1.3:
                insights.append(f"High volatility (Beta: {risk.beta:.2f})")
            elif abs(risk.beta) < 0.8:
                insights.append(f"Lower volatility (Beta: {risk.beta:.2f})")
        
        if risk.max_drawdown_1y is not None:
            if abs(risk.max_drawdown_1y) > 30:
                insights.append(f"Significant drawdown risk ({risk.max_drawdown_1y:.1f}% max drawdown)")
        
        return insights

