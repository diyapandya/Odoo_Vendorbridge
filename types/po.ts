export interface PurchaseOrder {
  poNumber: string;
  quotationId: string;
  vendorId: string;
  totalAmount: number;
  status: 'Pending' | 'Approved' | 'Delivered' | 'Cancelled';
  createdAt: Date;
}