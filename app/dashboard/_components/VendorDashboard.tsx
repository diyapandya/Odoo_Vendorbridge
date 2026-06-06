"use client";

import { Card } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useState } from 'react';
import { completeVendorProfile } from '@/actions/vendor';

interface VendorDashboardProps {
  data: {
    isVendorSetupComplete: boolean;
    kpis: {
      myQuotations: number;
      awardedPOs: number;
      pendingRFQs: number;
    } | null;
    recentRFQs: any[];
  }
}

// Dummy data for quotation trends
const mockChartData = [
  { name: 'W1', bids: 2 },
  { name: 'W2', bids: 5 },
  { name: 'W3', bids: 3 },
  { name: 'W4', bids: 8 },
];

export function VendorDashboard({ data }: VendorDashboardProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleProfileComplete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await completeVendorProfile(formData);
    
    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  }

  if (!data.isVendorSetupComplete || !data.kpis) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto mt-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome to VendorBridge!</h1>
        
        <div className="bg-white border border-slate-200 shadow-sm p-8 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-slate-800">Complete Your Company Profile</h2>
          <p className="text-slate-500 mb-6">
            To view your dashboard and start bidding on RFQs, we need a few more details about your business.
          </p>

          <form onSubmit={handleProfileComplete} className="space-y-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <input 
                id="companyName" 
                name="companyName" 
                type="text" 
                required 
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Acme Corp"
              />
            </div>
            
            <div>
              <label htmlFor="gstNumber" className="block text-sm font-medium text-slate-700 mb-1">GST/Tax ID Number</label>
              <input 
                id="gstNumber" 
                name="gstNumber" 
                type="text" 
                required 
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 22AAAAA0000A1Z5"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Primary Category</label>
              <select 
                id="category" 
                name="category" 
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select a category</option>
                <option value="Hardware">Hardware & Electronics</option>
                <option value="Software">Software & IT Services</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Logistics">Logistics & Transportation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Company Phone Number</label>
              <input 
                id="phone" 
                name="phone" 
                type="tel" 
                required 
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Complete Profile & Continue'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Vendor Dashboard</h1>
      
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="My Quotations" value={data.kpis.myQuotations.toString()} subtitle="Total submitted bids" />
        <Card title="Awarded POs" value={data.kpis.awardedPOs.toString()} subtitle="Successfully won" />
        <Card title="Open RFQs" value={data.kpis.pendingRFQs.toString()} subtitle="Available to bid" />
      </div>

      {/* Tables and Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available RFQs Table */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4 text-slate-900">Recent Opportunities (RFQs)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 pb-2">
                  <th className="py-2">Title</th>
                  <th>Quantity</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentRFQs.length > 0 ? (
                  data.recentRFQs.map(rfq => (
                    <tr key={rfq.id} className="border-b border-slate-50 last:border-0">
                      <td className="py-3 font-medium text-blue-600">{rfq.title}</td>
                      <td>{rfq.quantity}</td>
                      <td>{new Date(rfq.deadline).toLocaleDateString()}</td>
                      <td>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                          {rfq.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-500">No open RFQs available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Bidding Trends Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4 text-slate-900">Bidding Activity (Mock)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="bids" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
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
