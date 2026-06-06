export default function ActivityPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Activity Log & Audit Trail</h1>
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-start border-b pb-4">
          <div>
            <p className="font-semibold text-slate-900">RFQ-0023 Approved</p>
            <p className="text-xs text-slate-500">By Manager Alice Smith</p>
          </div>
          <span className="text-xs text-slate-400">2 hours ago</span>
        </div>
        <div className="flex justify-between items-start border-b pb-4">
          <div>
            <p className="font-semibold text-slate-900">Quotation Submitted by TechSolutions Inc</p>
            <p className="text-xs text-slate-500">Pricing bid $11,800.00 registered</p>
          </div>
          <span className="text-xs text-slate-400">5 hours ago</span>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-slate-900">User Registered: Procurement Officer John Doe</p>
            <p className="text-xs text-slate-500">Profile assigned to Procurement Office Team</p>
          </div>
          <span className="text-xs text-slate-400">1 day ago</span>
        </div>
      </div>
    </div>
  );
}