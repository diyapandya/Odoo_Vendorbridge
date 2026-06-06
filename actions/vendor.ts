"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function completeVendorProfile(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return { error: "Unauthorized" };
    }

    const email = session.user.email;
    const companyName = formData.get("companyName") as string;
    const gstNumber = formData.get("gstNumber") as string;
    const category = formData.get("category") as string;
    const phone = formData.get("phone") as string;

    if (!companyName || !gstNumber || !category || !phone) {
      return { error: "Missing required fields" };
    }

    const existingVendor = await db.vendor.findUnique({
      where: { email }
    });

    if (existingVendor) {
      return { error: "Vendor profile already exists" };
    }

    await db.vendor.create({
      data: {
        email,
        companyName,
        gstNumber,
        category,
        phone,
        status: "Active",
      }
    });

    revalidatePath("/dashboard");
    return { success: "Profile completed successfully!" };
  } catch (error) {
    console.error("Error completing vendor profile:", error);
    return { error: "Something went wrong!" };
  }
}
