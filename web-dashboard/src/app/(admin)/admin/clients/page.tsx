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
import { Search, Plus, MoreHorizontal, Filter, Download } from "lucide-react";

const allClients = [
  { id: "CL-001", name: "Rajesh Kumar", type: "Individual", assignee: "Priya Sharma", status: "Active", revenue: "₹15,000" },
  { id: "CL-002", name: "Acme Corp Ltd", type: "Corporate", assignee: "Amit Patel", status: "Active", revenue: "₹1,20,000" },
  { id: "CL-003", name: "TechNova Solutions", type: "Corporate", assignee: "Priya Sharma", status: "Onboarding", revenue: "₹85,000" },
  { id: "CL-004", name: "Sunil Desai", type: "Individual", assignee: "Unassigned", status: "Inactive", revenue: "₹0" },
];

export default function AdminClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">All Clients</h1>
          <p className="text-gray-500">Firm-wide client directory and assignments.</p>
        </div>
        <div className="flex gap-2">
          <TZButton variant="outline" className="gap-2">
            <Download size={18} /> Export CSV
          </TZButton>
          <TZButton className="gap-2">
            <Plus size={18} /> New Client
          </TZButton>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex w-1/3">
          <TZInput 
            placeholder="Search all clients..." 
            icon={<Search size={18} />}
          />
        </div>
        <div className="flex gap-2">
          <TZButton variant="outline" className="gap-2"><Filter size={16} /> Filters</TZButton>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <TZTable>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>YTD Revenue</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <TZAvatar fallback={client.name.substring(0,2)} />
                    <div>
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{client.type}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${client.assignee === 'Unassigned' ? 'bg-danger' : 'bg-success'}`}></div>
                    <span className="text-sm text-gray-700">{client.assignee}</span>
                  </div>
                </TableCell>
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
                <TableCell className="font-medium text-gray-900">{client.revenue}</TableCell>
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
