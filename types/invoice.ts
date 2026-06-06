export interface Invoice {
  invoiceNumber: string;
  poNumber: string;
  taxAmount: number;
  totalAmount: number;
  paymentStatus: 'Unpaid' | 'Paid' | 'Overdue';
  createdAt: Date;
}