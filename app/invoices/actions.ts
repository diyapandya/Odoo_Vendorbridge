"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function generateInvoiceAction(poNumber: string) {
  try {
    const po = await db.purchaseOrder.findUnique({
      where: { poNumber },
    });

    if (!po) {
      return { error: "Purchase Order not found" };
    }

    if (po.status === "Invoiced") {
      return { error: "Purchase Order has already been invoiced." };
    }

    const invoiceNumber = `INV-${uuidv4().substring(0, 8).toUpperCase()}`;
    const totalAmount = Number(po.totalAmount);
    const taxAmount = totalAmount * 0.08; // Example 8% tax

    await db.invoice.create({
      data: {
        invoiceNumber,
        taxAmount,
        totalAmount: totalAmount + taxAmount,
        paymentStatus: "Unpaid",
        poNumber: po.poNumber
      }
    });

    // Update PO status
    await db.purchaseOrder.update({
      where: { poNumber },
      data: { status: "Invoiced" }
    });

    revalidatePath("/invoices");
    revalidatePath(`/purchase-orders/${poNumber}`);
    revalidatePath("/purchase-orders");

    return { success: true };
  } catch (error: any) {
    console.error("Error generating invoice:", error);
    return { error: "Failed to generate invoice" };
  }
}

export async function markInvoicePaidAction(invoiceNumber: string) {
  try {
    await db.invoice.update({
      where: { invoiceNumber },
      data: { paymentStatus: "Paid" }
    });

    revalidatePath("/invoices");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error marking invoice as paid:", error);
    return { error: "Failed to mark invoice as paid" };
  }
}