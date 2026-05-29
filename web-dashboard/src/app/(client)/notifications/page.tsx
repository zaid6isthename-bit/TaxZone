"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Bell, Upload, CheckCircle, XCircle, RefreshCw,
  Clock, Trophy, ChevronRight
} from "lucide-react";
import { TZCard } from "@/components/ui/card";
import { TZSkeleton } from "@/components/ui/skeleton";
import { TZEmptyState } from "@/components/ui/empty-state";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { useAuthStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

const NOTIFICATION_ICONS: Record<string, any> = {
  document_request:    { icon: Upload,      bg: 'bg-brand-primary-light', color: 'text-brand-primary' },
  document_approved:   { icon: CheckCircle, bg: 'bg-success-light',       color: 'text-success'       },
  document_rejected:   { icon: XCircle,     bg: 'bg-danger-light',        color: 'text-danger'        },
  filing_status:       { icon: RefreshCw,   bg: 'bg-info-light',          color: 'text-info'          },
  deadline_alert:      { icon: Clock,       bg: 'bg-warning-light',       color: 'text-warning'       },
  filing_completed:    { icon: Trophy,      bg: 'bg-success-light',       color: 'text-success'       },
};

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(n => ({
        id: n.id,
        type: 'filing_status', // Simplified for now since schema only has title/message
        title: n.title,
        body: n.message,
        createdAt: n.created_at,
        isRead: n.read,
        filingId: null
      }));
    },
  });

  const displayNotifications = notifications || [];

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-5 pt-12 pb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold font-display text-gray-900">Notifications</h1>
        <button className="text-xs font-bold text-brand-primary uppercase tracking-widest hover:underline">Mark all read</button>
      </header>

      <div className="flex-1 px-4 py-4 space-y-3">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => <TZSkeleton key={i} className="h-24 w-full rounded-xl" />)
        ) : displayNotifications.length > 0 ? (
          displayNotifications.map((n: any) => (
            <NotificationItem key={n.id} n={n} onClick={() => n.filingId && router.push(`/filings/details?id=${n.filingId}`)} />
          ))
        ) : (
          <TZEmptyState
            icon={<Bell className="w-12 h-12 text-gray-300" />}
            title="All caught up!"
            description="You don't have any new notifications at the moment."
          />
        )}
      </div>
    </div>
  );
}

function NotificationItem({ n, onClick }: { n: any; onClick: () => void }) {
  const config = NOTIFICATION_ICONS[n.type] || NOTIFICATION_ICONS.filing_status;

  return (
    <TZCard
      interactive
      onClick={onClick}
      className={cn(
        "p-4 border-none shadow-sm transition-all duration-200",
        !n.isRead ? "bg-white ring-1 ring-brand-primary/10 border-l-4 border-l-brand-primary" : "bg-gray-50/50 opacity-80"
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm", config.bg)}>
          <config.icon className={cn("w-5 h-5", config.color)} strokeWidth={2.5} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className={cn("text-[14px] font-bold font-display leading-tight", !n.isRead ? "text-gray-900" : "text-gray-600")}>
              {n.title}
            </h3>
            {!n.isRead && <div className="w-2 h-2 bg-brand-primary rounded-full mt-1.5 animate-pulse shrink-0" />}
          </div>
          <p className="text-[13px] font-medium font-body text-gray-500 leading-snug line-clamp-2">
            {n.body}
          </p>
          <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">
            2 hours ago
          </p>
        </div>
      </div>
    </TZCard>
  );
}
