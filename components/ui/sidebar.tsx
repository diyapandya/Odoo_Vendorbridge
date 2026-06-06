"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Vendors",
    href: "/vendors",
  },
  {
    label: "RFQs",
    href: "/rfqs",
  },
  {
    label: "Quotations",
    href: "/quotations",
  },
  {
    label: "Approvals",
    href: "/approvals",
  },
  {
    label: "Purchase Orders",
    href: "/purchase-orders",
  },
  {
    label: "Invoices",
    href: "/invoices",
  },
  {
    label: "Reports",
    href: "/reports",
  },
  {
    label: "Activity",
    href: "/activity",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 shadow-sm">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                    isActive
                      ? "bg-green-100 text-green-700 border-l-4 border-green-600"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
