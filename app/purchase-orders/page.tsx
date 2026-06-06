export default function PurchaseOrdersPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Purchase Orders (PO)</h1>
      <div className="bg-white border rounded-lg p-6">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="pb-3">PO Number</th>
              <th className="pb-3">Approved Quote</th>
              <th className="pb-3">Total Cost</th>
              <th className="pb-3">Delivery ETA</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3 font-semibold text-slate-900">PO-2026-0004</td>
              <td>QT-551 ($11,800.00)</td>
              <td>$11,800.00</td>
              <td>June 20, 2026</td>
              <td><span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending Delivery</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}