"use client";

import { TZCard } from "@/components/ui/card";
import { TZBadge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Upload, FileText, Bell, Clock } from "lucide-react";

const notifications = [
  { icon: Upload, iconBg: "bg-warning-light text-warning", title: "Document Uploaded by Client", desc: "Rajesh Kumar uploaded PAN Card copy for GSTR-1 October filing.", time: "30 min ago", unread: true, tag: "Document" },
  { icon: AlertCircle, iconBg: "bg-danger-light text-danger", title: "Filing Deadline in 3 Days", desc: "GSTR-3B for October 2024 is due on 20 Nov. 4 clients still pending.", time: "2 hours ago", unread: true, tag: "Deadline" },
  { icon: CheckCircle, iconBg: "bg-success-light text-success", title: "Filing Completed", desc: "TDS Return Q2 for Global Exports has been successfully filed.", time: "Yesterday, 3:15 PM", unread: false, tag: "Filing" },
  { icon: FileText, iconBg: "bg-brand-primary-light text-brand-primary", title: "New Task Assigned", desc: "Admin assigned GSTR-9 Annual reconciliation for TechNova to you.", time: "2 days ago", unread: false, tag: "Task" },
  { icon: Clock, iconBg: "bg-info-light text-info", title: "Reminder: Client Documents Missing", desc: "Priya Singh has not uploaded Form 16 for FY 2023-24. Deadline is 31 Jul.", time: "3 days ago", unread: false, tag: "Reminder" },
];

const tagVariant: Record<string, any> = {
  Document: "underReview", Deadline: "danger", Filing: "success", Task: "secondary", Reminder: "warning"
};

export default function EmployeeNotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">Notifications</h1>
          <p className="text-gray-500">Alerts, deadlines, and client activity updates.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm font-medium text-brand-primary hover:underline">Mark all read</button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((n, i) => (
          <TZCard
            key={i}
            className={`p-5 flex items-start gap-4 transition-all cursor-pointer ${n.unread ? "border-brand-primary/30 bg-brand-primary-light/10" : ""}`}
            interactive
          >
            <div className={`shrink-0 flex items-center justify-center w-11 h-11 rounded-xl ${n.iconBg}`}>
              <n.icon size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="flex items-center gap-2">
                  <h3 className={`text-[15px] font-semibold ${n.unread ? "text-gray-900" : "text-gray-700"}`}>{n.title}</h3>
                  <TZBadge variant={tagVariant[n.tag]} className="text-[10px]">{n.tag}</TZBadge>
                </div>
                {n.unread && <span className="shrink-0 w-2.5 h-2.5 bg-brand-primary rounded-full mt-1.5"></span>}
              </div>
              <p className="text-[13px] text-gray-500 leading-relaxed">{n.desc}</p>
              <p className="mt-2 text-[11px] font-medium text-gray-400">{n.time}</p>
            </div>
          </TZCard>
        ))}
      </div>
    </div>
  );
}
