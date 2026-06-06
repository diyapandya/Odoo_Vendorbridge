import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminDashboard } from "./_components/AdminDashboard";
import { VendorDashboard } from "./_components/VendorDashboard";
import { UserService } from "@/lib/services/user.service";

import { DashboardService } from "@/lib/services/dashboard.service";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;
  const isVendor = role === "Vendor";
  const user = await UserService.getUserById((session.user as any).id);

  if (isVendor) {
    const vendorData = await DashboardService.getVendorDashboardData((session.user as any).email);
    // Merge user phone check for setup completion
    const isVendorSetupComplete = vendorData.isVendorSetupComplete && (user?.phone ? true : false);
    vendorData.isVendorSetupComplete = isVendorSetupComplete;
    
    return <VendorDashboard data={vendorData} />;
  } else {
    const adminData = await DashboardService.getAdminDashboardData();
    return (
      <AdminDashboard data={adminData} />
    );
  }
}
