"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TZCard } from "@/components/ui/card";
import { TZBadge } from "@/components/ui/badge";
import { TZSkeleton } from "@/components/ui/skeleton";
import { notificationsService, Notification } from "@/services/notifications";
import { useAuthStore } from "@/lib/store";

const iconMap: Record<string, { label: string; variant: string }> = {
  'document.requested': { label: 'Document', variant: 'underReview' },
  'document.uploaded': { label: 'Upload', variant: 'warning' },
  'document.approved': { label: 'Approved', variant: 'success' },
  'document.rejected': { label: 'Rejected', variant: 'danger' },
  'filing.status_changed': { label: 'Filing', variant: 'success' },
  'task.assigned': { label: 'Task', variant: 'secondary' },
  'task.updated': { label: 'Task', variant: 'secondary' },
};

export default function EmployeeNotificationsPage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['employee-notifications'],
    queryFn: () => notificationsService.list(),
    enabled: !!accessToken,
    refetchInterval: 30000,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employee-notifications'] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employee-notifications'] }),
  });

  const notifications: Notification[] = data?.data || [];
  const unreadCount = data?.meta?.unreadCount || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">Notifications</h1>
          <p className="text-gray-500">Alerts, deadlines, and client activity updates.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllReadMutation.mutate()}
            className="text-sm font-medium text-brand-primary hover:underline"
          >
            Mark all read ({unreadCount})
          </button>
        )}
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            <TZSkeleton className="h-24 w-full" />
            <TZSkeleton className="h-24 w-full" />
            <TZSkeleton className="h-24 w-full" />
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-center py-12 text-gray-400">No notifications</p>
        ) : notifications.map((n) => {
          const info = iconMap[n.eventType] || { label: 'Info', variant: 'secondary' };
          const isUnread = !n.readAt;
          return (
            <TZCard
              key={n.id}
              className={`p-5 flex items-start gap-4 transition-all cursor-pointer ${isUnread ? "border-brand-primary/30 bg-brand-primary-light/10" : ""}`}
              interactive
              onClick={() => { if (isUnread) markReadMutation.mutate(n.id); }}
            >
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-[15px] font-semibold ${isUnread ? "text-gray-900" : "text-gray-700"}`}>{n.title}</h3>
                    <TZBadge variant={(info.variant as any)} className="text-[10px]">{info.label}</TZBadge>
                  </div>
                  {isUnread && <span className="shrink-0 w-2.5 h-2.5 bg-brand-primary rounded-full mt-1.5"></span>}
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed">{n.body}</p>
                <p className="mt-2 text-[11px] font-medium text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
            </TZCard>
          );
        })}
      </div>
    </div>
  );
}
