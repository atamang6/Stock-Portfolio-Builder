/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'buy': '#10b981',
        'hold': '#f59e0b',
        'avoid': '#ef4444',
      }
    },
  },
  plugins: [],
}

