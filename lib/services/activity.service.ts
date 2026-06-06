import { db } from "@/lib/db";

export class ActivityService {
  static async getGlobalActivityFeed() {
    // Fetch recent items from all major entities
    const rfqs = await db.rFQ.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
    const quotes = await db.quotation.findMany({ orderBy: { createdAt: 'desc' }, take: 20, include: { vendor: true } });
    const pos = await db.purchaseOrder.findMany({ orderBy: { createdAt: 'desc' }, take: 20, include: { vendor: true } });
    const invoices = await db.invoice.findMany({ orderBy: { createdAt: 'desc' }, take: 20, include: { purchaseOrder: { include: { vendor: true } } } });

    const activities: Array<{
      id: string;
      title: string;
      description: string;
      timestamp: Date;
      type: 'rfq' | 'quote' | 'po' | 'invoice';
    }> = [];

    rfqs.forEach(rfq => {
      activities.push({
        id: `rfq-${rfq.id}`,
        title: `New RFQ Created`,
        description: `Admin published RFQ: ${rfq.title}`,
        timestamp: rfq.createdAt,
        type: 'rfq'
      });
    });

    quotes.forEach(q => {
      activities.push({
        id: `quote-${q.id}`,
        title: `Quotation Submitted`,
        description: `${q.vendor.companyName} submitted a quotation for $${Number(q.totalAmount || q.price).toLocaleString()}`,
        timestamp: q.createdAt,
        type: 'quote'
      });
    });

    pos.forEach(po => {
      activities.push({
        id: `po-${po.poNumber}`,
        title: `Purchase Order Issued`,
        description: `PO ${po.poNumber} issued to ${po.vendor.companyName}`,
        timestamp: po.createdAt,
        type: 'po'
      });
    });

    invoices.forEach(inv => {
      activities.push({
        id: `inv-${inv.invoiceNumber}`,
        title: `Invoice Received`,
        description: `${inv.purchaseOrder.vendor.companyName} submitted invoice ${inv.invoiceNumber}`,
        timestamp: inv.createdAt,
        type: 'invoice'
      });
    });

    // Sort by timestamp descending
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 50);
  }
}