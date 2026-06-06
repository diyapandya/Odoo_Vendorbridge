"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function approveQuotationAction(quotationId: string) {
  try {
    const quotation = await db.quotation.findUnique({
      where: { id: quotationId },
    });

    if (!quotation) {
      return { error: "Quotation not found" };
    }

    // 1. Update Quotation Status
    await db.quotation.update({
      where: { id: quotationId },
      data: { status: "Approved" }
    });

    // 2. Generate a Purchase Order
    const poNumber = `PO-${uuidv4().substring(0, 8).toUpperCase()}`;
    await db.purchaseOrder.create({
      data: {
        poNumber,
        totalAmount: quotation.totalAmount || quotation.price,
        status: "Issued",
        quotationId: quotation.id,
        vendorId: quotation.vendorId
      }
    });

    // 3. (Optional) Close the RFQ since a vendor has been selected
    await db.rFQ.update({
      where: { id: quotation.rfqId },
      data: { status: "Closed" }
    });

    revalidatePath("/approvals");
    revalidatePath("/purchase-orders");
    revalidatePath("/quotations");
    revalidatePath(`/rfqs/${quotation.rfqId}`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error approving quotation:", error);
    return { error: "Failed to approve quotation" };
  }
}

export async function rejectQuotationAction(quotationId: string) {
  try {
    await db.quotation.update({
      where: { id: quotationId },
      data: { status: "Rejected" }
    });

    revalidatePath("/approvals");
    revalidatePath("/quotations");

    return { success: true };
  } catch (error: any) {
    console.error("Error rejecting quotation:", error);
    return { error: "Failed to reject quotation" };
  }
}