export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'Admin' | 'Procurement Officer' | 'Vendor' | 'Manager';
  country: string;
  createdAt: Date;
}