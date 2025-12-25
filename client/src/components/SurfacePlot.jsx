import Plot from 'react-plotly.js';

export default function SurfacePlot({ data, ticker }) {
  if (!data || !data.x || data.x.length === 0) {
    return <div className="text-gray-400">No surface data available</div>;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-8">
      <Plot
        data={[
          {
            type: 'surface',
            x: data.x,
            y: data.y,
            z: data.z,
            colorscale: 'Viridis',
            showscale: true
          }
        ]}
        layout={{
          width: 1200,
          height: 700,
          title: `${ticker} Implied Volatility Surface`,
          scene: {
            xaxis: { title: 'Strike Price' },
            yaxis: { title: 'Days to Expiry' },
            zaxis: { title: 'Implied Volatility' }
          },
          paper_bgcolor: '#1f2937',
          plot_bgcolor: '#1f2937',
          font: { color: '#fff' }
        }}
        config={{ responsive: true }}
      />
    </div>
  );
}