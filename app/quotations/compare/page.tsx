export default function CompareQuotationsPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Compare Bids: RFQ-0023</h1>
      <div className="overflow-x-auto bg-white border rounded-lg p-6">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Attribute</th>
              <th className="bg-emerald-50 text-emerald-950 font-semibold p-2">Vendor A (Lowest Bid)</th>
              <th className="p-2">Vendor B</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3 font-medium">Price</td>
              <td className="bg-emerald-100 text-emerald-900 font-bold p-2">$11,800.00</td>
              <td className="p-2">$12,450.00</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 font-medium">Delivery</td>
              <td className="p-2">14 days</td>
              <td className="p-2">7 days</td>
            </tr>
            <tr>
              <td className="py-3 font-medium">Action</td>
              <td className="p-2"><button className="px-3 py-1 bg-indigo-600 text-white rounded text-xs">Approve Bid</button></td>
              <td className="p-2"><button className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-xs">Approve Bid</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}