export interface Vendor {
  id: string;
  companyName: string;
  gstNumber: string;
  email: string;
  phone: string;
  category: string;
  status: 'Active' | 'Inactive' | 'Onboarding';
  createdAt: Date;
}