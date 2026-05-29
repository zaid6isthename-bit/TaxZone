"use client";

import { Home, FolderOpen, FileText, Bell, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";

const navItems = [
  { icon: Home,       label: "Home",      href: "/"              },
  { icon: FolderOpen, label: "Documents", href: "/documents"     },
  { icon: FileText,   label: "Filings",   href: "/filings"       },
  { icon: Bell,       label: "Updates",   href: "/notifications" },
  { icon: User,       label: "Profile",   href: "/profile"       },
];

export function BottomNav() {
  const pathname = usePathname();
  const { unreadCount } = useAuthStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-[68px] bg-white border-t border-gray-100 shadow-[0_-2px_12px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)] px-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const isBell = item.icon === Bell;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center flex-1 h-full gap-1 no-underline group"
          >
            {/* Icon container with pill background for active state */}
            <div className={cn(
              "relative flex items-center justify-center w-14 h-8 rounded-full transition-all duration-300 ease-out",
              isActive ? "bg-brand-primary-light" : "bg-transparent group-active:scale-90"
            )}>
              <item.icon
                size={22}
                className={cn(
                  "transition-all duration-300",
                  isActive ? "text-brand-primary" : "text-gray-400 group-hover:text-gray-600"
                )}
                strokeWidth={isActive ? 2.5 : 2}
                fill={isActive ? "currentColor" : "none"}
                fillOpacity={isActive ? 0.1 : 0}
              />

              {/* Notification Badge on Bell */}
              {isBell && unreadCount > 0 && (
                <span className="absolute top-1 right-3 w-4 h-4 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-fade-in">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
              {!isBell && isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-brand-primary rounded-full animate-fade-in" />
              )}
            </div>

            {/* Label */}
            <span className={cn(
              "text-[10px] font-bold tracking-tight transition-all duration-300 font-body uppercase",
              isActive ? "text-brand-primary opacity-100 scale-100" : "text-gray-400 opacity-80 scale-95"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
