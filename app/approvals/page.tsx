import { QuotationService } from "@/lib/services/quotation.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { approveQuotationAction, rejectQuotationAction } from "./actions";

export default async function ApprovalsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;
  if (role === "Vendor") {
    redirect("/dashboard");
  }

  const pendingQuotations = await QuotationService.getPendingQuotations();

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Approval Workflow Engine</h1>
      <p className="text-slate-600">Review submitted vendor quotations and approve them to automatically generate Purchase Orders.</p>

      {pendingQuotations.length === 0 ? (
        <div className="bg-white border rounded-lg p-12 text-center shadow-sm">
          <p className="text-slate-500 text-lg">No pending quotations require approval right now. 🎉</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pendingQuotations.map(quote => (
            <div key={quote.id} className="bg-white border rounded-lg p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-slate-900">{quote.rfq.title}</h2>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-bold uppercase tracking-wider">{quote.status}</span>
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">Vendor:</span> {quote.vendor.companyName} &bull; 
                  <span className="font-semibold text-slate-800 ml-2">Total Bid:</span> ${Number(quote.totalAmount || quote.price).toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">
                  Submitted on {new Date(quote.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Link href={`/rfqs/${quote.rfqId}`} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md text-sm font-medium transition-colors">
                  View RFQ Details
                </Link>
                <form action={async () => {
                  "use server";
                  await rejectQuotationAction(quote.id);
                }}>
                  <button type="submit" className="px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors">
                    Reject
                  </button>
                </form>
                <form action={async () => {
                  "use server";
                  await approveQuotationAction(quote.id);
                }}>
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md text-sm font-medium transition-colors shadow-sm">
                    Approve to PO
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}