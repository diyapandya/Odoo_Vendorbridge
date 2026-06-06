import { PoService } from "@/lib/services/po.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PurchaseOrdersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;
  const userId = (session.user as any).id;
  const isAdmin = role !== "Vendor";

  const purchaseOrders = isAdmin 
    ? await PoService.getAllPOs()
    : await PoService.getPOsByVendor(userId);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Purchase Orders</h1>
      <p className="text-slate-600">
        {isAdmin ? "Track and manage all issued purchase orders across all vendors." : "View your awarded purchase orders and generate invoices."}
      </p>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 font-semibold text-slate-900">PO Number</th>
                <th className="pb-3 font-semibold text-slate-900">RFQ Reference</th>
                {isAdmin && <th className="pb-3 font-semibold text-slate-900">Vendor</th>}
                <th className="pb-3 font-semibold text-slate-900">Total Amount</th>
                <th className="pb-3 font-semibold text-slate-900">Date Issued</th>
                <th className="pb-3 font-semibold text-slate-900">Status</th>
                <th className="pb-3 font-semibold text-slate-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.length > 0 ? purchaseOrders.map((po) => (
                <tr key={po.poNumber} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="py-4 font-bold text-indigo-600">{po.poNumber}</td>
                  <td className="py-4 text-slate-700 font-medium">{po.quotation.rfq.title}</td>
                  {isAdmin && <td className="py-4 text-slate-600">{po.vendor.companyName}</td>}
                  <td className="py-4 text-slate-800 font-semibold">${Number(po.totalAmount).toLocaleString()}</td>
                  <td className="py-4 text-slate-500">{new Date(po.createdAt).toLocaleDateString()}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                      po.status === 'Issued' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      po.status === 'Invoiced' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                      po.status === 'Completed' ? 'bg-green-100 text-green-800 border border-green-200' :
                      'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Link href={`/purchase-orders/${po.poNumber}`} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">
                      View Details
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="py-12 text-center text-slate-500 bg-slate-50/50 rounded-lg">
                    {isAdmin ? "No purchase orders generated yet." : "You have not been awarded any purchase orders yet."}
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