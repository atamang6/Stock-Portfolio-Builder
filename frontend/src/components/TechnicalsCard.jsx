import React from 'react'

function TechnicalsCard({ technicals }) {
  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined) return 'N/A'
    return value.toFixed(decimals)
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'Bullish':
        return 'text-green-600'
      case 'Bearish':
        return 'text-red-600'
      default:
        return 'text-yellow-600'
    }
  }

  const getRSIColor = (rsi) => {
    if (rsi === null || rsi === undefined) return 'text-gray-500'
    if (rsi > 70) return 'text-red-600'
    if (rsi < 30) return 'text-green-600'
    return 'text-yellow-600'
  }

  const getRSIStatus = (rsi) => {
    if (rsi === null || rsi === undefined) return 'N/A'
    if (rsi > 70) return 'Overbought'
    if (rsi < 30) return 'Oversold'
    return 'Neutral'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Technical Analysis</h3>
      
      <div className="space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <p className="text-xs text-gray-500 mb-1">Trend Direction</p>
          <p className={`text-lg font-semibold ${getTrendColor(technicals.trend_direction)}`}>
            {technicals.trend_direction || 'N/A'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">50-Day MA</p>
            <p className="text-sm font-semibold text-gray-900">
              ${formatNumber(technicals.price_50d_ma)}
            </p>
            {technicals.price_vs_50d_ma !== null && (
              <p className={`text-xs mt-1 ${
                technicals.price_vs_50d_ma > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {technicals.price_vs_50d_ma > 0 ? '+' : ''}{formatNumber(technicals.price_vs_50d_ma, 1)}%
              </p>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">200-Day MA</p>
            <p className="text-sm font-semibold text-gray-900">
              ${formatNumber(technicals.price_200d_ma)}
            </p>
            {technicals.price_vs_200d_ma !== null && (
              <p className={`text-xs mt-1 ${
                technicals.price_vs_200d_ma > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {technicals.price_vs_200d_ma > 0 ? '+' : ''}{formatNumber(technicals.price_vs_200d_ma, 1)}%
              </p>
            )}
          </div>
        </div>

        <div className="border-b border-gray-100 pb-3">
          <p className="text-xs text-gray-500 mb-1">RSI (14)</p>
          <p className={`text-lg font-semibold ${getRSIColor(technicals.rsi_14)}`}>
            {formatNumber(technicals.rsi_14)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {getRSIStatus(technicals.rsi_14)}
          </p>
        </div>

        {technicals.macd !== null && (
          <div className="border-b border-gray-100 pb-3">
            <p className="text-xs text-gray-500 mb-1">MACD</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-gray-400">MACD</p>
                <p className="font-semibold text-gray-900">{formatNumber(technicals.macd, 3)}</p>
              </div>
              <div>
                <p className="text-gray-400">Signal</p>
                <p className="font-semibold text-gray-900">{formatNumber(technicals.macd_signal, 3)}</p>
              </div>
              <div>
                <p className="text-gray-400">Histogram</p>
                <p className={`font-semibold ${
                  technicals.macd_histogram > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatNumber(technicals.macd_histogram, 3)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Support Level</p>
            <p className="text-sm font-semibold text-gray-900">
              ${formatNumber(technicals.support_level)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Resistance Level</p>
            <p className="text-sm font-semibold text-gray-900">
              ${formatNumber(technicals.resistance_level)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TechnicalsCard

