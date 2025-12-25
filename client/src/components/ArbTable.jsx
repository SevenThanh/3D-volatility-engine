export default function ArbTable({ opportunities }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Arbitrage Opportunities</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left p-2">Type</th>
            <th className="text-left p-2">Details</th>
            <th className="text-left p-2">Profit Score</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((opp, i) => (
            <tr key={i} className="border-b border-gray-700">
              <td className="p-2">{opp.type}</td>
              <td className="p-2">{opp.details}</td>
              <td className="p-2">{opp.profit_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}