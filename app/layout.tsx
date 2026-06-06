import type { Metadata } from 'next';
import './globals.css';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: 'VendorBridge ERP',
  description: 'Procurement & Vendor Management ERP',
};

import AuthProvider from '@/components/AuthProvider';
import { AutoSignout } from '@/components/AutoSignout';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <AutoSignout />
          {session && session.user ? (
            <div className="flex min-h-screen bg-slate-50">
              <Sidebar user={session.user as any} />

              <main className="flex-1 min-w-0 overflow-y-auto">
                {children}
              </main>
            </div>
          ) : (
            children
          )}
        </AuthProvider>
      </body>
    </html>
  );
}