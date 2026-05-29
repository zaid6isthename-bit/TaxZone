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
import { Search, UserPlus, MoreHorizontal } from "lucide-react";

const employees = [
  { id: "EMP-01", name: "Priya Sharma", role: "Tax Associate", clients: 45, pendingTasks: 12, status: "Active" },
  { id: "EMP-02", name: "Amit Patel", role: "Senior CA", clients: 28, pendingTasks: 5, status: "Active" },
  { id: "EMP-03", name: "Neha Gupta", role: "Audit Assistant", clients: 15, pendingTasks: 22, status: "Active" },
  { id: "EMP-04", name: "Rahul Verma", role: "Tax Associate", clients: 0, pendingTasks: 0, status: "On Leave" },
];

export default function AdminEmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">Employees</h1>
          <p className="text-gray-500">Manage your firm's staff and their workloads.</p>
        </div>
        <TZButton className="gap-2">
          <UserPlus size={18} /> Add Employee
        </TZButton>
      </div>

      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex w-1/3">
          <TZInput 
            placeholder="Search staff..." 
            icon={<Search size={18} />}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <TZTable>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Assigned Clients</TableHead>
              <TableHead>Pending Tasks</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <TZAvatar name={emp.name} size="sm" />
                    <div>
                      <p className="font-medium text-gray-900">{emp.name}</p>
                      <p className="text-xs text-gray-500">{emp.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{emp.role}</TableCell>
                <TableCell className="font-medium">{emp.clients}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${emp.pendingTasks > 15 ? 'bg-danger-light text-danger' : 'bg-gray-100 text-gray-700'}`}>
                    {emp.pendingTasks} tasks
                  </span>
                </TableCell>
                <TableCell>
                  <TZBadge variant={emp.status === 'Active' ? 'success' : 'warning'}>
                    {emp.status}
                  </TZBadge>
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
