import Link from 'next/link';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function QuotationsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;
  const userId = (session.user as any).id;
  const isAdmin = role !== "Vendor";

  const quotations = await db.quotation.findMany({
    where: isAdmin ? undefined : { vendorId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      rfq: true,
      vendor: true
    }
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">{isAdmin ? "Vendor Quotations" : "My Quotations"}</h1>
        {isAdmin && (
          <Link href="/quotations/compare" className="px-4 py-2 bg-emerald-600 text-white rounded-md">Compare Bids</Link>
        )}
      </div>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 font-semibold text-slate-900">Quotation ID</th>
                <th className="pb-3 font-semibold text-slate-900">RFQ</th>
                {isAdmin && <th className="pb-3 font-semibold text-slate-900">Vendor</th>}
                <th className="pb-3 font-semibold text-slate-900">Grand Total</th>
                <th className="pb-3 font-semibold text-slate-900">Status</th>
                <th className="pb-3 font-semibold text-slate-900">Date</th>
              </tr>
            </thead>
            <tbody>
              {quotations.length > 0 ? quotations.map((q) => (
                <tr key={q.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="py-4 font-medium text-slate-900">{q.id.split('-')[0].toUpperCase()}</td>
                  <td className="py-4 text-slate-600">{q.rfq.title}</td>
                  {isAdmin && <td className="py-4 text-slate-600">{q.vendor.companyName}</td>}
                  <td className="py-4 font-medium text-slate-800">
                    ${Number(q.totalAmount || q.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                      q.status === 'Submitted' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      q.status === 'Draft' ? 'bg-slate-100 text-slate-800 border border-slate-200' :
                      q.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="py-4 text-slate-600">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="py-12 text-center text-slate-500 bg-slate-50/50 rounded-lg">
                    No quotations found.
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