import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardService } from "@/lib/services/dashboard.service";
import { AdminDashboard } from "./_components/AdminDashboard";
import { VendorDashboard } from "./_components/VendorDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;
  const email = session.user.email as string;

  if (role === 'Admin' || role === 'Buyer') {
    const data = await DashboardService.getAdminDashboardData();
    return (
      <div className="p-8">
        <AdminDashboard data={data} />
      </div>
    );
  }

  if (role === 'Vendor') {
    const data = await DashboardService.getVendorDashboardData(email);
    return (
      <div className="p-8">
        <VendorDashboard data={data} />
      </div>
    );
  }

  // Fallback if role is not recognized
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
      <p>Your role is not recognized. Please contact an administrator.</p>
    </div>
  );
}