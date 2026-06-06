import { PoService } from "@/lib/services/po.service";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function PurchaseOrderDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;
  const isAdmin = role !== "Vendor";

  const po = await PoService.getPOById(params.id);

  if (!po) {
    notFound();
  }

  // Ensure vendors can't see other vendors' POs
  if (!isAdmin && po.vendorId !== (session.user as any).id) {
    redirect("/purchase-orders");
  }

  return (
    <div className="p-8 font-sans max-w-5xl mx-auto space-y-8">
      <Link href="/purchase-orders" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Purchase Orders
      </Link>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700 tracking-tight">{po.poNumber}</h1>
            <p className="text-slate-500 mt-1">Status: <span className="font-semibold text-slate-800">{po.status}</span></p>
            <p className="text-slate-500 text-sm mt-1">Issued on: {new Date(po.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-col md:items-end gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-slate-900">${Number(po.totalAmount).toLocaleString()}</p>
            </div>
            {!isAdmin && po.status === 'Issued' && (
              <form action={async () => {
                "use server";
                const { generateInvoiceAction } = await import("@/app/invoices/actions");
                await generateInvoiceAction(po.poNumber);
              }}>
                <button type="submit" className="mt-2 px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 shadow-sm transition-colors">
                  Generate Invoice
                </button>
              </form>
            )}
            {po.status === 'Invoiced' && po.invoices && po.invoices.length > 0 && (
              <Link href={`/invoices`} className="mt-2 px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 shadow-sm transition-colors">
                View Invoice
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Issued To (Vendor)</h3>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p className="font-bold text-slate-900 text-lg mb-1">{po.vendor.companyName}</p>
              <p className="text-slate-600 text-sm">{po.vendor.email}</p>
              <p className="text-slate-600 text-sm">{po.vendor.phone}</p>
              <p className="text-slate-500 text-xs mt-2 font-mono">GST: {po.vendor.gstNumber}</p>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Reference RFQ</h3>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p className="font-bold text-slate-900 text-lg mb-1">{po.quotation.rfq.title}</p>
              <p className="text-slate-600 text-sm">Category: {po.quotation.rfq.category}</p>
              <Link href={`/rfqs/${po.quotation.rfq.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2 inline-block">
                View Original RFQ &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Line Items</h3>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-3 font-semibold text-slate-700">Item Description</th>
                  <th className="px-6 py-3 font-semibold text-slate-700">Unit Price</th>
                  <th className="px-6 py-3 font-semibold text-slate-700">Quantity</th>
                  <th className="px-6 py-3 font-semibold text-slate-700 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {po.quotation.lineItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">{item.rfqItem.item}</td>
                    <td className="px-6 py-4 text-slate-600">${Number(item.unitPrice).toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-600">{item.rfqItem.qty} {item.rfqItem.unit}</td>
                    <td className="px-6 py-4 text-slate-800 font-semibold text-right">${Number(item.totalPrice).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
