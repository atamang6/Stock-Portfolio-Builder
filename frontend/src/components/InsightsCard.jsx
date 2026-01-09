import React from 'react'

function InsightsCard({ insights }) {
  if (!insights || insights.length === 0) {
    return null
  }

  return (
    <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Key Insights</h3>
      <ul className="space-y-2">
        {insights.map((insight, index) => (
          <li key={index} className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span className="text-sm text-gray-700">{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default InsightsCard

