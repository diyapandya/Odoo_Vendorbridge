"use server";

import { RFQService } from "@/lib/services/rfq.service";
import { VendorService } from "@/lib/services/vendor.service";
import { MailService } from "@/lib/services/mail.service";
import { revalidatePath } from "next/cache";

import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

async function notifyVendors(vendorIds: string[], title: string, rfqId: string) {
  for (const id of vendorIds) {
    const vendor = await VendorService.getVendorById(id);
    if (vendor && vendor.email) {
      await MailService.sendRFQNotificationEmail(vendor.email, title, rfqId);
    }
  }
}

async function saveAttachment(file: File | null) {
  if (!file || file.size === 0) return null;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const uploadDir = path.join(process.cwd(), "public", "uploads", "rfqs");
  await fs.mkdir(uploadDir, { recursive: true });
  const extension = file.name.split('.').pop() || "bin";
  const filename = `${uuidv4()}.${extension}`;
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);
  return `/uploads/rfqs/${filename}`;
}

export async function createRFQAction(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const deadline = formData.get("deadline") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const lineItemsStr = formData.get("lineItems") as string;
    const vendorIdsStr = formData.get("vendorIds") as string;
    const file = formData.get("attachment") as File | null;

    if (!title || !deadline || !lineItemsStr) {
      return { error: "Missing required fields or line items" };
    }

    const lineItems = JSON.parse(lineItemsStr);
    const vendorIds = JSON.parse(vendorIdsStr || "[]");

    const attachmentPath = await saveAttachment(file);

    const rfqData = {
      title,
      category,
      deadline: new Date(deadline),
      description,
      status,
      attachments: attachmentPath,
      lineItems,
      vendorIds
    };

    const rfq = await RFQService.createRFQ(rfqData);

    if (status === "Open" && vendorIds.length > 0) {
      await notifyVendors(vendorIds, title, rfq.id);
    }

    revalidatePath("/rfqs");
    return { success: true, id: rfq.id };
  } catch (error: any) {
    console.error("Error creating RFQ:", error);
    return { error: error.message || "Failed to create RFQ" };
  }
}

export async function updateRFQAction(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const deadline = formData.get("deadline") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const lineItemsStr = formData.get("lineItems") as string;
    const vendorIdsStr = formData.get("vendorIds") as string;
    const file = formData.get("attachment") as File | null;

    if (!title || !deadline || !lineItemsStr) {
      return { error: "Missing required fields or line items" };
    }

    const lineItems = JSON.parse(lineItemsStr);
    const vendorIds = JSON.parse(vendorIdsStr || "[]");

    const attachmentPath = await saveAttachment(file);

    const rfqData: any = {
      title,
      category,
      deadline: new Date(deadline),
      description,
      status,
      lineItems,
      vendorIds
    };
    
    if (attachmentPath) {
      rfqData.attachments = attachmentPath;
    }

    const rfq = await RFQService.updateRFQ(id, rfqData);

    if (status === "Open" && vendorIds.length > 0) {
      await notifyVendors(vendorIds, title, rfq.id);
    }

    revalidatePath("/rfqs");
    return { success: true, id: rfq.id };
  } catch (error: any) {
    console.error("Error updating RFQ:", error);
    return { error: error.message || "Failed to update RFQ" };
  }
}