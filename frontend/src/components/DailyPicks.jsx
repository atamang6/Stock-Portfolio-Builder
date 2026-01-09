import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'

function DailyPicks() {
  const [picks, setPicks] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDailyPicks()
  }, [])

  const loadDailyPicks = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/daily-picks')
      
      if (!response.ok) {
        const text = await response.text()
        let errorMessage = `HTTP ${response.status}`
        try {
          const errorData = JSON.parse(text)
          errorMessage = errorData.detail || errorMessage
        } catch (e) {
          errorMessage = text || errorMessage
        }
        throw new Error(errorMessage)
      }

      const text = await response.text()
      if (!text || text.trim().length === 0) {
        throw new Error('Backend returned empty response')
      }

      const data = JSON.parse(text)
      setPicks(data)
    } catch (err) {
      setError(err.message || 'Failed to load daily picks')
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Analyzing stocks and generating daily picks...</p>
          <p className="mt-2 text-sm text-gray-500">This may take 30-60 seconds</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="mt-1 text-sm text-red-700">{error}</p>
          <button
            onClick={loadDailyPicks}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!picks || !picks.results) {
    return null
  }

  // Prepare data for visualizations
  const prepareChartData = () => {
    if (!picks || !picks.results) return null

    const tickers = picks.results.map(s => s.ticker)
    const totalScores = picks.results.map(s => s.total_score)
    const fundamentalScores = picks.results.map(s => s.fundamental_score)
    const technicalScores = picks.results.map(s => s.technical_score)
    const riskScores = picks.results.map(s => s.risk_score)

    return {
      tickers,
      totalScores,
      fundamentalScores,
      technicalScores,
      riskScores
    }
  }

  const chartData = prepareChartData()

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Daily Top 10 Stock Picks</h2>
            <p className="text-sm text-gray-600 mt-1">
              Generated on {picks.date} • Analyzed {picks.total_analyzed} stocks
            </p>
          </div>
          <button
            onClick={loadDailyPicks}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Refresh Picks
          </button>
        </div>
      </div>

      {/* Visualizations Section */}
      {chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Total Score Comparison */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Total Score Comparison</h3>
            <Plot
              data={[{
                x: chartData.tickers,
                y: chartData.totalScores,
                type: 'bar',
                marker: {
                  color: chartData.totalScores.map(score => 
                    score >= 20 ? '#10b981' : score >= 15 ? '#f59e0b' : '#ef4444'
                  )
                },
                text: chartData.totalScores.map(s => s.toFixed(1)),
                textposition: 'outside'
              }]}
              layout={{
                height: 400,
                margin: { l: 50, r: 20, t: 20, b: 100 },
                xaxis: { title: 'Stock Ticker', tickangle: -45 },
                yaxis: { title: 'Total Score (out of 30)' },
                showlegend: false,
                plot_bgcolor: 'white',
                paper_bgcolor: 'white'
              }}
              config={{ responsive: true, displayModeBar: false }}
            />
          </div>

          {/* Score Breakdown Stacked Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Score Breakdown by Category</h3>
            <Plot
              data={[
                {
                  x: chartData.tickers,
                  y: chartData.fundamentalScores,
                  name: 'Fundamental',
                  type: 'bar',
                  marker: { color: '#3b82f6' }
                },
                {
                  x: chartData.tickers,
                  y: chartData.technicalScores,
                  name: 'Technical',
                  type: 'bar',
                  marker: { color: '#8b5cf6' }
                },
                {
                  x: chartData.tickers,
                  y: chartData.riskScores,
                  name: 'Risk',
                  type: 'bar',
                  marker: { color: '#f59e0b' }
                }
              ]}
              layout={{
                height: 400,
                margin: { l: 50, r: 20, t: 20, b: 100 },
                xaxis: { title: 'Stock Ticker', tickangle: -45 },
                yaxis: { title: 'Score' },
                barmode: 'group',
                legend: { orientation: 'h', y: -0.2 },
                plot_bgcolor: 'white',
                paper_bgcolor: 'white'
              }}
              config={{ responsive: true, displayModeBar: false }}
            />
          </div>

          {/* Recommendation Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recommendation Distribution</h3>
            {(() => {
              const recCounts = picks.results.reduce((acc, stock) => {
                acc[stock.recommendation] = (acc[stock.recommendation] || 0) + 1
                return acc
              }, {})
              
              const labels = Object.keys(recCounts)
              const values = Object.values(recCounts)
              const colors = labels.map(l => 
                l === 'Buy' ? '#10b981' : l === 'Hold' ? '#f59e0b' : '#ef4444'
              )

              return (
                <Plot
                  data={[{
                    labels: labels,
                    values: values,
                    type: 'pie',
                    marker: { colors: colors },
                    textinfo: 'label+percent',
                    textposition: 'outside'
                  }]}
                  layout={{
                    height: 400,
                    margin: { l: 20, r: 20, t: 20, b: 20 },
                    showlegend: true,
                    plot_bgcolor: 'white',
                    paper_bgcolor: 'white'
                  }}
                  config={{ responsive: true, displayModeBar: false }}
                />
              )
            })()}
          </div>

          {/* Score Distribution Histogram */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Score Distribution</h3>
            <Plot
              data={[{
                x: chartData.totalScores,
                type: 'histogram',
                marker: {
                  color: '#3b82f6',
                  line: { color: '#1e40af', width: 1 }
                },
                nbinsx: 10
              }]}
              layout={{
                height: 400,
                margin: { l: 50, r: 20, t: 20, b: 50 },
                xaxis: { title: 'Total Score' },
                yaxis: { title: 'Number of Stocks' },
                plot_bgcolor: 'white',
                paper_bgcolor: 'white'
              }}
              config={{ responsive: true, displayModeBar: false }}
            />
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      {chartData && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Summary Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {(chartData.totalScores.reduce((a, b) => a + b, 0) / chartData.totalScores.length).toFixed(1)}
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-sm text-gray-500">Highest Score</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.max(...chartData.totalScores).toFixed(1)}
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="text-sm text-gray-500">Avg Fundamental</p>
              <p className="text-2xl font-bold text-gray-900">
                {(chartData.fundamentalScores.reduce((a, b) => a + b, 0) / chartData.fundamentalScores.length).toFixed(1)}
              </p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <p className="text-sm text-gray-500">Avg Technical</p>
              <p className="text-2xl font-bold text-gray-900">
                {(chartData.technicalScores.reduce((a, b) => a + b, 0) / chartData.technicalScores.length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {picks.results.map((stock, index) => (
          <div key={stock.ticker} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                  <span className="text-xl font-bold text-blue-600">#{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{stock.ticker}</h3>
                  <p className="text-sm text-gray-600">{stock.company_name}</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    ${stock.current_price?.toFixed(2) || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`px-4 py-2 rounded-lg border ${getRecommendationColor(stock.recommendation)}`}>
                  <span className="font-bold text-lg">{stock.recommendation}</span>
                </div>
                <p className={`text-2xl font-bold mt-2 ${getScoreColor(stock.total_score)}`}>
                  {stock.total_score.toFixed(1)}/30
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-xs text-gray-500 mb-1">Fundamental Score</p>
                <p className="text-lg font-semibold">{stock.fundamental_score.toFixed(1)}/30</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="text-xs text-gray-500 mb-1">Technical Score</p>
                <p className="text-lg font-semibold">{stock.technical_score.toFixed(1)}/20</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <p className="text-xs text-gray-500 mb-1">Risk Score</p>
                <p className="text-lg font-semibold">{stock.risk_score.toFixed(1)}/10</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                    <span>✅</span> Why Choose This Stock
                  </h4>
                  <ul className="space-y-1">
                    {stock.why_choose && stock.why_choose.length > 0 ? (
                      stock.why_choose.map((reason, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          <span>{reason}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500">No strong positive factors</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                    <span>❌</span> Why Avoid This Stock
                  </h4>
                  <ul className="space-y-1">
                    {stock.why_avoid && stock.why_avoid.length > 0 ? (
                      stock.why_avoid.map((reason, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          <span>{reason}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500">No major concerns</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {stock.key_metrics && Object.keys(stock.key_metrics).length > 0 && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="font-semibold text-gray-700 mb-2">Key Metrics</h4>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(stock.key_metrics).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="text-gray-500">{key.replace('_', ' ').toUpperCase()}:</span>
                      <span className="font-semibold ml-2 text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Individual Stock Score Visualization */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="font-semibold text-gray-700 mb-3">Score Breakdown</h4>
              <div style={{ height: '200px' }}>
                <Plot
                  data={[{
                    x: ['Fundamental', 'Technical', 'Risk'],
                    y: [
                      stock.fundamental_score / 30 * 100,
                      stock.technical_score / 20 * 100,
                      stock.risk_score / 10 * 100
                    ],
                    type: 'bar',
                    marker: {
                      color: ['#3b82f6', '#8b5cf6', '#f59e0b']
                    },
                    text: [
                      stock.fundamental_score.toFixed(1),
                      stock.technical_score.toFixed(1),
                      stock.risk_score.toFixed(1)
                    ],
                    textposition: 'outside'
                  }]}
                  layout={{
                    height: 200,
                    margin: { l: 50, r: 20, t: 10, b: 50 },
                    xaxis: { title: 'Category' },
                    yaxis: { title: 'Score %', range: [0, 100] },
                    showlegend: false,
                    plot_bgcolor: 'white',
                    paper_bgcolor: 'white'
                  }}
                  config={{ responsive: true, displayModeBar: false }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DailyPicks

