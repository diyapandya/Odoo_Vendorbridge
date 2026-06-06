"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitQuotationAction(payload: any) {
  try {
    const { rfqId, vendorId, subtotal, taxPercent, totalAmount, terms, status, lineItems } = payload;

    if (!rfqId || !vendorId || !lineItems || lineItems.length === 0) {
      return { error: "Missing required fields" };
    }

    // Check if quotation already exists for this vendor and RFQ
    const existingQuotation = await db.quotation.findFirst({
      where: {
        rfqId,
        vendorId
      }
    });

    if (existingQuotation) {
      // Update existing
      await db.quotation.update({
        where: { id: existingQuotation.id },
        data: {
          subtotal,
          taxPercent,
          totalAmount,
          price: totalAmount, // For legacy support
          deliveryETA: "Multiple", // Legacy
          terms,
          status,
          lineItems: {
            deleteMany: {},
            create: lineItems.map((item: any) => ({
              rfqItemId: item.rfqItemId,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              deliveryETA: item.deliveryETA
            }))
          }
        }
      });
    } else {
      // Create new
      await db.quotation.create({
        data: {
          rfqId,
          vendorId,
          subtotal,
          taxPercent,
          totalAmount,
          price: totalAmount, // For legacy support
          deliveryETA: "Multiple", // Legacy
          terms,
          status,
          lineItems: {
            create: lineItems.map((item: any) => ({
              rfqItemId: item.rfqItemId,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              deliveryETA: item.deliveryETA
            }))
          }
        }
      });
    }

    revalidatePath("/quotations");
    revalidatePath(`/rfqs/${rfqId}`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error submitting quotation:", error);
    return { error: error.message || "Failed to submit quotation" };
  }
}