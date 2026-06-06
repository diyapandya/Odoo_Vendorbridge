import Link from 'next/link';

export default function RfqsPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Request for Quotations (RFQs)</h1>
        <Link href="/rfqs/new" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Create RFQ</Link>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="pb-3">RFQ ID</th>
              <th className="pb-3">Title</th>
              <th className="pb-3">Items/Quantity</th>
              <th className="pb-3">Deadline</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3">RFQ-0023</td>
              <td className="font-semibold text-slate-900">Office Server Hardware</td>
              <td>3x Rack Server Unit</td>
              <td>June 30, 2026</td>
              <td><span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Open</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}