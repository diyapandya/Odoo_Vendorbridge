import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminDashboard } from "./_components/AdminDashboard";
import { VendorDashboard } from "./_components/VendorDashboard";
import { UserService } from "@/lib/services/user.service";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;
  const isVendor = role === "Vendor";
  const user = await UserService.getUserById((session.user as any).id);

  if (isVendor) {
    // A vendor setup is considered complete if they have phone and country set
    const isVendorSetupComplete = user?.phone ? true : false;

    // Mock data for vendor
    const vendorData = {
      isVendorSetupComplete,
      kpis: {
        myQuotations: 5,
        awardedPOs: 2,
        pendingRFQs: 12,
      },
      recentRFQs: [
        { id: "1", title: "Office Servers", quantity: 3, deadline: "2026-06-30", status: "Open" },
        { id: "2", title: "Laptops Q3", quantity: 50, deadline: "2026-07-15", status: "Open" },
      ]
    };
    return <VendorDashboard data={vendorData} />;
  } else {
    // Mock data for Admin/Buyer
    const adminData = {
      kpis: {
        totalVendors: 42,
        openRFQs: 15,
        pendingApprovals: 8,
        totalPOAmount: 150000,
      },
      recentPOs: [
        { poNumber: "PO-1001", vendor: { companyName: "TechCorp" }, totalAmount: 45000, status: "Approved" },
        { poNumber: "PO-1002", vendor: { companyName: "OfficeSupplies Inc" }, totalAmount: 1200, status: "Pending" },
      ]
    };
    return (
    <AdminDashboard data={adminData} />
  );
  }
}
