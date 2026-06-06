"use server";

import { RFQService } from "@/lib/services/rfq.service";
import { revalidatePath } from "next/cache";

export async function createRFQAction(payload: any) {
  try {
    // Basic validation
    if (!payload.title || !payload.deadline || !payload.lineItems || payload.lineItems.length === 0) {
      return { error: "Missing required fields or line items" };
    }

    // Format deadline to Date object
    const rfqData = {
      ...payload,
      deadline: new Date(payload.deadline),
    };

    await RFQService.createRFQ(rfqData);
    revalidatePath("/rfqs");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating RFQ:", error);
    return { error: error.message || "Failed to create RFQ" };
  }
}