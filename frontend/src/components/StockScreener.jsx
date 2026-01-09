import React, { useState } from 'react'

function StockScreener() {
  const [tickers, setTickers] = useState('AAPL,MSFT,GOOGL,AMZN,NVDA,TSLA,META,JPM,V,DIS')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleScreen = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      // Parse tickers from comma-separated string
      const tickerList = tickers
        .split(',')
        .map(t => t.trim().toUpperCase())
        .filter(t => t.length > 0)

      if (tickerList.length === 0) {
        throw new Error('Please enter at least one ticker symbol')
      }

      if (tickerList.length > 50) {
        throw new Error('Maximum 50 tickers allowed')
      }

      const response = await fetch('/api/screen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tickers: tickerList,
          top_n: 10
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to screen stocks')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getRecommendationColor = (rec) => {
    switch (rec) {
      case 'Buy':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'Hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Avoid':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getScoreColor = (score) => {
    if (score >= 20) return 'text-green-600'
    if (score >= 15) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Stock Screener</h2>
      <p className="text-sm text-gray-600 mb-6">
        Enter multiple ticker symbols (comma-separated) to scan and rank stocks based on fundamentals, technicals, and risk.
      </p>

      <div className="mb-4">
        <label htmlFor="tickers" className="block text-sm font-medium text-gray-700 mb-2">
          Ticker Symbols (comma-separated)
        </label>
        <textarea
          id="tickers"
          value={tickers}
          onChange={(e) => setTickers(e.target.value)}
          placeholder="AAPL,MSFT,GOOGL,AMZN,NVDA"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
        <p className="mt-2 text-xs text-gray-500">
          Enter up to 50 ticker symbols separated by commas
        </p>
      </div>

      <button
        onClick={handleScreen}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Screening Stocks...' : 'Screen Stocks'}
      </button>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading && (
        <div className="mt-6 flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Analyzing stocks...</span>
        </div>
      )}

      {results && (
        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              Top {results.results.length} Stocks
            </h3>
            <p className="text-sm text-gray-500">
              Analyzed {results.total_analyzed} stocks
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticker
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fundamental
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Technical
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recommendation
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.results.map((stock, index) => (
                  <tr key={stock.ticker} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                      {stock.ticker}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {stock.company_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      ${stock.current_price?.toFixed(2) || 'N/A'}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-bold ${getScoreColor(stock.total_score)}`}>
                      {stock.total_score.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {stock.fundamental_score.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {stock.technical_score.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {stock.risk_score.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded border ${getRecommendationColor(stock.recommendation)}`}>
                        {stock.recommendation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Scoring:</strong> Fundamental (40%) + Technical (40%) + Risk (20%)
            </p>
            <p className="text-sm text-blue-700 mt-1">
              <strong>Recommendations:</strong> Buy (≥20), Hold (15-19), Avoid (&lt;15)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default StockScreener

