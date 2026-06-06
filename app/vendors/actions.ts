"use server";

import { VendorService } from "@/lib/services/vendor.service";
import { revalidatePath } from "next/cache";

export async function addVendorAction(formData: FormData) {
  try {
    const data = {
      companyName: formData.get("companyName") as string,
      gstNumber: formData.get("gstNumber") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      category: formData.get("category") as string,
    };

    if (!data.companyName || !data.email) {
      return { error: "Company name and email are required" };
    }

    await VendorService.createVendor(data);
    revalidatePath("/vendors");
    return { success: true };
  } catch (error: any) {
    console.error("Error adding vendor:", error);
    if (error.code === 'P2002' && error.meta?.target === 'Vendor_email_key') {
      return { error: "A vendor with this email already exists." };
    }
    return { error: "Failed to add vendor" };
  }
}

export async function updateVendorStatusAction(id: string, status: string) {
  try {
    await VendorService.updateVendorStatus(id, status);
    revalidatePath("/vendors");
    return { success: true };
  } catch (error) {
    console.error("Error updating vendor status:", error);
    return { error: "Failed to update vendor status" };
  }
}