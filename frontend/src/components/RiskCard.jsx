import React from 'react'

function RiskCard({ risk }) {
  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined) return 'N/A'
    return value.toFixed(decimals)
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low':
        return 'text-green-600'
      case 'Medium':
        return 'text-yellow-600'
      case 'High':
        return 'text-red-600'
      default:
        return 'text-gray-500'
    }
  }

  const getBetaColor = (beta) => {
    if (beta === null || beta === undefined) return 'text-gray-500'
    if (Math.abs(beta) > 1.3) return 'text-red-600'
    if (Math.abs(beta) < 0.8) return 'text-green-600'
    return 'text-yellow-600'
  }

  const getRiskScoreColor = (score) => {
    if (score === null || score === undefined) return 'text-gray-500'
    if (score >= 70) return 'text-red-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Risk Analysis</h3>
      
      <div className="space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <p className="text-xs text-gray-500 mb-1">Overall Risk Level</p>
          <p className={`text-lg font-semibold ${getRiskColor(risk.overall_risk_level)}`}>
            {risk.overall_risk_level || 'N/A'}
          </p>
        </div>

        <div className="border-b border-gray-100 pb-3">
          <p className="text-xs text-gray-500 mb-1">Beta</p>
          <p className={`text-lg font-semibold ${getBetaColor(risk.beta)}`}>
            {formatNumber(risk.beta)}
          </p>
          {risk.beta && (
            <p className="text-xs text-gray-400 mt-1">
              {Math.abs(risk.beta) > 1.3 ? 'High volatility' :
               Math.abs(risk.beta) < 0.8 ? 'Low volatility' : 'Moderate volatility'}
            </p>
          )}
        </div>

        {risk.volatility_1y !== null && (
          <div className="border-b border-gray-100 pb-3">
            <p className="text-xs text-gray-500 mb-1">1-Year Volatility</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatNumber(risk.volatility_1y, 1)}%
            </p>
          </div>
        )}

        {risk.max_drawdown_1y !== null && (
          <div className="border-b border-gray-100 pb-3">
            <p className="text-xs text-gray-500 mb-1">Max Drawdown (1Y)</p>
            <p className={`text-sm font-semibold ${
              Math.abs(risk.max_drawdown_1y) > 30 ? 'text-red-600' :
              Math.abs(risk.max_drawdown_1y) > 20 ? 'text-yellow-600' : 'text-gray-900'
            }`}>
              {formatNumber(risk.max_drawdown_1y, 1)}%
            </p>
          </div>
        )}

        {risk.earnings_variability !== null && (
          <div className="border-b border-gray-100 pb-3">
            <p className="text-xs text-gray-500 mb-1">Earnings Variability</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatNumber(risk.earnings_variability, 1)}%
            </p>
          </div>
        )}

        {risk.debt_risk_score !== null && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Debt Risk Score</p>
            <p className={`text-lg font-semibold ${getRiskScoreColor(risk.debt_risk_score)}`}>
              {formatNumber(risk.debt_risk_score, 0)}/100
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {risk.debt_risk_score >= 70 ? 'High debt risk' :
               risk.debt_risk_score >= 40 ? 'Moderate debt risk' : 'Low debt risk'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RiskCard

