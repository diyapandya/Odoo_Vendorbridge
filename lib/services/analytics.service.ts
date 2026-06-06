import { db } from "@/lib/db";

export class AnalyticsService {
  static async getAdminDashboardStats() {
    const rfqs = await db.rFQ.count();
    
    const pos = await db.purchaseOrder.findMany({
      select: { totalAmount: true, status: true }
    });
    
    const totalSpend = pos.reduce((acc, po) => acc + Number(po.totalAmount), 0);
    const activePOs = pos.filter(po => po.status !== 'Completed').length;

    const invoices = await db.invoice.findMany({
      select: { totalAmount: true, paymentStatus: true }
    });

    const totalPaid = invoices
      .filter(inv => inv.paymentStatus === 'Paid')
      .reduce((acc, inv) => acc + Number(inv.totalAmount), 0);

    const vendors = await db.vendor.count();

    // Group POs by Vendor to find top vendors
    const vendorSpendMap: Record<string, number> = {};
    const fullPOs = await db.purchaseOrder.findMany({ include: { vendor: true } });
    fullPOs.forEach(po => {
      const name = po.vendor.companyName;
      vendorSpendMap[name] = (vendorSpendMap[name] || 0) + Number(po.totalAmount);
    });

    const topVendors = Object.entries(vendorSpendMap)
      .map(([name, spend]) => ({ name, spend }))
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 5);

    return {
      rfqCount: rfqs,
      poCount: pos.length,
      activePOs,
      totalSpend,
      totalPaid,
      vendorCount: vendors,
      topVendors
    };
  }

  static async getVendorDashboardStats(vendorId: string) {
    const pos = await db.purchaseOrder.findMany({
      where: { vendorId },
      select: { totalAmount: true, status: true }
    });

    const totalAwarded = pos.reduce((acc, po) => acc + Number(po.totalAmount), 0);
    
    const invoices = await db.invoice.findMany({
      where: { purchaseOrder: { vendorId } },
      select: { totalAmount: true, paymentStatus: true }
    });

    const totalPaid = invoices
      .filter(inv => inv.paymentStatus === 'Paid')
      .reduce((acc, inv) => acc + Number(inv.totalAmount), 0);

    const pendingInvoices = invoices.filter(inv => inv.paymentStatus !== 'Paid').length;

    const quotes = await db.quotation.count({ where: { vendorId } });

    return {
      poCount: pos.length,
      totalAwarded,
      totalPaid,
      pendingInvoices,
      quotationCount: quotes
    };
  }
}