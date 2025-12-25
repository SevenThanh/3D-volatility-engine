import numpy as np
from scipy.interpolate import SmoothBivariateSpline

def build_surface(rows, spot_price):
    if len(rows) < 4:
        return {"x": [], "y": [], "z": []}
    
    strikes = [r['strike'] for r in rows]
    expiries = [(pd.Timestamp(r['expiry']) - pd.Timestamp.now()).days for r in rows]
    ivs = [r['iv'] for r in rows]
    
    moneyness = [s / spot_price for s in strikes]
    
    try:
        spline = SmoothBivariateSpline(moneyness, expiries, ivs, kx=2, ky=2, s=0.01)
        
        x_grid = np.linspace(min(moneyness), max(moneyness), 30)
        y_grid = np.linspace(min(expiries), max(expiries), 30)
        z_grid = spline(x_grid, y_grid)
        
        return {
            "x": (x_grid * spot_price).tolist(),
            "y": y_grid.tolist(),
            "z": z_grid.tolist()
        }
    except:
        return {"x": [], "y": [], "z": []}

import pandas as pd