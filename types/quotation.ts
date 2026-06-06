export interface Quotation {
  id: string;
  rfqId: string;
  vendorId: string;
  price: number;
  deliveryETA: string;
  remarks?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: Date;
}