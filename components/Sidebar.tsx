"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  FileText, 
  ClipboardCheck, 
  ShoppingBag, 
  Receipt, 
  Users, 
  History, 
  BarChart3, 
  LogOut,
  FolderLock
} from "lucide-react";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  
  const role = user.role || "Vendor";
  const name = user.name || user.email || "User";
  
  // Get initials for avatar
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isStaff = role === "Admin" || role === "Buyer";

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      show: true,
    },
    {
      name: "RFQs",
      href: "/rfqs",
      icon: FileText,
      show: true,
    },
    {
      name: "Quotations",
      href: "/quotations",
      icon: ClipboardCheck,
      show: true,
    },
    {
      name: "Purchase Orders",
      href: "/purchase-orders",
      icon: ShoppingBag,
      show: true,
    },
    {
      name: "Invoices",
      href: "/invoices",
      icon: Receipt,
      show: true,
    },
    {
      name: "Vendors",
      href: "/vendors",
      icon: Users,
      show: isStaff,
    },
    {
      name: "Approvals",
      href: "/approvals",
      icon: FolderLock,
      show: isStaff,
    },
    {
      name: "Activity Log",
      href: "/activity",
      icon: History,
      show: true,
    },
    {
      name: "Reports",
      href: "/reports",
      icon: BarChart3,
      show: true,
    },
  ];

  const activeClass = "bg-indigo-600 text-white shadow-md shadow-indigo-600/20";
  const inactiveClass = "text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200";

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
            VB
          </div>
          <span className="font-semibold text-lg text-white tracking-wide">
            VendorBridge
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems
          .filter((item) => item.show)
          .map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive ? activeClass : inactiveClass
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
      </nav>

      {/* User Info & Sign Out */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold border border-slate-700">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{name}</p>
            <p className="text-xs text-indigo-400 font-medium truncate uppercase tracking-wider">{role}</p>
          </div>
        </div>
        
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 bg-red-950/20 border border-red-900/30 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 cursor-pointer shadow-sm shadow-red-950/10"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
