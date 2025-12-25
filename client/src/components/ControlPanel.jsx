import { useState } from 'react';

export default function ControlPanel({ onFetch, loading }) {
  const [ticker, setTicker] = useState('SPY');
  const [riskFreeRate, setRiskFreeRate] = useState(0.05);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFetch(ticker, riskFreeRate);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg mb-8">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block mb-2">Ticker</label>
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            className="w-full bg-gray-700 px-4 py-2 rounded"
          />
        </div>
        
        <div>
          <label className="block mb-2">Risk-Free Rate</label>
          <input
            type="number"
            step="0.01"
            value={riskFreeRate}
            onChange={(e) => setRiskFreeRate(parseFloat(e.target.value))}
            className="w-full bg-gray-700 px-4 py-2 rounded"
          />
        </div>
        
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            {loading ? 'Calculating...' : 'Generate Surface'}
          </button>
        </div>
      </div>
    </form>
  );
}