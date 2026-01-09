import React from 'react'

function RecommendationCard({ recommendation }) {
  const getActionIcon = (action) => {
    switch (action) {
      case 'Buy':
        return '✅'
      case 'Hold':
        return '⚠️'
      case 'Avoid':
        return '❌'
      default:
        return '📊'
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case 'Buy':
        return 'bg-buy/10 border-buy text-buy'
      case 'Hold':
        return 'bg-hold/10 border-hold text-hold'
      case 'Avoid':
        return 'bg-avoid/10 border-avoid text-avoid'
      default:
        return 'bg-gray-100 border-gray-300 text-gray-600'
    }
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 70) return 'text-green-600'
    if (confidence >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 ${getActionColor(recommendation.action)} p-6`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{getActionIcon(recommendation.action)}</span>
          <div>
            <h3 className="text-xl font-bold">Recommendation: {recommendation.action}</h3>
            <p className="text-sm mt-1 opacity-80">
              Score: {recommendation.score.toFixed(1)}/100
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-70">Confidence</p>
          <p className={`text-2xl font-bold ${getConfidenceColor(recommendation.confidence)}`}>
            {recommendation.confidence.toFixed(0)}%
          </p>
        </div>
      </div>
      
      {recommendation.reasoning && recommendation.reasoning.length > 0 && (
        <div className="mt-4 pt-4 border-t border-current/20">
          <p className="text-sm font-medium mb-2">Key Factors:</p>
          <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
            {recommendation.reasoning.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default RecommendationCard

