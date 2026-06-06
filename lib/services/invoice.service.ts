import { db } from "@/lib/db";

export class InvoiceService {
  static async getAllInvoices() {
    return await db.invoice.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        purchaseOrder: {
          include: {
            vendor: true
          }
        }
      }
    });
  }

  static async getInvoicesByVendor(vendorId: string) {
    return await db.invoice.findMany({
      where: {
        purchaseOrder: {
          vendorId: vendorId
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        purchaseOrder: {
          include: {
            vendor: true
          }
        }
      }
    });
  }

  static async updateInvoiceStatus(invoiceNumber: string, status: string) {
    return await db.invoice.update({
      where: { invoiceNumber },
      data: { paymentStatus: status }
    });
  }
}