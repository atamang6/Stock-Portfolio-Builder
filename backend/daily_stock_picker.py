"""
Daily Stock Picker - Automatically selects top 10 stocks daily
Provides detailed reasoning for Buy/Hold/Avoid recommendations
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime
from typing import List, Dict
from stock_screener import StockScreener


class DailyStockPicker:
    """Automatically picks and analyzes top stocks daily"""
    
    def __init__(self):
        self.screener = StockScreener()
        
        # Popular stock lists - can be expanded
        self.popular_tickers = [
            # Tech Giants
            'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA', 'NFLX',
            # Finance
            'JPM', 'BAC', 'WFC', 'GS', 'MS', 'V', 'MA',
            # Consumer
            'WMT', 'HD', 'MCD', 'SBUX', 'NKE', 'DIS',
            # Healthcare
            'JNJ', 'PFE', 'UNH', 'ABBV', 'MRK', 'TMO',
            # Industrial
            'BA', 'CAT', 'GE', 'HON', 'MMM',
            # Energy
            'XOM', 'CVX', 'COP', 'SLB',
            # Communication
            'VZ', 'T', 'CMCSA',
            # Retail
            'TGT', 'COST', 'LOW',
            # Semiconductors
            'AMD', 'INTC', 'AVGO', 'QCOM',
            # Software
            'ORCL', 'CRM', 'ADBE', 'NOW',
            # E-commerce
            'EBAY', 'SHOP',
            # Media
            'DIS', 'FOX', 'PARA',
            # Other popular
            'PYPL', 'SQ', 'UBER', 'LYFT', 'ZM',
        ]
    
    def get_top_stocks_list(self) -> List[str]:
        """
        Get a comprehensive list of stocks to analyze
        Can be expanded to fetch from S&P 500, NASDAQ, etc.
        """
        # For now, use predefined popular stocks
        # In production, you could:
        # - Fetch S&P 500 list
        # - Get most active stocks
        # - Use a stock screener API
        return self.popular_tickers
    
    def analyze_and_rank(self, tickers: List[str] = None, top_n: int = 10) -> List[Dict]:
        """
        Analyze stocks and return top picks with detailed reasoning
        
        Args:
            tickers: List of tickers to analyze (if None, uses default list)
            top_n: Number of top stocks to return
            
        Returns:
            List of top stocks with detailed analysis and reasoning
        """
        if tickers is None:
            tickers = self.get_top_stocks_list()
        
        results = []
        
        print(f"Analyzing {len(tickers)} stocks...")
        
        for ticker in tickers:
            try:
                ticker = ticker.upper().strip()
                
                # Get comprehensive analysis
                stock = yf.Ticker(ticker)
                info = stock.info
                
                if not info or 'symbol' not in info:
                    continue
                
                # Calculate scores
                f_score = self.screener.fundamental_score(ticker)
                t_score = self.screener.technical_score(ticker)
                r_score = self.screener.risk_score(ticker)
                
                # Weighted total score
                total_score = (
                    f_score * self.screener.fundamental_weight +
                    t_score * self.screener.technical_weight +
                    r_score * self.screener.risk_weight
                )
                
                # Get detailed metrics for reasoning
                current_price = info.get('currentPrice') or info.get('regularMarketPrice')
                company_name = info.get('longName') or info.get('shortName') or ticker
                
                # Generate detailed reasoning
                reasoning = self._generate_detailed_reasoning(
                    ticker, company_name, info, f_score, t_score, r_score, total_score
                )
                
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
                    'recommendation': recommendation,
                    'reasoning': reasoning,
                    'why_choose': reasoning['why_choose'],
                    'why_avoid': reasoning['why_avoid'],
                    'key_metrics': reasoning['key_metrics']
                })
                
            except Exception as e:
                # Skip stocks that fail to analyze
                continue
        
        # Sort by total score (descending)
        results.sort(key=lambda x: x['total_score'], reverse=True)
        
        # Return top N
        return results[:top_n]
    
    def _generate_detailed_reasoning(
        self, ticker: str, company_name: str, info: Dict,
        f_score: float, t_score: float, r_score: float, total_score: float
    ) -> Dict:
        """Generate detailed reasoning for choosing or avoiding a stock"""
        
        why_choose = []
        why_avoid = []
        key_metrics = {}
        
        # Fundamental analysis
        revenue_growth = info.get('revenueGrowth')
        if revenue_growth:
            rev_growth_pct = revenue_growth * 100
            key_metrics['revenue_growth'] = f"{rev_growth_pct:.1f}%"
            if rev_growth_pct > 15:
                why_choose.append(f"Strong revenue growth of {rev_growth_pct:.1f}% indicates expanding business")
            elif rev_growth_pct < 0:
                why_avoid.append(f"Revenue declining by {abs(rev_growth_pct):.1f}% - business contraction")
        
        eps_growth = info.get('earningsQuarterlyGrowth')
        if eps_growth:
            eps_growth_pct = eps_growth * 100
            key_metrics['eps_growth'] = f"{eps_growth_pct:.1f}%"
            if eps_growth_pct > 15:
                why_choose.append(f"Impressive EPS growth of {eps_growth_pct:.1f}% shows profitability improvement")
            elif eps_growth_pct < -10:
                why_avoid.append(f"Earnings declining by {abs(eps_growth_pct):.1f}% - profitability concerns")
        
        pe_ratio = info.get('trailingPE')
        if pe_ratio:
            key_metrics['pe_ratio'] = f"{pe_ratio:.2f}"
            if pe_ratio < 15:
                why_choose.append(f"Attractive P/E ratio of {pe_ratio:.1f} suggests good value")
            elif pe_ratio > 40:
                why_avoid.append(f"High P/E ratio of {pe_ratio:.1f} indicates overvaluation risk")
        
        roe = info.get('returnOnEquity')
        if roe:
            roe_pct = roe * 100
            key_metrics['roe'] = f"{roe_pct:.1f}%"
            if roe_pct > 20:
                why_choose.append(f"Excellent ROE of {roe_pct:.1f}% shows efficient capital use")
            elif roe_pct < 5:
                why_avoid.append(f"Low ROE of {roe_pct:.1f}% indicates inefficient capital allocation")
        
        debt_to_equity = info.get('debtToEquity')
        if debt_to_equity:
            key_metrics['debt_to_equity'] = f"{debt_to_equity:.2f}"
            if debt_to_equity < 1.0:
                why_choose.append(f"Low debt-to-equity of {debt_to_equity:.2f} shows financial stability")
            elif debt_to_equity > 2.0:
                why_avoid.append(f"High debt-to-equity of {debt_to_equity:.2f} increases financial risk")
        
        # Valuation
        forward_pe = info.get('forwardPE')
        if forward_pe and pe_ratio:
            key_metrics['forward_pe'] = f"{forward_pe:.2f}"
            if forward_pe < pe_ratio:
                why_choose.append(f"Forward P/E ({forward_pe:.1f}) lower than trailing P/E suggests improving earnings")
        
        # Risk analysis
        beta = info.get('beta', 1.0)
        key_metrics['beta'] = f"{beta:.2f}"
        if beta > 1.5:
            why_avoid.append(f"High beta of {beta:.2f} means high volatility and market sensitivity")
        elif beta < 0.8:
            why_choose.append(f"Low beta of {beta:.2f} provides portfolio stability")
        
        # Overall recommendation reasoning
        if total_score >= 20:
            why_choose.append(f"High overall score of {total_score:.1f}/30 indicates strong investment potential")
        elif total_score < 15:
            why_avoid.append(f"Low overall score of {total_score:.1f}/30 suggests limited upside potential")
        
        # Technical indicators
        if t_score >= 15:
            why_choose.append("Strong technical indicators show positive momentum")
        elif t_score < 8:
            why_avoid.append("Weak technical setup indicates poor price action")
        
        # Risk factors
        if r_score < 5:
            why_avoid.append("Elevated risk profile based on volatility and debt metrics")
        
        # Ensure we have content
        if not why_choose and not why_avoid:
            if total_score >= 15:
                why_choose.append("Balanced metrics with decent growth potential")
            else:
                why_avoid.append("Mixed signals - requires careful evaluation")
        
        return {
            'why_choose': why_choose if why_choose else ["Moderate fundamentals with room for improvement"],
            'why_avoid': why_avoid if why_avoid else ["No major red flags but limited upside"],
            'key_metrics': key_metrics
        }

