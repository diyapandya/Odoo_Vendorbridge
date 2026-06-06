import { db } from "@/lib/db";

export class DashboardService {
  /**
   * Fetches KPIs for Admin and Buyer roles
   */
  static async getAdminDashboardData() {
    const totalVendors = await db.vendor.count();
    const openRFQs = await db.rFQ.count({
      where: { status: 'Open' }
    });
    const pendingApprovals = await db.approval.count({
      where: { status: 'Pending' }
    });
    
    const poAggregate = await db.purchaseOrder.aggregate({
      _sum: {
        totalAmount: true
      }
    });

    const totalPOAmount = poAggregate._sum.totalAmount 
      ? Number(poAggregate._sum.totalAmount)
      : 0;

    // Get recent POs for the table
    const recentPOs = await db.purchaseOrder.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { vendor: true }
    });

    // Compute Admin Chart Data (Spending Trends by Month)
    const allPOs = await db.purchaseOrder.findMany({
      select: { createdAt: true, totalAmount: true }
    });
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const amountByMonth: Record<string, number> = {};
    
    allPOs.forEach(po => {
      const m = po.createdAt.getMonth();
      const monthName = monthNames[m];
      amountByMonth[monthName] = (amountByMonth[monthName] || 0) + Number(po.totalAmount);
    });

    const chartData = monthNames.map(name => ({
      name,
      amount: amountByMonth[name] || 0
    })).filter(d => d.amount > 0 || monthNames.indexOf(d.name) <= new Date().getMonth()).slice(-6); // Last 6 months

    return {
      kpis: {
        totalVendors,
        openRFQs,
        pendingApprovals,
        totalPOAmount,
      },
      recentPOs,
      chartData
    };
  }

  /**
   * Fetches KPIs for a specific Vendor using their email
   */
  static async getVendorDashboardData(vendorEmail: string) {
    const vendor = await db.vendor.findUnique({
      where: { email: vendorEmail }
    });

    if (!vendor) {
      return {
        isVendorSetupComplete: false,
        kpis: null,
        recentRFQs: [],
        chartData: []
      };
    }

    const myQuotations = await db.quotation.count({
      where: { vendorId: vendor.id }
    });

    const awardedPOs = await db.purchaseOrder.count({
      where: { vendorId: vendor.id }
    });

    const pendingRFQs = await db.rFQ.count({
      where: { status: 'Open' }
    });

    // Recent open RFQs for the vendor to bid on
    const recentRFQs = await db.rFQ.findMany({
      where: { status: 'Open' },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    // Compute Vendor Chart Data (Quotations by Month)
    const allQuotes = await db.quotation.findMany({
      where: { vendorId: vendor.id },
      select: { createdAt: true }
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const bidsByMonth: Record<string, number> = {};
    
    allQuotes.forEach(q => {
      const m = q.createdAt.getMonth();
      const monthName = monthNames[m];
      bidsByMonth[monthName] = (bidsByMonth[monthName] || 0) + 1;
    });

    const chartData = monthNames.map(name => ({
      name,
      bids: bidsByMonth[name] || 0
    })).filter(d => d.bids > 0 || monthNames.indexOf(d.name) <= new Date().getMonth()).slice(-6);

    return {
      isVendorSetupComplete: true,
      kpis: {
        myQuotations,
        awardedPOs,
        pendingRFQs,
      },
      recentRFQs,
      chartData
    };
  }
}
