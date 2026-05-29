"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, FileText, UserCheck,
  FolderOpen, BarChart3, Settings, CreditCard,
  ChevronLeft, ChevronRight, LogOut, Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TZAvatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/store";

const ADMIN_NAV_ITEMS = [
  { label: 'Overview',   href: '/admin',  icon: LayoutDashboard },
  { label: '',           type: 'section', title: 'Work' },
  { label: 'Clients',    href: '/admin/clients',    icon: Users           },
  { label: 'Filings',    href: '/admin/filings',    icon: FileText        },
  { label: 'Employees',  href: '/admin/employees',  icon: UserCheck       },
  { label: 'Documents',  href: '/admin/documents',  icon: FolderOpen      },
  { label: '',           type: 'section', title: 'Insights' },
  { label: 'Analytics',  href: '/admin/analytics',  icon: BarChart3       },
  { label: '',           type: 'section', title: 'System' },
  { label: 'Settings',   href: '/admin/settings',   icon: Settings        },
  { label: 'Billing',    href: '/admin/billing',    icon: CreditCard      },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "flex flex-col h-full bg-sidebar-bg border-r border-sidebar-border transition-all duration-300 z-30 shadow-xl shadow-black/[0.02]",
        isCollapsed ? "w-[72px]" : "w-[260px]"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border bg-white/50 backdrop-blur-sm">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-accent-indigo rounded-lg flex items-center justify-center shrink-0 shadow-md shadow-brand-primary/20">
            <span className="text-white text-xs font-bold font-display">TZ</span>
          </div>
          {!isCollapsed && (
            <span className="font-extrabold font-display text-gray-900 text-[18px] tracking-tight">TaxZone <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-400 align-middle ml-1">ADMIN</span></span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-6 space-y-1">
          {ADMIN_NAV_ITEMS.map((item: any, i) => {
            if (item.type === 'section') {
              return !isCollapsed ? (
                <p key={i} className="px-6 pt-6 pb-2 text-[10px] font-extrabold font-display text-gray-400 uppercase tracking-[0.2em]">
                  {item.title}
                </p>
              ) : <div key={i} className="mx-5 my-6 border-t border-sidebar-border" />;
            }

            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 mx-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-sidebar-active-bg text-sidebar-active-text shadow-sm"
                    : "text-sidebar-text hover:bg-gray-100 hover:text-gray-900"
                )}>
                  <item.icon size={20} className={cn(
                    "shrink-0 transition-colors",
                    isActive ? "text-brand-primary" : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  {!isCollapsed && (
                    <span className={cn("text-[14px] font-bold font-display truncate", isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100")}>
                      {item.label}
                    </span>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-primary shadow-sm" />
                  )}
                  {isCollapsed && isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-brand-primary rounded-r-full" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border bg-white/30">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl border border-transparent hover:bg-gray-50 transition-all cursor-pointer group">
              <TZAvatar name={user?.name || "Admin"} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold font-display text-gray-900 truncate">{user?.name || "Admin User"}</p>
                <p className="text-[10px] font-bold text-gray-400 truncate uppercase tracking-wider">{user?.email || "admin@taxzone.in"}</p>
              </div>
              <LogOut size={16} className="text-gray-300 group-hover:text-danger transition-colors" onClick={logout} />
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-100 shadow-sm z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold font-display text-gray-900">
              {ADMIN_NAV_ITEMS.find(i => i.href === pathname)?.label || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-[1px] bg-gray-100 mx-2" />
            <TZButton variant="primary" size="sm" className="rounded-full shadow-lg shadow-brand-primary/20">
              + New Client
            </TZButton>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 no-scrollbar bg-[#FAFBFF]">
          {children}
        </main>
      </div>
    </div>
  );
}
