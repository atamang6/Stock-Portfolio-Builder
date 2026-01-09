import React from 'react'

function ValuationCard({ valuation }) {
  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined) return 'N/A'
    return value.toFixed(decimals)
  }

  const getValuationColor = (status) => {
    switch (status) {
      case 'Undervalued':
        return 'text-green-600'
      case 'Fair':
        return 'text-yellow-600'
      case 'Overvalued':
        return 'text-red-600'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Valuation Analysis</h3>
      
      <div className="space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <p className="text-xs text-gray-500 mb-1">Current Price</p>
          <p className="text-lg font-semibold text-gray-900">
            ${formatNumber(valuation.current_price)}
          </p>
        </div>

        {valuation.fair_value_estimate && (
          <div className="border-b border-gray-100 pb-3">
            <p className="text-xs text-gray-500 mb-1">Fair Value Estimate</p>
            <p className="text-lg font-semibold text-gray-900">
              ${formatNumber(valuation.fair_value_estimate)}
            </p>
            {valuation.valuation_method && (
              <p className="text-xs text-gray-400 mt-1">{valuation.valuation_method}</p>
            )}
          </div>
        )}

        {valuation.price_to_fair_value && (
          <div className="border-b border-gray-100 pb-3">
            <p className="text-xs text-gray-500 mb-1">Price to Fair Value</p>
            <p className={`text-lg font-semibold ${
              valuation.price_to_fair_value < 0.9 ? 'text-green-600' :
              valuation.price_to_fair_value > 1.1 ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {formatNumber(valuation.price_to_fair_value)}
            </p>
            {valuation.price_to_fair_value < 0.9 && (
              <p className="text-xs text-green-600 mt-1">
                Trading at discount
              </p>
            )}
            {valuation.price_to_fair_value > 1.1 && (
              <p className="text-xs text-red-600 mt-1">
                Trading at premium
              </p>
            )}
          </div>
        )}

        {valuation.historical_pe_avg && (
          <div className="border-b border-gray-100 pb-3">
            <p className="text-xs text-gray-500 mb-1">Historical P/E Average</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatNumber(valuation.historical_pe_avg)}
            </p>
          </div>
        )}

        {valuation.industry_pe_avg && (
          <div className="border-b border-gray-100 pb-3">
            <p className="text-xs text-gray-500 mb-1">Industry P/E Average</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatNumber(valuation.industry_pe_avg)}
            </p>
          </div>
        )}

        {valuation.price_vs_historical && (
          <div>
            <p className="text-xs text-gray-500 mb-1">vs Historical Average</p>
            <p className={`text-sm font-semibold ${getValuationColor(valuation.price_vs_historical)}`}>
              {valuation.price_vs_historical}
            </p>
          </div>
        )}

        {valuation.price_vs_industry && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">vs Industry Average</p>
            <p className={`text-sm font-semibold ${getValuationColor(valuation.price_vs_industry)}`}>
              {valuation.price_vs_industry}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ValuationCard

