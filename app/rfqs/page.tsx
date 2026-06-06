import Link from 'next/link';
import { RFQService } from "@/lib/services/rfq.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RfqsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;
  const userId = (session.user as any).id;
  const isAdmin = role !== "Vendor";

  const rfqs = isAdmin 
    ? await RFQService.getAllRFQs() 
    : await RFQService.getOpenRFQs();

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Request for Quotations (RFQs)</h1>
        {isAdmin && (
          <Link href="/rfqs/new" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm">
            Create RFQ
          </Link>
        )}
      </div>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 font-semibold text-slate-900">RFQ Title</th>
                <th className="pb-3 font-semibold text-slate-900">Category</th>
                <th className="pb-3 font-semibold text-slate-900">Items (Total Qty)</th>
                {isAdmin && <th className="pb-3 font-semibold text-slate-900">Assigned Vendors</th>}
                <th className="pb-3 font-semibold text-slate-900">Deadline</th>
                <th className="pb-3 font-semibold text-slate-900">Status</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {rfqs.length > 0 ? rfqs.map((rfq: any) => (
                <tr key={rfq.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="py-4 font-medium text-slate-900">{rfq.title}</td>
                  <td className="py-4 text-slate-600">{rfq.category}</td>
                  <td className="py-4 text-slate-600">
                    <span className="font-medium text-slate-800">{rfq.lineItems.length}</span> items 
                    <span className="text-xs text-slate-400 block mt-0.5">
                      ({rfq.lineItems.reduce((acc: number, item: any) => acc + item.qty, 0)} units total)
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="py-4 text-slate-600">
                      <span className="inline-flex items-center justify-center bg-slate-100 text-slate-700 h-6 px-2 rounded-md font-medium text-xs">
                        {rfq.vendors.length} vendors
                      </span>
                    </td>
                  )}
                  <td className="py-4 text-slate-600">{new Date(rfq.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                      rfq.status === 'Open' ? 'bg-green-100 text-green-800 border border-green-200' :
                      rfq.status === 'Draft' ? 'bg-slate-100 text-slate-800 border border-slate-200' :
                      'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      {rfq.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    {isAdmin && rfq.status === 'Draft' && (
                      <Link href={`/rfqs/${rfq.id}/edit`} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">
                        Edit Draft
                      </Link>
                    )}
                    {!isAdmin && rfq.status === 'Open' && (
                      <Link href={`/quotations/new/${rfq.id}`} className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 rounded-md hover:bg-indigo-50 font-medium text-sm transition-colors">
                        Submit Quotation
                      </Link>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="py-12 text-center text-slate-500 bg-slate-50/50 rounded-lg">
                    {isAdmin ? 'No RFQs found. Click "Create RFQ" to get started.' : 'No Open RFQs found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}