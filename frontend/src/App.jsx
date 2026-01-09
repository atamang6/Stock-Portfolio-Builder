import React, { useState } from 'react'
import StockSearch from './components/StockSearch'
import StockDashboard from './components/StockDashboard'
import StockScreener from './components/StockScreener'
import DailyPicks from './components/DailyPicks'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('daily-picks')

  const handleAnalyze = async (ticker) => {
    setLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      // Use relative URL so Vite dev-server proxy (`/api` -> `http://localhost:8000`) works.
      // This avoids hard-coding ports and reduces CORS issues in dev.
      const response = await fetch(`/api/analyze/${ticker}`)
      
      if (!response.ok) {
        // Try to get error message, but handle empty responses
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail || errorMessage
        } catch (e) {
          // Response might not be JSON, get text instead
          const text = await response.text()
          if (text) {
            errorMessage = text
          }
        }
        throw new Error(errorMessage)
      }

      // Check if response has content before parsing
      const text = await response.text()
      if (!text || text.trim().length === 0) {
        throw new Error('Backend returned empty response. The server may have crashed or timed out.')
      }

      let data
      try {
        data = JSON.parse(text)
      } catch (parseError) {
        throw new Error(`Invalid response from server: ${text.substring(0, 100)}...`)
      }

      setAnalysis(data)
    } catch (err) {
      // Provide more helpful error messages
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Cannot connect to backend server. Make sure the backend is running on http://localhost:8000')
      } else if (err.message.includes('Unexpected end of JSON') || err.message.includes('empty response')) {
        setError('Backend returned an invalid response. Please check the backend terminal for errors and try again.')
      } else {
        setError(err.message || 'An unknown error occurred. Please check the backend server.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Stock Analysis & Decision Support
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Comprehensive stock analysis with fundamental, valuation, technical, and risk metrics
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <ul className="flex space-x-1 border-b border-gray-200">
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('daily-picks')}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'daily-picks'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Daily Top 10 Picks
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('analyze')}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'analyze'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Single Stock Analysis
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('screener')}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'screener'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Stock Screener
              </button>
            </li>
          </ul>
        </div>

        {activeTab === 'analyze' && (
          <>
            <StockSearch onAnalyze={handleAnalyze} />
            
            {loading && <LoadingSpinner />}
            
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {analysis && <StockDashboard analysis={analysis} />}
          </>
        )}

        {activeTab === 'screener' && <StockScreener />}

        {activeTab === 'daily-picks' && <DailyPicks />}
      </main>

      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            This tool is for informational purposes only and does not constitute financial advice.
            Always conduct your own research before making investment decisions.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

