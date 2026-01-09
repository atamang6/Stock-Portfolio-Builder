"""
Stock Screener - Scan and rank multiple stocks
Based on fundamental, technical, and risk analysis
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime
from typing import List, Dict, Optional
from ta.momentum import RSIIndicator
from ta.trend import MACD


class StockScreener:
    """Stock screener that ranks stocks based on multiple criteria"""
    
    def __init__(self):
        self.fundamental_weight = 0.4
        self.technical_weight = 0.4
        self.risk_weight = 0.2
    
    def fundamental_score(self, ticker: str) -> float:
        """
        Calculate fundamental score (0-30 points)
        
        Args:
            ticker: Stock ticker symbol
            
        Returns:
            Fundamental score (0-30)
        """
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            
            if not info or 'symbol' not in info:
                return 0
            
            score = 0
            
            # Revenue growth YoY % (0-10 points)
            if 'revenueGrowth' in info and info['revenueGrowth'] is not None:
                rev_growth = info['revenueGrowth'] * 100
                score += min(max(rev_growth / 20 * 10, 0), 10)
            
            # EPS growth % (0-10 points)
            if 'earningsQuarterlyGrowth' in info and info['earningsQuarterlyGrowth'] is not None:
                eps_growth = info['earningsQuarterlyGrowth'] * 100
                score += min(max(eps_growth / 20 * 10, 0), 10)
            
            # Debt-to-Equity (0-10 points)
            if 'debtToEquity' in info and info['debtToEquity'] is not None:
                de = info['debtToEquity']
                if de < 1:
                    score += 10
                elif de < 2:
                    score += 5
                else:
                    score += 0
            
            return min(score, 30)
        except Exception as e:
            return 0
    
    def technical_score(self, ticker: str) -> float:
        """
        Calculate technical score (0-20 points)
        
        Args:
            ticker: Stock ticker symbol
            
        Returns:
            Technical score (0-20)
        """
        try:
            df = yf.download(ticker, period='6mo', interval='1d', progress=False)
            if df.empty or len(df) < 200:
                return 0
            
            score = 0
            
            # Moving Averages (0-5 points)
            df['MA50'] = df['Close'].rolling(50).mean()
            df['MA200'] = df['Close'].rolling(200).mean()
            
            if len(df) >= 200:
                if df['MA50'].iloc[-1] > df['MA200'].iloc[-1]:
                    score += 5  # Bullish trend
                elif df['Close'].iloc[-1] > df['MA50'].iloc[-1]:
                    score += 3  # Above 50-day MA
            
            # RSI (0-5 points)
            rsi_indicator = RSIIndicator(df['Close'], window=14)
            rsi = rsi_indicator.rsi().iloc[-1]
            
            if pd.notna(rsi):
                if rsi < 30:
                    score += 5  # Oversold, potential buy
                elif rsi < 50:
                    score += 3
                elif rsi < 70:
                    score += 2
            
            # MACD (0-5 points)
            macd_indicator = MACD(df['Close'])
            macd_diff = macd_indicator.macd_diff().iloc[-1]
            
            if pd.notna(macd_diff):
                if macd_diff > 0:
                    score += 5  # Bullish
                elif macd_diff > -0.5:
                    score += 2
            
            # Price momentum (0-5 points)
            if len(df) >= 20:
                price_change = (df['Close'].iloc[-1] - df['Close'].iloc[-20]) / df['Close'].iloc[-20] * 100
                if price_change > 10:
                    score += 5
                elif price_change > 5:
                    score += 3
                elif price_change > 0:
                    score += 1
            
            return min(score, 20)
        except Exception as e:
            return 0
    
    def risk_score(self, ticker: str) -> float:
        """
        Calculate risk score (0-10 points, higher = lower risk)
        
        Args:
            ticker: Stock ticker symbol
            
        Returns:
            Risk score (0-10, inverted - higher score = lower risk)
        """
        try:
            df = yf.download(ticker, period='1y', interval='1d', progress=False)
            if df.empty or len(df) < 30:
                return 5  # Neutral if insufficient data
            
            returns = df['Close'].pct_change().dropna()
            if len(returns) < 10:
                return 5
            
            # Volatility (annualized)
            volatility = returns.std() * np.sqrt(252)
            
            # Beta (if available)
            stock = yf.Ticker(ticker)
            info = stock.info
            beta = info.get('beta', 1.0)
            
            score = 10
            
            # Volatility penalty
            if volatility > 0.5:
                score -= 5  # Very high volatility
            elif volatility > 0.35:
                score -= 3  # High volatility
            elif volatility > 0.2:
                score -= 1  # Moderate volatility
            
            # Beta penalty
            if abs(beta) > 1.5:
                score -= 3  # High beta
            elif abs(beta) > 1.2:
                score -= 1
            
            return max(min(score, 10), 0)
        except Exception as e:
            return 5  # Neutral if error
    
    def screen_stocks(self, tickers: List[str], top_n: int = 10) -> List[Dict]:
        """
        Screen and rank multiple stocks
        
        Args:
            tickers: List of ticker symbols to screen
            top_n: Number of top stocks to return
            
        Returns:
            List of ranked stock results
        """
        results = []
        
        for ticker in tickers:
            try:
                ticker = ticker.upper().strip()
                
                # Calculate scores
                f_score = self.fundamental_score(ticker)
                t_score = self.technical_score(ticker)
                r_score = self.risk_score(ticker)
                
                # Weighted total score
                total_score = (
                    f_score * self.fundamental_weight +
                    t_score * self.technical_weight +
                    r_score * self.risk_weight
                )
                
                # Get current price
                stock = yf.Ticker(ticker)
                info = stock.info
                current_price = info.get('currentPrice') or info.get('regularMarketPrice')
                
                # Get company name
                company_name = info.get('longName') or info.get('shortName') or ticker
                
                # Determine recommendation
                if total_score >= 20:
                    recommendation = "Buy"
                elif total_score >= 15:
                    recommendation = "Hold"
                else:
                    recommendation = "Avoid"
                
                results.append({
                    'ticker': ticker,
                    'company_name': company_name,
                    'current_price': current_price,
                    'fundamental_score': round(f_score, 2),
                    'technical_score': round(t_score, 2),
                    'risk_score': round(r_score, 2),
                    'total_score': round(total_score, 2),
                    'recommendation': recommendation
                })
            except Exception as e:
                # Skip stocks that fail to analyze
                continue
        
        # Sort by total score (descending)
        results.sort(key=lambda x: x['total_score'], reverse=True)
        
        # Return top N
        return results[:top_n]
    
    def get_recommendation(self, score: float) -> str:
        """Get recommendation based on score"""
        if score >= 20:
            return "Buy"
        elif score >= 15:
            return "Hold"
        else:
            return "Avoid"

