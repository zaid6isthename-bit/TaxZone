"use client";

import { 
  TZTable, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { TZButton } from "@/components/ui/button";
import { TZInput } from "@/components/ui/input";
import { TZBadge } from "@/components/ui/badge";
import { TZAvatar } from "@/components/ui/avatar";
import { Search, Plus, MoreHorizontal } from "lucide-react";

// Mock data
const clients = [
  { id: "CL-001", name: "Rajesh Kumar", type: "Individual", status: "Active", recentFiling: "ITR - Under Review" },
  { id: "CL-002", name: "Acme Corp Ltd", type: "Corporate", status: "Active", recentFiling: "GSTR-1 - Pending" },
  { id: "CL-003", name: "TechNova Solutions", type: "Corporate", status: "Onboarding", recentFiling: "N/A" },
  { id: "CL-004", name: "Priya Singh", type: "Individual", status: "Inactive", recentFiling: "ITR - Completed" },
  { id: "CL-005", name: "Global Exports", type: "Corporate", status: "Active", recentFiling: "GSTR-3B - Draft" },
];

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">Clients</h1>
          <p className="text-gray-500">Manage your client portfolio.</p>
        </div>
        <TZButton className="gap-2">
          <Plus size={18} />
          Add Client
        </TZButton>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex w-1/3">
          <TZInput 
            placeholder="Search clients..." 
            icon={<Search size={18} />}
          />
        </div>
        <div className="flex gap-2">
          <TZButton variant="outline">Filter</TZButton>
          <TZButton variant="outline">Export</TZButton>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <TZTable>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Recent Filing</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id} className="cursor-pointer">
                <TableCell className="font-medium text-gray-500">{client.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <TZAvatar 
                      name={client.name}
                      size="sm"
                    />
                    <span className="font-medium text-gray-900">{client.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{client.type}</TableCell>
                <TableCell>
                  <TZBadge 
                    variant={
                      client.status === 'Active' ? 'success' : 
                      client.status === 'Onboarding' ? 'warning' : 'secondary'
                    }
                  >
                    {client.status}
                  </TZBadge>
                </TableCell>
                <TableCell className="text-gray-600">{client.recentFiling}</TableCell>
                <TableCell className="text-right">
                  <TZButton variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
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
