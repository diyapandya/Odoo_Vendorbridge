export interface ApprovalStep {
  id: string;
  entityId: string;
  entityType: 'RFQ' | 'Quotation' | 'PurchaseOrder' | 'Invoice';
  approverId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  remarks?: string;
  createdAt: Date;
}