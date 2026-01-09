import React from 'react'

function ScoreBreakdown({ scoring }) {
  const getScoreColor = (score) => {
    if (score >= 70) return 'bg-green-500'
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getScoreTextColor = (score) => {
    if (score >= 70) return 'text-green-700'
    if (score >= 50) return 'text-yellow-700'
    return 'text-red-700'
  }

  const categories = [
    { label: 'Fundamentals', score: scoring.fundamentals_score, weight: 40, color: 'bg-blue-500' },
    { label: 'Valuation', score: scoring.valuation_score, weight: 30, color: 'bg-purple-500' },
    { label: 'Technicals', score: scoring.technicals_score, weight: 20, color: 'bg-indigo-500' },
    { label: 'Risk', score: scoring.risk_score, weight: 10, color: 'bg-orange-500' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Score Breakdown</h3>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Total Score</span>
          <span className={`text-2xl font-bold ${getScoreTextColor(scoring.total_score)}`}>
            {scoring.total_score.toFixed(1)}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full ${getScoreColor(scoring.total_score)} transition-all duration-500`}
            style={{ width: `${scoring.total_score}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((category, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">
                {category.label} ({category.weight}%)
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {category.score.toFixed(1)}/{category.weight}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${category.color} transition-all duration-500`}
                style={{ width: `${(category.score / category.weight) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScoreBreakdown

