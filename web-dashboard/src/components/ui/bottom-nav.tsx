"use client";

import { Home, Folder, FileText, Bell, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PRIMARY      = "#1A4FBA";
const PRIMARY_LIGHT = "#EBF1FF";
const GRAY400      = "#9CA3AF";
const GRAY500      = "#6B7280";
const WHITE        = "#FFFFFF";
const GRAY200      = "#E5E7EB";

const navItems = [
  { icon: Home,     label: "Home",      href: "/"              },
  { icon: Folder,   label: "Documents", href: "/documents"     },
  { icon: FileText, label: "Filings",   href: "/filings"       },
  { icon: Bell,     label: "Updates",   href: "/notifications" },
  { icon: User,     label: "Profile",   href: "/profile"       },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "space-around",
      height: 60,
      background: WHITE,
      borderTop: `1px solid ${GRAY200}`,
      boxShadow: "0 -2px 8px rgba(0,0,0,0.06)",
      paddingBottom: "env(safe-area-inset-bottom)",
    }}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              flex: 1, height: "100%", gap: 3,
              textDecoration: "none",
            }}
          >
            {/* Icon pill */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 44, height: 28, borderRadius: 99,
              background: isActive ? PRIMARY_LIGHT : "transparent",
              transition: "background 0.15s ease",
            }}>
              <item.icon
                size={19}
                style={{ color: isActive ? PRIMARY : GRAY400 }}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </div>
            {/* Label */}
            <span style={{
              fontSize: 10,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? PRIMARY : GRAY500,
              fontFamily: "'DM Sans', sans-serif",
              transition: "color 0.15s ease",
            }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
