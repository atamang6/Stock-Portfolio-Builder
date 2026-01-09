import React from 'react'
import RecommendationCard from './RecommendationCard'
import FundamentalsCard from './FundamentalsCard'
import ValuationCard from './ValuationCard'
import TechnicalsCard from './TechnicalsCard'
import RiskCard from './RiskCard'
import InsightsCard from './InsightsCard'
import ScoreBreakdown from './ScoreBreakdown'

function StockDashboard({ analysis }) {
  const getActionColor = (action) => {
    switch (action) {
      case 'Buy':
        return 'text-buy'
      case 'Hold':
        return 'text-hold'
      case 'Avoid':
        return 'text-avoid'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {analysis.company_name || analysis.ticker}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {analysis.ticker} {analysis.sector && `• ${analysis.sector}`} {analysis.industry && `• ${analysis.industry}`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Current Price</p>
            <p className="text-2xl font-bold text-gray-900">
              ${analysis.valuation?.current_price?.toFixed(2) || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <RecommendationCard recommendation={analysis.recommendation} />

      {/* Score Breakdown */}
      <ScoreBreakdown scoring={analysis.scoring} />

      {/* Insights */}
      <InsightsCard insights={analysis.insights} />

      {/* Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FundamentalsCard fundamentals={analysis.fundamentals} />
        <ValuationCard valuation={analysis.valuation} />
        <TechnicalsCard technicals={analysis.technicals} />
        <RiskCard risk={analysis.risk} />
      </div>
    </div>
  )
}

export default StockDashboard

