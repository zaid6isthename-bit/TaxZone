"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CheckSquare, 
  Folder, 
  Bell, 
  Settings,
  LogOut,
  Building2
} from "lucide-react";

interface SidebarProps {
  role: "employee" | "admin";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const employeeNav = [
    { name: "Dashboard", href: "/employee", icon: LayoutDashboard },
    { name: "Clients", href: "/employee/clients", icon: Users },
    { name: "Filings", href: "/employee/filings", icon: FileText },
    { name: "Tasks", href: "/employee/tasks", icon: CheckSquare },
    { name: "Documents", href: "/employee/documents", icon: Folder },
    { name: "Notifications", href: "/employee/notifications", icon: Bell },
  ];

  const adminNav = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "All Clients", href: "/admin/clients", icon: Building2 },
    { name: "Employees", href: "/admin/employees", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const navigation = role === "admin" ? adminNav : employeeNav;

  return (
    <div className="flex flex-col w-64 min-h-screen bg-sidebar-bg border-r border-sidebar-border">
      <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
        <span className="text-xl font-bold font-display text-brand-primary">
          TaxZone <span className="text-xs font-medium text-gray-500 uppercase">{role}</span>
        </span>
      </div>

      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-sidebar-active-bg text-sidebar-active-text"
                  : "text-sidebar-text hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-brand-primary" : "text-gray-400")} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <button className="flex items-center w-full gap-3 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100">
          <LogOut className="w-5 h-5 text-gray-400" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
