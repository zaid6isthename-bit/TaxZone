"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, FileText, CheckSquare,
  Folder, Bell, LogOut, ChevronLeft, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TZAvatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/store";
import { TZButton } from "@/components/ui/button";

const EMPLOYEE_NAV_ITEMS = [
  { label: 'Dashboard',   href: '/employee', icon: LayoutDashboard },
  { label: 'My Clients',  href: '/employee/clients', icon: Users },
  { label: 'Filings',     href: '/employee/filings', icon: FileText },
  { label: 'Tasks',       href: '/employee/tasks', icon: CheckSquare },
  { label: 'Documents',   href: '/employee/documents', icon: Folder },
  { label: 'Updates',     href: '/employee/notifications', icon: Bell },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "flex flex-col h-full bg-sidebar-bg border-r border-sidebar-border transition-all duration-300 z-30 shadow-xl shadow-black/[0.01]",
        isCollapsed ? "w-[72px]" : "w-[260px]"
      )}>
        <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border bg-white">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold font-display">TZ</span>
          </div>
          {!isCollapsed && (
            <span className="font-extrabold font-display text-gray-900 text-[18px]">TaxZone <span className="text-[10px] text-brand-primary align-top">STAFF</span></span>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto no-scrollbar py-6">
          {EMPLOYEE_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/employee' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 mx-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                    : "text-sidebar-text hover:bg-gray-100"
                )}>
                  <item.icon size={20} className={cn(
                    "shrink-0",
                    isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  {!isCollapsed && (
                    <span className="text-[14px] font-bold font-display">{item.label}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 px-2 py-2">
              <TZAvatar name={user?.name || "Employee"} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold font-display text-gray-900 truncate">{user?.name || "Staff Member"}</p>
                <p className="text-[10px] font-bold text-gray-400 truncate uppercase tracking-wider">Associate</p>
              </div>
              <LogOut size={16} className="text-gray-300 hover:text-danger cursor-pointer transition-colors" onClick={logout} />
            </div>
          ) : (
            <button onClick={logout} className="w-full flex items-center justify-center p-2 rounded-xl text-gray-400 hover:bg-danger-light hover:text-danger transition-all">
              <LogOut size={20} />
            </button>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-all mt-2"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-100 shadow-sm z-20">
          <h2 className="text-lg font-bold font-display text-gray-900">
            {EMPLOYEE_NAV_ITEMS.find(i => i.href === pathname)?.label || "Overview"}
          </h2>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end mr-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Today's Goal</p>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full w-[65%] bg-success rounded-full" />
                   </div>
                   <span className="text-[11px] font-bold text-gray-700">8/12</span>
                </div>
             </div>
             <TZButton variant="secondary" size="sm" className="rounded-full font-bold uppercase tracking-widest text-[10px]">
                Create Task
             </TZButton>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
