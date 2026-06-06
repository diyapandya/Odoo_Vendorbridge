export default function InvoicesPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Billing & Invoices</h1>
      <div className="bg-white border rounded-lg p-6">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="pb-3">Invoice #</th>
              <th className="pb-3">PO Reference</th>
              <th className="pb-3">Total + Taxes</th>
              <th className="pb-3">Payment Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3 font-semibold text-slate-900">INV-90223</td>
              <td>PO-2026-0004</td>
              <td>$12,744.00 (Incl. 8% GST)</td>
              <td><span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Unpaid</span></td>
              <td>
                <div className="flex gap-2">
                  <button className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs hover:bg-indigo-100">PDF</button>
                  <button className="px-2 py-1 bg-slate-50 text-slate-600 rounded text-xs hover:bg-slate-100">Send Email</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}