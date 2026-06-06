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

    return {
      kpis: {
        totalVendors,
        openRFQs,
        pendingApprovals,
        totalPOAmount,
      },
      recentPOs,
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
        recentRFQs: []
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

    return {
      isVendorSetupComplete: true,
      kpis: {
        myQuotations,
        awardedPOs,
        pendingRFQs,
      },
      recentRFQs,
    };
  }
}
