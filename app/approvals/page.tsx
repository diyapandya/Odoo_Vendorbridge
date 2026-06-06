export default function ApprovalsPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Approval Workflow Engine</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="bg-white border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">RFQ-0023 Server Acquisition ($11,800)</h2>
            <p className="text-slate-600 text-sm">Requested by Procurement Officer John Doe. Lowest bid selected.</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium">Approve</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium">Reject</button>
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Workflow Timeline</h3>
          <div className="border-l-2 border-indigo-200 pl-4 space-y-4 text-xs">
            <div>
              <p className="font-bold">Officer Initiated</p>
              <p className="text-slate-500">June 6, 2026 - 9:30 AM</p>
            </div>
            <div>
              <p className="font-bold text-amber-600">Pending Manager Review</p>
              <p className="text-slate-500">Current Step</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}