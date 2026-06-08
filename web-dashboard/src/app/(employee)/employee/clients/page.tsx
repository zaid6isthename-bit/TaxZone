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
import { Search, Plus } from "lucide-react";
import { clientsService, Client } from "@/services/clients";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const { data, isLoading } = useQuery({
    queryKey: ['employee-clients', search],
    queryFn: () => clientsService.list({ search, assignedEmployeeId: user?.id }),
    enabled: !!user,
  });

  const clients: Client[] = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">Clients</h1>
          <p className="text-gray-500">Manage your client portfolio.</p>
        </div>
        <TZButton className="gap-2"><Plus size={18} />Add Client</TZButton>
      </div>

      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex w-1/3">
          <TZInput 
            placeholder="Search clients..." 
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
              <TableHead>Client Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>PAN</TableHead>
              <TableHead>GSTIN</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Filings</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8"><TZSkeleton className="h-8 w-full" /></TableCell></TableRow>
            ) : clients.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-400">No clients found</TableCell></TableRow>
            ) : clients.map((client) => (
              <TableRow key={client.id} className="cursor-pointer hover:bg-gray-50" onClick={() => router.push(`/employee/clients/detail?id=${client.id}`)}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <TZAvatar name={client.displayName} size="sm" />
                    <div>
                      <p className="font-medium text-gray-900">{client.displayName}</p>
                      <p className="text-xs text-gray-500">{client.clientUser?.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{client.businessType}</TableCell>
                <TableCell className="text-gray-500 text-sm">{client.pan || '-'}</TableCell>
                <TableCell className="text-gray-500 text-sm">{client.gstin || '-'}</TableCell>
                <TableCell>
                  <TZBadge variant={client.onboardingStatus === 'active' ? 'success' : 'secondary'}>{client.onboardingStatus}</TZBadge>
                </TableCell>
                <TableCell className="font-medium">{client._count?.filings || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TZTable>
      </div>
    </div>
  );
}
