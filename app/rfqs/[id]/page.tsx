import { RFQService } from "@/lib/services/rfq.service";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function RFQDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;
  const isAdmin = role !== "Vendor";

  const rfq = await RFQService.getRFQById(params.id);

  if (!rfq) {
    notFound();
  }

  return (
    <div className="p-8 font-sans max-w-6xl mx-auto space-y-8">
      <Link href="/rfqs" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to RFQs
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">{rfq.title}</h1>
            <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
              rfq.status === 'Open' ? 'bg-green-100 text-green-800' :
              rfq.status === 'Draft' ? 'bg-slate-100 text-slate-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {rfq.status}
            </span>
          </div>
          <p className="text-slate-500">Category: {rfq.category} &bull; Deadline: {new Date(rfq.deadline).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-3">
          {isAdmin && rfq.status === 'Draft' && (
            <Link href={`/rfqs/${rfq.id}/edit`} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-md hover:bg-slate-50 shadow-sm transition-colors">
              Edit Draft
            </Link>
          )}
          {!isAdmin && rfq.status === 'Open' && (
            <Link href={`/quotations/new/${rfq.id}`} className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 shadow-sm transition-colors">
              Submit Quotation
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Description</h3>
            <p className="text-slate-700 whitespace-pre-wrap">{rfq.description || "No description provided."}</p>
            {rfq.attachments && (
              <div className="mt-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Attachment</h3>
                <a href={rfq.attachments} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                  View Attachment
                </a>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Line Items Requested</h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-3 font-semibold text-slate-600">Item Name</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Quantity</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Unit</th>
                </tr>
              </thead>
              <tbody>
                {rfq.lineItems.map((item, idx) => (
                  <tr key={item.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-800 font-medium">{item.item}</td>
                    <td className="px-6 py-4 text-slate-600">{item.qty}</td>
                    <td className="px-6 py-4 text-slate-600">{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
          {isAdmin && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Assigned Vendors</h3>
              {rfq.vendors.length > 0 ? (
                <ul className="space-y-3">
                  {rfq.vendors.map(vendor => (
                    <li key={vendor.id} className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-800">{vendor.companyName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${vendor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                        {vendor.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">No vendors directly assigned.</p>
              )}
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Quotations Received</h3>
            {rfq.quotations && rfq.quotations.length > 0 ? (
              <ul className="space-y-4">
                {rfq.quotations.map(quote => (
                  <li key={quote.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-slate-500 mb-1">{quote.id.split('-')[0].toUpperCase()}</p>
                      <p className="font-medium text-slate-800">
                        ${Number(quote.totalAmount || quote.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-[10px] uppercase tracking-wider rounded-full font-bold ${
                      quote.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                      quote.status === 'Draft' ? 'bg-slate-200 text-slate-600' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {quote.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No quotations submitted yet.</p>
            )}
            {isAdmin && rfq.quotations && rfq.quotations.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link href="/quotations/compare" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                  Compare all quotations
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
