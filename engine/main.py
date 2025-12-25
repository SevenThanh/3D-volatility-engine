from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from core.bs_solver import get_implied_vol
from core.surface import build_surface
from core.arb_check import detect_arbitrage
import yfinance as yf
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/calculate/{ticker}")
async def calculate_surface(ticker: str, risk_free_rate: float = Query(0.05)):
    stock = yf.Ticker(ticker)
    spot_price = stock.history(period="1d")['Close'].iloc[-1]
    options_data = stock.options
    
    if not options_data:
        return {"error": "No options data available"}
    
    all_rows = []
    for expiry in options_data[:6]: 
        chain = stock.option_chain(expiry)
        calls = chain.calls
        
        calls = calls[(calls['volume'] > 5) & (calls['bid'] > 0)]
        
        for _, row in calls.iterrows():
            iv = get_implied_vol(
                row['lastPrice'],
                spot_price,
                row['strike'],
                pd.Timestamp(expiry),
                risk_free_rate
            )
            if iv:
                all_rows.append({
                    'strike': row['strike'],
                    'expiry': expiry,
                    'iv': iv
                })
    
    surface_data = build_surface(all_rows, spot_price)
    arb_opportunities = detect_arbitrage(all_rows)
    
    return {
        "ticker": ticker,
        "spot_price": float(spot_price),
        "surface_data": surface_data,
        "arbitrage_opportunities": arb_opportunities
    }

@app.get("/health")
async def health():
    return {"status": "online"}