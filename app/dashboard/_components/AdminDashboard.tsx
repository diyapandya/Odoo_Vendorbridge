"use client";

import { Card } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface AdminDashboardProps {
  data: {
    kpis: {
      totalVendors: number;
      openRFQs: number;
      pendingApprovals: number;
      totalPOAmount: number;
    };
    recentPOs: any[];
    chartData: { name: string; amount: number; }[];
  }
}

export function AdminDashboard({ data }: AdminDashboardProps) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Procurement Dashboard</h1>
      
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total Vendors" value={data.kpis.totalVendors.toString()} subtitle="Registered on platform" />
        <Card title="Open RFQs" value={data.kpis.openRFQs.toString()} subtitle="Currently accepting bids" />
        <Card title="Pending Approvals" value={data.kpis.pendingApprovals.toString()} subtitle="Action required" />
        <Card title="Total Invoiced (POs)" value={formatCurrency(data.kpis.totalPOAmount)} subtitle="Lifetime value" />
      </div>

      {/* Tables and Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent POs Table */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4 text-slate-900">Recent Purchase Orders</h2>
          <div className="overflow-x-auto">
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
                {data.recentPOs.length > 0 ? (
                  data.recentPOs.map(po => (
                    <tr key={po.poNumber} className="border-b border-slate-50 last:border-0">
                      <td className="py-3 font-medium text-blue-600">{po.poNumber}</td>
                      <td>{po.vendor?.companyName || 'Unknown Vendor'}</td>
                      <td>{formatCurrency(Number(po.totalAmount))}</td>
                      <td>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          po.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          po.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {po.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-500">No recent purchase orders.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Spending Trends Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4 text-slate-900">Spending Trends</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

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
    </div>
  );
}
