"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TZTable, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { TZButton } from "@/components/ui/button";
import { TZInput } from "@/components/ui/input";
import { TZBadge } from "@/components/ui/badge";
import { TZSkeleton } from "@/components/ui/skeleton";
import { Search, Plus, Filter, Calendar } from "lucide-react";
import { filingsService, Filing } from "@/services/filings";
import { useAuthStore } from "@/lib/store";

const statusVariant: Record<string, any> = {
  not_started: 'secondary',
  awaiting_documents: 'warning',
  documents_under_review: 'underReview',
  in_progress: 'inProgress',
  filed: 'success',
  completed: 'completed',
  rejected: 'danger',
  needs_correction: 'danger',
  on_hold: 'secondary',
};

export default function EmployeeFilingsPage() {
  const [search, setSearch] = useState("");
  const user = useAuthStore((s) => s.user);

  const { data, isLoading } = useQuery({
    queryKey: ['employee-filings', search],
    queryFn: () => filingsService.list({ assignedEmployeeId: user?.id }),
    enabled: !!user,
  });

  const filings: Filing[] = data?.data || [];
  const total = filings.length;
  const inProgress = filings.filter(f => f.status === 'in_progress').length;
  const overdue = filings.filter(f => f.status !== 'completed' && f.status !== 'filed' && new Date(f.dueAt) < new Date()).length;
  const done = filings.filter(f => f.status === 'completed' || f.status === 'filed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">Filings</h1>
          <p className="text-gray-500">Track all client filings across deadlines and statuses.</p>
        </div>
        <TZButton className="gap-2"><Plus size={18} /> New Filing</TZButton>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
          <p className="text-2xl font-bold font-display text-gray-900">{total}</p>
          <p className="text-sm text-gray-500 mt-0.5">Total</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 bg-blue-50">
          <p className="text-2xl font-bold font-display text-blue-600">{inProgress}</p>
          <p className="text-sm text-gray-500 mt-0.5">In Progress</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 bg-red-50">
          <p className="text-2xl font-bold font-display text-red-600">{overdue}</p>
          <p className="text-sm text-gray-500 mt-0.5">Overdue</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 bg-green-50">
          <p className="text-2xl font-bold font-display text-green-600">{done}</p>
          <p className="text-sm text-gray-500 mt-0.5">Done</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex w-1/3">
          <TZInput placeholder="Search filings..." icon={<Search size={18} />} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <TZButton variant="outline" className="gap-2"><Filter size={16} /> Filter</TZButton>
          <TZButton variant="outline" className="gap-2"><Calendar size={16} /> Due Date</TZButton>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <TZTable>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Filing Type</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8"><TZSkeleton className="h-8 w-full" /></TableCell></TableRow>
            ) : filings.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-400">No filings found</TableCell></TableRow>
            ) : filings.map((f) => (
              <TableRow key={f.id} className="cursor-pointer">
                <TableCell className="font-medium text-gray-900">{f.client?.displayName}</TableCell>
                <TableCell>
                  <span className="px-2 py-0.5 text-[11px] font-bold text-brand-primary bg-brand-primary-light rounded-sm">{f.category}</span>
                </TableCell>
                <TableCell className="text-gray-600">{new Date(f.periodStart).toLocaleDateString()} - {new Date(f.periodEnd).toLocaleDateString()}</TableCell>
                <TableCell className="text-gray-600">{new Date(f.dueAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <TZBadge variant={statusVariant[f.status] || 'secondary'}>{f.status.replace(/_/g, ' ')}</TZBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TZTable>
      </div>
    </div>
  );
}
