import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class UserService {
  static async getUserById(id: string) {
    return await db.user.findUnique({
      where: { id }
    });
  }

  static async getUserByEmail(email: string) {
    return await db.user.findUnique({
      where: { email }
    });
  }

  static async createUser(data: Prisma.UserCreateInput) {
    return await db.user.create({
      data
    });
  }

  static async updateUser(id: string, data: Prisma.UserUpdateInput) {
    return await db.user.update({
      where: { id },
      data
    });
  }
}