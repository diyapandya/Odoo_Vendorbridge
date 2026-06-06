import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VendorBridge ERP',
  description: 'Procurement & Vendor Management ERP',
};

import AuthProvider from '@/components/AuthProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}