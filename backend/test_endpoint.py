"""
Test script to verify the daily-picks endpoint works
Run this to diagnose issues
"""

import sys
import traceback

print("Testing imports...")

try:
    print("  - Importing daily_stock_picker...")
    from daily_stock_picker import DailyStockPicker
    print("  ✓ daily_stock_picker imported successfully")
except Exception as e:
    print(f"  ✗ Failed to import daily_stock_picker: {e}")
    print(traceback.format_exc())
    sys.exit(1)

try:
    print("  - Creating DailyStockPicker instance...")
    picker = DailyStockPicker()
    print("  ✓ DailyStockPicker created successfully")
except Exception as e:
    print(f"  ✗ Failed to create DailyStockPicker: {e}")
    print(traceback.format_exc())
    sys.exit(1)

try:
    print("\nTesting get_top_stocks_list...")
    tickers = picker.get_top_stocks_list()
    print(f"  ✓ Found {len(tickers)} stocks to analyze")
    print(f"  Sample: {tickers[:5]}")
except Exception as e:
    print(f"  ✗ Failed: {e}")
    print(traceback.format_exc())

try:
    print("\nTesting analyze_and_rank with 2 stocks (this may take a moment)...")
    results = picker.analyze_and_rank(tickers=tickers[:2], top_n=2)
    print(f"  ✓ Successfully analyzed and ranked {len(results)} stocks")
    if results:
        print(f"  Sample result: {results[0]['ticker']} - Score: {results[0]['total_score']}")
except Exception as e:
    print(f"  ✗ Failed: {e}")
    print(traceback.format_exc())

print("\n" + "="*50)
print("If all tests passed, the endpoint should work!")
print("Make sure the backend is restarted after any code changes.")
print("="*50)

