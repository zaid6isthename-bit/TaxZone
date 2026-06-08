"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { TZSkeleton } from "@/components/ui/skeleton";
import { Search, UserPlus } from "lucide-react";
import { employeesService, Employee } from "@/services/employees";
import { useAuthStore } from "@/lib/store";

export default function AdminEmployeesPage() {
  const [search, setSearch] = useState("");
  const user = useAuthStore((s) => s.user);

  const { data, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeesService.list(),
    enabled: !!user,
  });

  const employees: Employee[] = (data?.data || []).filter((e: Employee) =>
    !search || e.name?.toLowerCase().includes(search.toLowerCase()) || e.email?.toLowerCase().includes(search.toLowerCase())
  );

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <TZSkeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                  No employees found
                </TableCell>
              </TableRow>
            ) : employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <TZAvatar name={emp.name} size="sm" />
                    <div>
                      <p className="font-medium text-gray-900">{emp.name}</p>
                      <p className="text-xs text-gray-500">{emp.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{emp.userType}</TableCell>
                <TableCell className="font-medium">{emp._count?.clients || 0}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${(emp._count?.tasks || 0) > 15 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
                    {emp._count?.tasks || 0} tasks
                  </span>
                </TableCell>
                <TableCell>
                  <TZBadge variant={emp.status === 'active' ? 'success' : 'warning'}>
                    {emp.status}
                  </TZBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TZTable>
      </div>
    </div>
  );
}
