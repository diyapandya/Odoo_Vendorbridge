import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class VendorService {
  static async createVendor(data: Prisma.VendorCreateInput) {
    return await db.vendor.create({ data });
  }

  static async getVendorById(id: string) {
    return await db.vendor.findUnique({ where: { id } });
  }

  static async getVendorByEmail(email: string) {
    return await db.vendor.findUnique({ where: { email } });
  }

  static async updateVendor(id: string, data: Prisma.VendorUpdateInput) {
    return await db.vendor.update({ where: { id }, data });
  }

  static async updateVendorStatus(id: string, status: string) {
    return await db.vendor.update({ where: { id }, data: { status } });
  }
}