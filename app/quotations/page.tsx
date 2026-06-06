import Link from 'next/link';

export default function QuotationsPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Vendor Quotations</h1>
        <Link href="/quotations/compare" className="px-4 py-2 bg-emerald-600 text-white rounded-md">Compare Bids</Link>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="pb-3">Quotation ID</th>
              <th className="pb-3">RFQ</th>
              <th className="pb-3">Vendor</th>
              <th className="pb-3">Price Bid</th>
              <th className="pb-3">Delivery Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3">QT-551</td>
              <td>RFQ-0023 (Office Server Hardware)</td>
              <td>TechSolutions Inc</td>
              <td>$11,800.00</td>
              <td>14 days</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}