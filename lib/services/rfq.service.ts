import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class RFQService {
  static async createRFQ(data: Prisma.RFQCreateInput) {
    return await db.rFQ.create({ data });
  }

  static async getRFQById(id: string) {
    return await db.rFQ.findUnique({ where: { id } });
  }

  static async getOpenRFQs() {
    return await db.rFQ.findMany({ where: { status: 'Open' } });
  }

  static async updateRFQ(id: string, data: Prisma.RFQUpdateInput) {
    return await db.rFQ.update({ where: { id }, data });
  }

  static async closeRFQ(id: string) {
    return await db.rFQ.update({ where: { id }, data: { status: 'Closed' } });
  }
}