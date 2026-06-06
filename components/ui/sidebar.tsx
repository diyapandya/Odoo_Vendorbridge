"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardCheck,
  FolderLock,
  ShoppingBag,
  Receipt,
  BarChart3,
  History,
  LogOut,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const role = (session?.user as any)?.role || "Vendor";
  const isStaff = role === "Admin" || role === "Buyer";

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      show: true,
    },
    {
      label: "Vendors",
      href: "/vendors",
      icon: Users,
      show: isStaff,
    },
    {
      label: "RFQs",
      href: "/rfqs",
      icon: FileText,
      show: true,
    },
    {
      label: "Quotations",
      href: "/quotations",
      icon: ClipboardCheck,
      show: true,
    },
    {
      label: "Approvals",
      href: "/approvals",
      icon: FolderLock,
      show: isStaff,
    },
    {
      label: "Purchase Orders",
      href: "/purchase-orders",
      icon: ShoppingBag,
      show: true,
    },
    {
      label: "Invoices",
      href: "/invoices",
      icon: Receipt,
      show: true,
    },
    {
      label: "Reports",
      href: "/reports",
      icon: BarChart3,
      show: true,
    },
    {
      label: "Activity",
      href: "/activity",
      icon: History,
      show: isStaff,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 shadow-sm">
      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems
            .filter((item) => item.show)
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                      isActive
                        ? "bg-green-50 text-green-700 border-l-4 border-green-600"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-green-600" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>

      {/* Bottom Sign Out section */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 border border-slate-200 hover:border-red-200 cursor-pointer shadow-sm"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

