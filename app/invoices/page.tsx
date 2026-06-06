import { InvoiceService } from "@/lib/services/invoice.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { markInvoicePaidAction } from "./actions";

import { db } from "@/lib/db";

export default async function InvoicesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;
  const userEmail = session.user.email;
  const isAdmin = role !== "Vendor";

  if (!userEmail) {
    redirect("/login");
  }

  let vendorId: string | undefined = undefined;
  
  if (!isAdmin) {
    const vendor = await db.vendor.findUnique({
      where: { email: userEmail }
    });
    
    if (!vendor) {
      redirect("/dashboard");
    }
    vendorId = vendor.id;
  }

  const invoices = isAdmin 
    ? await InvoiceService.getAllInvoices()
    : await InvoiceService.getInvoicesByVendor(vendorId!);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900">Invoices & Payments</h1>
      <p className="text-slate-600">
        {isAdmin ? "Manage incoming invoices from vendors and process payments." : "Track your submitted invoices and their payment status."}
      </p>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Invoice Number</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Related PO</th>
                {isAdmin && <th className="px-6 py-4 font-semibold text-slate-700">Vendor</th>}
                <th className="px-6 py-4 font-semibold text-slate-700">Tax Amount</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Total Amount</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Date Submitted</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                {isAdmin && <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.length > 0 ? invoices.map((inv) => (
                <tr key={inv.invoiceNumber} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-indigo-600">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-slate-700 font-medium">{inv.poNumber}</td>
                  {isAdmin && <td className="px-6 py-4 text-slate-600">{inv.purchaseOrder.vendor.companyName}</td>}
                  <td className="px-6 py-4 text-slate-500">${Number(inv.taxAmount).toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-800 font-semibold">${Number(inv.totalAmount).toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-bold tracking-wide uppercase ${
                      inv.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                      inv.paymentStatus === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {inv.paymentStatus}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      {inv.paymentStatus !== 'Paid' && (
                        <form action={async () => {
                          "use server";
                          await markInvoicePaidAction(inv.invoiceNumber);
                        }}>
                          <button type="submit" className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium rounded-md transition-colors text-xs">
                            Mark as Paid
                          </button>
                        </form>
                      )}
                    </td>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="px-6 py-12 text-center text-slate-500 bg-slate-50/50">
                    {isAdmin ? "No invoices found." : "You have not submitted any invoices yet."}
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