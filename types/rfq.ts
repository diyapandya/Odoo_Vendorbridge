export interface RFQItem {
  name: string;
  quantity: number;
  description?: string;
}

export interface RFQ {
  id: string;
  title: string;
  description: string;
  quantity: number;
  deadline: Date;
  status: 'Open' | 'Closed' | 'Cancelled';
  createdAt: Date;
  assignedVendors?: string[];
}