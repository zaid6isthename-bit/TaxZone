"use client";

import { TZTable, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { TZButton } from "@/components/ui/button";
import { TZInput } from "@/components/ui/input";
import { TZBadge } from "@/components/ui/badge";
import { Search, Plus, Filter, Calendar, MoreHorizontal } from "lucide-react";

const filings = [
  { id: "FIL-001", client: "Rajesh Kumar", type: "GSTR-1", period: "Oct 2024", due: "31 Oct 2024", status: "Under Review", assignee: "Priya S." },
  { id: "FIL-002", client: "Acme Corp", type: "GSTR-3B", period: "Oct 2024", due: "20 Nov 2024", status: "In Progress", assignee: "Amit P." },
  { id: "FIL-003", client: "Priya Singh", type: "ITR-1", period: "FY 24-25", due: "31 Jul 2025", status: "Not Started", assignee: "Priya S." },
  { id: "FIL-004", client: "TechNova", type: "GSTR-9", period: "FY 23-24", due: "31 Dec 2024", status: "Completed", assignee: "Neha G." },
  { id: "FIL-005", client: "Global Exports", type: "TDS Return", period: "Q2 FY25", due: "15 Oct 2024", status: "Overdue", assignee: "Amit P." },
];

const statusVariant: Record<string, any> = {
  "Under Review": "underReview",
  "In Progress": "inProgress",
  "Not Started": "secondary",
  "Completed": "completed",
  "Overdue": "danger",
};

export default function EmployeeFilingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">Filings</h1>
          <p className="text-gray-500">Track all client filings across deadlines and statuses.</p>
        </div>
        <TZButton className="gap-2"><Plus size={18} /> New Filing</TZButton>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total", count: 48, color: "text-gray-900", bg: "bg-gray-50" },
          { label: "In Progress", count: 14, color: "text-info", bg: "bg-info-light" },
          { label: "Overdue", count: 3, color: "text-danger", bg: "bg-danger-light" },
          { label: "Done (MTD)", count: 18, color: "text-success", bg: "bg-success-light" },
        ].map((s) => (
          <div key={s.label} className={`p-4 rounded-xl border border-gray-200 ${s.bg}`}>
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.count}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex w-1/3">
          <TZInput placeholder="Search filings..." icon={<Search size={18} />} />
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
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Filing Type</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filings.map((f) => (
              <TableRow key={f.id} className="cursor-pointer">
                <TableCell className="text-xs text-gray-500 font-mono">{f.id}</TableCell>
                <TableCell className="font-medium text-gray-900">{f.client}</TableCell>
                <TableCell>
                  <span className="px-2 py-0.5 text-[11px] font-bold text-brand-primary bg-brand-primary-light rounded-sm">{f.type}</span>
                </TableCell>
                <TableCell className="text-gray-600">{f.period}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Calendar size={13} className="text-gray-400" />
                    {f.due}
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{f.assignee}</TableCell>
                <TableCell>
                  <TZBadge variant={statusVariant[f.status]}>{f.status}</TZBadge>
                </TableCell>
                <TableCell className="text-right">
                  <TZButton variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400">
                    <MoreHorizontal size={18} />
                  </TZButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TZTable>
      </div>
    </div>
  );
}
