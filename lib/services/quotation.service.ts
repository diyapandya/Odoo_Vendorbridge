import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class QuotationService {
  static async submitQuotation(data: Prisma.QuotationCreateInput) {
    return await db.quotation.create({ data });
  }

  static async getQuotationById(id: string) {
    return await db.quotation.findUnique({ where: { id } });
  }

  static async getQuotationsForRFQ(rfqId: string) {
    return await db.quotation.findMany({ where: { rfqId } });
  }

  static async getQuotationsByVendor(vendorId: string) {
    return await db.quotation.findMany({ where: { vendorId } });
  }

  static async updateQuotationStatus(id: string, status: string) {
    return await db.quotation.update({ where: { id }, data: { status } });
  }
}