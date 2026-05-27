"use client";

import { TZCard } from "@/components/ui/card";
import { Bell, FileText, Upload, CheckCircle, AlertCircle, Info } from "lucide-react";

const notifications = [
  {
    icon: Upload,
    iconBg: "bg-warning-light text-warning",
    title: "Documents Requested",
    desc: "Your CA has requested 3 documents for GSTR-1 October filing.",
    time: "2 hours ago",
    unread: true,
  },
  {
    icon: CheckCircle,
    iconBg: "bg-success-light text-success",
    title: "ITR Filed Successfully",
    desc: "Your Income Tax Return for FY 2023-24 has been submitted to the Income Tax portal.",
    time: "Yesterday, 4:30 PM",
    unread: true,
  },
  {
    icon: AlertCircle,
    iconBg: "bg-danger-light text-danger",
    title: "Deadline Approaching",
    desc: "GSTR-3B for November 2024 is due in 5 days. Ensure your documents are ready.",
    time: "2 days ago",
    unread: false,
  },
  {
    icon: FileText,
    iconBg: "bg-brand-primary-light text-brand-primary",
    title: "Filing Under Review",
    desc: "GSTR-1 for October 2024 has been submitted and is under review by your CA.",
    time: "3 days ago",
    unread: false,
  },
  {
    icon: Info,
    iconBg: "bg-info-light text-info",
    title: "New Tax Update",
    desc: "GST Council has revised late fee structure for FY 2024-25. Tap to read more.",
    time: "1 week ago",
    unread: false,
  },
];

export default function NotificationsPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20 bg-gray-50">
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <h1 className="text-lg font-bold font-display text-gray-900">Notifications</h1>
        <button className="text-sm font-medium text-brand-primary">Mark all read</button>
      </header>

      <div className="px-4 py-4 space-y-3">
        {notifications.map((n, i) => (
          <TZCard
            key={i}
            className={`p-4 flex items-start gap-3 transition-all ${n.unread ? "border-brand-primary/30 bg-brand-primary-light/10" : ""}`}
          >
            <div className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${n.iconBg}`}>
              <n.icon size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`text-[14px] font-semibold ${n.unread ? "text-gray-900" : "text-gray-700"}`}>{n.title}</h3>
                {n.unread && <span className="shrink-0 w-2 h-2 bg-brand-primary rounded-full mt-1.5"></span>}
              </div>
              <p className="mt-0.5 text-[13px] text-gray-500 leading-snug">{n.desc}</p>
              <p className="mt-2 text-[11px] font-medium text-gray-400">{n.time}</p>
            </div>
          </TZCard>
        ))}
      </div>
    </div>
  );
}
