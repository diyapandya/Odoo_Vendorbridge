import { AnalyticsService } from "@/lib/services/analytics.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;
  const userId = (session.user as any).id;
  const isAdmin = role !== "Vendor";

  const adminStats = isAdmin ? await AnalyticsService.getAdminDashboardStats() : null;
  const vendorStats = !isAdmin ? await AnalyticsService.getVendorDashboardStats(userId) : null;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-sans">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics & Reports</h1>
        <p className="text-slate-500 mt-1">{isAdmin ? 'Platform-wide procurement statistics' : 'Your performance and financial statistics'}</p>
      </div>

      {isAdmin && adminStats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Spend</h3>
              <p className="text-3xl font-bold text-indigo-700">${adminStats.totalSpend.toLocaleString()}</p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Paid</h3>
              <p className="text-3xl font-bold text-green-600">${adminStats.totalPaid.toLocaleString()}</p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Active POs</h3>
              <p className="text-3xl font-bold text-slate-900">{adminStats.activePOs}</p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Registered Vendors</h3>
              <p className="text-3xl font-bold text-slate-900">{adminStats.vendorCount}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Top Vendors by Spend</h2>
              {adminStats.topVendors.length > 0 ? (
                <div className="space-y-4">
                  {adminStats.topVendors.map((vendor, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                        <span className="font-semibold text-slate-700">{vendor.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">${vendor.spend.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No spend data available yet.</p>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6">System Overview</h2>
              <ul className="space-y-6">
                <li className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <span className="text-slate-600 font-medium">Total RFQs Created</span>
                  <span className="text-xl font-bold text-slate-900">{adminStats.rfqCount}</span>
                </li>
                <li className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <span className="text-slate-600 font-medium">Total POs Issued</span>
                  <span className="text-xl font-bold text-slate-900">{adminStats.poCount}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Outstanding Balance</span>
                  <span className="text-xl font-bold text-amber-600">${(adminStats.totalSpend - adminStats.totalPaid).toLocaleString()}</span>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}

      {!isAdmin && vendorStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Awarded</h3>
            <p className="text-3xl font-bold text-indigo-700">${vendorStats.totalAwarded.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Paid</h3>
            <p className="text-3xl font-bold text-green-600">${vendorStats.totalPaid.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Pending Invoices</h3>
            <p className="text-3xl font-bold text-amber-600">{vendorStats.pendingInvoices}</p>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">POs Awarded</h3>
            <p className="text-3xl font-bold text-slate-900">{vendorStats.poCount}</p>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Quotations Submitted</h3>
            <p className="text-3xl font-bold text-slate-900">{vendorStats.quotationCount}</p>
          </div>
        </div>
      )}
    </div>
  );
}