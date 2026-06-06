export default function ReportsPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Procurement & Spend Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-md font-semibold text-slate-900 mb-4">Vendor Performance Indices</h2>
          <div className="h-64 flex items-center justify-center text-slate-400 bg-slate-50 border rounded-md">
            [Chart: Fulfillment Time and Quote Accuracy]
          </div>
        </div>
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-md font-semibold text-slate-900 mb-4">Category Spend Breakdown</h2>
          <div className="h-64 flex items-center justify-center text-slate-400 bg-slate-50 border rounded-md">
            [Chart: Hardware, Software, Services Distribution]
          </div>
        </div>
      </div>
    </div>
  );
}