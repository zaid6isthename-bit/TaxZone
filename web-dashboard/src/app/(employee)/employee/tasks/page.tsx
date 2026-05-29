"use client";

import { TZCard } from "@/components/ui/card";
import { TZBadge } from "@/components/ui/badge";
import { TZButton } from "@/components/ui/button";
import { TZAvatar } from "@/components/ui/avatar";
import { Plus, Calendar, MoreHorizontal } from "lucide-react";

type Task = {
  id: string;
  title: string;
  client: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  assignee: string;
};

const columns: { id: string; label: string; color: string; tasks: Task[] }[] = [
  {
    id: "todo",
    label: "To Do",
    color: "bg-gray-100 text-gray-700",
    tasks: [
      { id: "T-001", title: "Collect Q3 Bank Statements", client: "Acme Corp", due: "25 Nov", priority: "High", assignee: "AP" },
      { id: "T-002", title: "Reconcile GST Ledger", client: "TechNova", due: "30 Nov", priority: "Medium", assignee: "PS" },
    ],
  },
  {
    id: "inprogress",
    label: "In Progress",
    color: "bg-info-light text-info",
    tasks: [
      { id: "T-003", title: "Prepare GSTR-3B Draft", client: "Acme Corp", due: "18 Nov", priority: "High", assignee: "AP" },
      { id: "T-004", title: "Client PAN Verification", client: "Rajesh Kumar", due: "20 Nov", priority: "Low", assignee: "NG" },
    ],
  },
  {
    id: "review",
    label: "Under Review",
    color: "bg-brand-primary-light text-brand-primary",
    tasks: [
      { id: "T-005", title: "GSTR-1 October Submission", client: "Rajesh Kumar", due: "31 Oct", priority: "High", assignee: "PS" },
    ],
  },
  {
    id: "done",
    label: "Done",
    color: "bg-success-light text-success",
    tasks: [
      { id: "T-006", title: "TDS Q2 Return Filed", client: "Global Exports", due: "15 Oct", priority: "Medium", assignee: "AP" },
      { id: "T-007", title: "ITR FY23-24 Submitted", client: "Priya Singh", due: "31 Jul", priority: "High", assignee: "PS" },
    ],
  },
];

const priorityVariant: Record<string, string> = {
  High: "danger",
  Medium: "warning",
  Low: "secondary",
};

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">Tasks Board</h1>
          <p className="text-gray-500">Kanban view of all pending tasks.</p>
        </div>
        <TZButton className="gap-2"><Plus size={18} /> Add Task</TZButton>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.id} className="flex flex-col w-72 shrink-0">
            {/* Column header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${col.color}`}>{col.label}</span>
                <span className="text-xs text-gray-500 font-medium">{col.tasks.length}</span>
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                <Plus size={16} />
              </button>
            </div>

            {/* Task cards */}
            <div className="flex flex-col gap-3">
              {col.tasks.map((task) => (
                <TZCard key={task.id} className="p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-all" interactive>
                  <div className="flex items-start justify-between mb-2">
                    <TZBadge variant={priorityVariant[task.priority] as any} className="text-[10px]">
                      {task.priority}
                    </TZBadge>
                    <button className="text-gray-400 hover:text-gray-600 -mr-1">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  <h3 className="text-[14px] font-semibold text-gray-900 mb-1 leading-snug">{task.title}</h3>
                  <p className="text-[12px] text-gray-500 mb-3">{task.client}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                      <Calendar size={12} />
                      <span>Due {task.due}</span>
                    </div>
                    <TZAvatar
                      name={task.assignee}
                      size="xs"
                    />
                  </div>
                </TZCard>
              ))}

              {/* Add card placeholder */}
              <button className="flex items-center gap-2 p-3 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 hover:border-brand-primary/50 hover:text-brand-primary transition-colors text-sm font-medium w-full">
                <Plus size={16} /> Add task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
