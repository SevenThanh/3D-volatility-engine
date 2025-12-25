import { useState } from 'react';
import SurfacePlot from './components/SurfacePlot';
import ControlPanel from './components/ControlPanel';
import ArbTable from './components/ArbTable';
import { getSurface, saveSnapshot } from './services/api';

function App() {
  const [surfaceData, setSurfaceData] = useState(null);
  const [loading, setLoading] = useState(false);``
  const [error, setError] = useState(null);

  const handleFetch = async (ticker, riskFreeRate) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSurface(ticker, riskFreeRate);
      setSurfaceData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!surfaceData) return;
    try {
      await saveSnapshot(surfaceData);
      alert('Snapshot saved');
    } catch (err) {
      alert('Save failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">3D Implied Volatility Surface</h1>
      
      <ControlPanel onFetch={handleFetch} loading={loading} />
      
      {error && (
        <div className="bg-red-900 p-4 rounded mb-4">{error}</div>
      )}
      
      {surfaceData && (
        <>
          <div className="mb-4">
            <button onClick={handleSave} className="bg-blue-600 px-4 py-2 rounded">
              Save Snapshot
            </button>
          </div>
          
          <SurfacePlot data={surfaceData.surface_data} ticker={surfaceData.ticker} />
          
          {surfaceData.arbitrage_opportunities?.length > 0 && (
            <ArbTable opportunities={surfaceData.arbitrage_opportunities} />
          )}
        </>
      )}
    </div>
  );
}

export default App;