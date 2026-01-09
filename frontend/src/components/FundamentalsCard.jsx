import React from 'react'

function FundamentalsCard({ fundamentals }) {
  const formatNumber = (value, decimals = 2, suffix = '') => {
    if (value === null || value === undefined) return 'N/A'
    if (Math.abs(value) >= 1e9) return `${(value / 1e9).toFixed(decimals)}B${suffix}`
    if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(decimals)}M${suffix}`
    if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(decimals)}K${suffix}`
    return `${value.toFixed(decimals)}${suffix}`
  }

  const getColorClass = (value, thresholds) => {
    if (value === null || value === undefined) return 'text-gray-500'
    if (value >= thresholds.good) return 'text-green-600'
    if (value >= thresholds.ok) return 'text-yellow-600'
    return 'text-red-600'
  }

  const metrics = [
    {
      label: 'Revenue Growth (YoY)',
      value: fundamentals.revenue_growth_yoy,
      format: (v) => `${formatNumber(v, 1)}%`,
      color: getColorClass(fundamentals.revenue_growth_yoy, { good: 10, ok: 5 })
    },
    {
      label: 'Revenue Growth (5Y CAGR)',
      value: fundamentals.revenue_growth_5y_cagr,
      format: (v) => `${formatNumber(v, 1)}%`,
      color: getColorClass(fundamentals.revenue_growth_5y_cagr, { good: 10, ok: 5 })
    },
    {
      label: 'EPS Growth',
      value: fundamentals.eps_growth,
      format: (v) => `${formatNumber(v, 1)}%`,
      color: getColorClass(fundamentals.eps_growth, { good: 10, ok: 5 })
    },
    {
      label: 'P/E Ratio',
      value: fundamentals.pe_ratio,
      format: (v) => formatNumber(v, 2),
      color: getColorClass(fundamentals.pe_ratio, { good: 20, ok: 30 })
    },
    {
      label: 'Forward P/E',
      value: fundamentals.forward_pe,
      format: (v) => formatNumber(v, 2),
      color: getColorClass(fundamentals.forward_pe, { good: 20, ok: 30 })
    },
    {
      label: 'PEG Ratio',
      value: fundamentals.peg_ratio,
      format: (v) => formatNumber(v, 2),
      color: getColorClass(fundamentals.peg_ratio, { good: 1.5, ok: 2.0 })
    },
    {
      label: 'ROE',
      value: fundamentals.roe,
      format: (v) => `${formatNumber(v, 1)}%`,
      color: getColorClass(fundamentals.roe, { good: 15, ok: 10 })
    },
    {
      label: 'ROIC',
      value: fundamentals.roic,
      format: (v) => `${formatNumber(v, 1)}%`,
      color: getColorClass(fundamentals.roic, { good: 15, ok: 10 })
    },
    {
      label: 'Debt-to-Equity',
      value: fundamentals.debt_to_equity,
      format: (v) => formatNumber(v, 2),
      color: getColorClass(fundamentals.debt_to_equity, { good: 1.0, ok: 2.0 })
    },
    {
      label: 'Free Cash Flow',
      value: fundamentals.free_cash_flow,
      format: (v) => `$${formatNumber(v, 0)}`,
      color: fundamentals.free_cash_flow > 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      label: 'FCF Margin',
      value: fundamentals.fcf_margin,
      format: (v) => `${formatNumber(v, 1)}%`,
      color: getColorClass(fundamentals.fcf_margin, { good: 10, ok: 5 })
    },
    {
      label: 'Current Ratio',
      value: fundamentals.current_ratio,
      format: (v) => formatNumber(v, 2),
      color: getColorClass(fundamentals.current_ratio, { good: 1.5, ok: 1.0 })
    },
    {
      label: 'Profit Margin',
      value: fundamentals.profit_margin,
      format: (v) => `${formatNumber(v, 1)}%`,
      color: getColorClass(fundamentals.profit_margin, { good: 15, ok: 10 })
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Fundamental Analysis</h3>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="border-b border-gray-100 pb-2">
            <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
            <p className={`text-sm font-semibold ${metric.color}`}>
              {metric.format(metric.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FundamentalsCard

