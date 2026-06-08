"use client";

import { useQuery } from "@tanstack/react-query";
import { TZCard } from "@/components/ui/card";
import { TZBadge } from "@/components/ui/badge";
import { TZButton } from "@/components/ui/button";
import { TZAvatar } from "@/components/ui/avatar";
import { TZSkeleton } from "@/components/ui/skeleton";
import { Plus, Calendar, MoreHorizontal } from "lucide-react";
import { tasksService, Task } from "@/services/tasks";
import { useAuthStore } from "@/lib/store";

const statusColumns = [
  { id: 'open', label: 'To Do', color: 'bg-gray-100 text-gray-700' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-blue-50 text-blue-600' },
  { id: 'blocked', label: 'Blocked', color: 'bg-red-50 text-red-600' },
  { id: 'done', label: 'Done', color: 'bg-green-50 text-green-600' },
];

const priorityVariant: Record<string, string> = {
  urgent: 'danger',
  high: 'danger',
  normal: 'warning',
  low: 'secondary',
};

export default function TasksPage() {
  const user = useAuthStore((s) => s.user);

  const { data, isLoading } = useQuery({
    queryKey: ['employee-tasks'],
    queryFn: () => tasksService.list({ assignedToId: user?.id }),
    enabled: !!user,
  });

  const tasks: Task[] = data?.data || [];

  const getColumnTasks = (status: string) => tasks.filter(t => t.status === status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">Tasks Board</h1>
          <p className="text-gray-500">Kanban view of all pending tasks.</p>
        </div>
        <TZButton className="gap-2"><Plus size={18} /> Add Task</TZButton>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {statusColumns.map((col) => {
          const colTasks = getColumnTasks(col.id);
          return (
            <div key={col.id} className="flex flex-col w-72 shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${col.color}`}>{col.label}</span>
                  <span className="text-xs text-gray-500 font-medium">{colTasks.length}</span>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors"><Plus size={16} /></button>
              </div>

              <div className="flex flex-col gap-3">
                {isLoading ? (
                  <div className="space-y-3">
                    <TZSkeleton className="h-32 w-full" />
                    <TZSkeleton className="h-32 w-full" />
                  </div>
                ) : colTasks.map((task) => (
                  <TZCard key={task.id} className="p-4 hover:shadow-md transition-all" interactive>
                    <div className="flex items-start justify-between mb-2">
                      <TZBadge variant={(priorityVariant[task.priority] || 'secondary') as any} className="text-[10px]">{task.priority}</TZBadge>
                      <button className="text-gray-400 hover:text-gray-600 -mr-1"><MoreHorizontal size={16} /></button>
                    </div>
                    <h3 className="text-[14px] font-semibold text-gray-900 mb-1 leading-snug">{task.title}</h3>
                    <p className="text-[12px] text-gray-500 mb-3">{task.client?.displayName || 'General'}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                        <Calendar size={12} />
                        <span>Due {task.dueAt ? new Date(task.dueAt).toLocaleDateString() : 'No date'}</span>
                      </div>
                      <TZAvatar name={task.assignedTo?.name || '?'} size="xs" />
                    </div>
                  </TZCard>
                ))}
                <button className="flex items-center gap-2 p-3 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 hover:border-brand-primary/50 hover:text-brand-primary transition-colors text-sm font-medium w-full">
                  <Plus size={16} /> Add task
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
