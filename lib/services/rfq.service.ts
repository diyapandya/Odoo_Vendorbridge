import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class RFQService {
  static async createRFQ(data: any) {
    // Data expected to have: title, category, description, deadline, attachments, lineItems (array), vendorIds (array of strings)
    const { lineItems, vendorIds, ...rfqData } = data;

    return await db.rFQ.create({
      data: {
        ...rfqData,
        lineItems: {
          create: lineItems,
        },
        vendors: {
          connect: vendorIds.map((id: string) => ({ id })),
        },
      },
      include: {
        lineItems: true,
        vendors: true,
      },
    });
  }

  static async getRFQById(id: string) {
    return await db.rFQ.findUnique({ 
      where: { id },
      include: { lineItems: true, vendors: true, quotations: true }
    });
  }

  static async getAllRFQs() {
    return await db.rFQ.findMany({
      orderBy: { createdAt: 'desc' },
      include: { lineItems: true, vendors: true }
    });
  }

  static async getOpenRFQs() {
    return await db.rFQ.findMany({ 
      where: { status: 'Open' },
      include: { lineItems: true, vendors: true }
    });
  }

  static async getRFQsByVendor(vendorId: string) {
    return await db.rFQ.findMany({
      where: {
        vendors: {
          some: {
            id: vendorId
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      include: { lineItems: true, vendors: true }
    });
  }

  static async updateRFQ(id: string, data: any) {
    const { lineItems, vendorIds, ...rfqData } = data;

    return await db.rFQ.update({ 
      where: { id }, 
      data: {
        ...rfqData,
        lineItems: {
          deleteMany: {}, // remove old
          create: lineItems, // insert new
        },
        vendors: {
          set: vendorIds.map((vid: string) => ({ id: vid })),
        }
      },
      include: {
        lineItems: true,
        vendors: true,
      }
    });
  }

  static async closeRFQ(id: string) {
    return await db.rFQ.update({ where: { id }, data: { status: 'Closed' } });
  }
}