"use client";

import { Home, Folder, FileText, Bell, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Folder, label: "Documents", href: "/documents" },
  { icon: FileText, label: "Filings", href: "/filings" },
  { icon: Bell, label: "Updates", href: "/notifications" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16 bg-white border-t border-gray-200 pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center w-full h-full space-y-1"
          >
            <div
              className={cn(
                "flex items-center justify-center w-12 h-8 rounded-full transition-colors",
                isActive ? "bg-brand-primary-light" : "bg-transparent"
              )}
            >
              <item.icon
                size={20}
                className={cn(
                  isActive ? "text-brand-primary" : "text-gray-400"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </div>
            <span
              className={cn(
                "text-[10px] font-medium transition-colors",
                isActive ? "text-brand-primary" : "text-gray-500"
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
