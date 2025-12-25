import numpy as np
from scipy.stats import norm
from datetime import datetime
import pandas as pd

def black_scholes(S, K, T, r, sigma):
    if T <= 0:
        return max(S - K, 0)
    
    d1 = (np.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    return S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)

def vega(S, K, T, r, sigma):
    if T <= 0:
        return 0
    d1 = (np.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * np.sqrt(T))
    return S * norm.pdf(d1) * np.sqrt(T)

def get_implied_vol(market_price, S, K, expiry_date, r):
    T = (pd.Timestamp(expiry_date) - pd.Timestamp.now()).days / 365.0
    
    if T <= 0 or market_price <= 0:
        return None
    
    sigma = 0.5
    for _ in range(15):
        price = black_scholes(S, K, T, r, sigma)
        v = vega(S, K, T, r, sigma)
        
        if v < 1e-10:
            break
        diff = market_price - price
        if abs(diff) < 1e-5:
            return sigma
        sigma = sigma + diff / v
        sigma = max(0.01, min(sigma, 5.0)) 
    
    return sigma if 0.01 < sigma < 5.0 else None
