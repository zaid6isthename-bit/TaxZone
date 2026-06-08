"use client";

import { useQuery } from "@tanstack/react-query";
import { TZTable, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { TZBadge } from "@/components/ui/badge";
import { TZSkeleton } from "@/components/ui/skeleton";
import { filingsService, Filing } from "@/services/filings";

const statusVariant: Record<string, any> = {
  not_started: 'secondary', awaiting_documents: 'warning', documents_under_review: 'underReview',
  in_progress: 'inProgress', filed: 'success', completed: 'completed', rejected: 'danger',
};

export default function AdminFilingsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-filings'], queryFn: () => filingsService.list() });
  const filings: Filing[] = data?.data || [];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-display text-gray-900">All Filings</h1><p className="text-gray-500">View all filings across the organization.</p></div>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <TZTable>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5}><TZSkeleton className="h-8 w-full" /></TableCell></TableRow>
            ) : filings.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-400">No filings found</TableCell></TableRow>
            ) : filings.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-medium">{f.client?.displayName}</TableCell>
                <TableCell><span className="px-2 py-0.5 text-[11px] font-bold text-brand-primary bg-brand-primary-light rounded-sm">{f.category}</span></TableCell>
                <TableCell className="text-gray-600">{new Date(f.periodStart).toLocaleDateString()}</TableCell>
                <TableCell className="text-gray-600">{new Date(f.dueAt).toLocaleDateString()}</TableCell>
                <TableCell><TZBadge variant={statusVariant[f.status] || 'secondary'}>{f.status.replace(/_/g, ' ')}</TZBadge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TZTable>
      </div>
    </div>
  );
}
