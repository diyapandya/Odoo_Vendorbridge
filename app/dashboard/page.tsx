import { Navbar } from "@/components/ui/navbar";
import { Sidebar } from "@/components/ui/sidebar";

export default function DashboardPage() {
  const dashboardData = {
    activeRFQs: 12,
    pendingApprovals: 5,
    monthlyPOs: "$ 2.3L",
    overdueInvoices: 3,
  };

  const purchaseOrders = [
    {
      po: "PO1",
      vendor: "Infra",
      amount: "$7900",
      status: "Approved",
    },
    {
      po: "PO2",
      vendor: "Tech Core",
      amount: "$4000",
      status: "Pending",
    },
    {
      po: "PO3",
      vendor: "OfficeNeed Co",
      amount: "$3400",
      status: "Draft",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>

          <p className="mt-2 text-slate-600">
            Welcome back, Procurement Officer - Today's Overview
          </p>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm">
              <h2 className="text-3xl font-bold">{dashboardData.activeRFQs}</h2>
              <p className="text-sm text-slate-500">Active RFQs</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm">
              <h2 className="text-3xl font-bold">
                {dashboardData.pendingApprovals}
              </h2>
              <p className="text-sm text-slate-500">Pending Approvals</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm">
              <h2 className="text-3xl font-bold">{dashboardData.monthlyPOs}</h2>
              <p className="text-sm text-slate-500">PO's this month</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm">
              <h2 className="text-3xl font-bold">
                {dashboardData.overdueInvoices}
              </h2>
              <p className="text-sm text-slate-500">Overdue Invoices</p>
            </div>
          </div>

          {/* Table + Analytics */}
          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-4">
                Recent Purchase Orders
              </h2>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">PO#</th>
                    <th className="text-left py-2">Vendor</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {purchaseOrders.map((po, index) => (
                    <tr key={index}>
                      <td className="py-3">{po.po}</td>
                      <td>{po.vendor}</td>
                      <td>{po.amount}</td>
                      <td>{po.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-4">Spending Trends</h2>

              <div className="h-60 bg-slate-100 rounded-lg flex items-center justify-center">
                Analytics Chart Area
              </div>
            </div>
          </div>

          <div className="border-t border-slate-300 my-8"></div>

          <div className="flex gap-4">
            <button className="px-5 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-100">
              + New RFQ
            </button>

            <button className="px-5 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-100">
              Add Vendor
            </button>

            <button className="px-5 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-100">
              View Invoices
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
