import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Procurement Dashboard</h1>
      
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Active RFQs" value="12" subtitle="3 closing today" />
        <Card title="Pending Approvals" value="5" subtitle="Requires action" />
        <Card title="Purchase Orders" value="28" subtitle="Auto-generated this month" />
        <Card title="Total Invoiced" value="$145,200" subtitle="Taxes calculated" />
      </div>

      {/* Tables and Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4 text-slate-900">Recent Purchase Orders</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 pb-2">
                <th className="py-2">PO Number</th>
                <th>Vendor</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">PO-2026-001</td>
                <td>Acme Industrial</td>
                <td>$12,450.00</td>
                <td><span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Approved</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4 text-slate-900">Spending Trends</h2>
          <div className="h-48 flex items-center justify-center text-slate-400 bg-slate-50 border border-dashed rounded-md">
            Chart Area (Spending Summary Trends)
          </div>
        </div>
      </div>
    </div>
  );
}