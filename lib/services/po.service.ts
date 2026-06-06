import { db } from "@/lib/db";

export class PoService {
  static async getAllPOs() {
    return await db.purchaseOrder.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        vendor: true,
        quotation: {
          include: {
            rfq: true
          }
        }
      }
    });
  }

  static async getPOsByVendor(vendorId: string) {
    return await db.purchaseOrder.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
      include: {
        vendor: true,
        quotation: {
          include: {
            rfq: true
          }
        }
      }
    });
  }

  static async getPOById(poNumber: string) {
    return await db.purchaseOrder.findUnique({
      where: { poNumber },
      include: {
        vendor: true,
        quotation: {
          include: {
            rfq: true,
            lineItems: {
              include: {
                rfqItem: true
              }
            }
          }
        },
        invoices: true
      }
    });
  }

  static async updatePOStatus(poNumber: string, status: string) {
    return await db.purchaseOrder.update({
      where: { poNumber },
      data: { status }
    });
  }
}