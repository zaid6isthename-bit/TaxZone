"use client";

import { useQuery } from "@tanstack/react-query";
import { TZCard } from "@/components/ui/card";
import { TZSkeleton } from "@/components/ui/skeleton";
import { Users, FileText, CheckSquare, Clock } from "lucide-react";
import { filingsService } from "@/services/filings";
import { tasksService } from "@/services/tasks";
import { clientsService } from "@/services/clients";
import { useAuthStore } from "@/lib/store";

export default function EmployeeDashboard() {
  const user = useAuthStore((s) => s.user);

  const { data: filingsData, isLoading: filingsLoading } = useQuery({
    queryKey: ['employee-filings'],
    queryFn: () => filingsService.list({ assignedEmployeeId: user?.id }),
    enabled: !!user,
  });

  const { data: tasksData } = useQuery({
    queryKey: ['employee-tasks'],
    queryFn: () => tasksService.list({ assignedToId: user?.id }),
    enabled: !!user,
  });

  const { data: clientsData } = useQuery({
    queryKey: ['employee-clients'],
    queryFn: () => clientsService.list({ assignedEmployeeId: user?.id }),
    enabled: !!user,
  });

  const filings = filingsData?.data || [];
  const tasks = tasksData?.data || [];
  const clients = clientsData?.data || [];
  const pendingFilings = filings.filter((f: any) => ['not_started', 'awaiting_documents', 'in_progress'].includes(f.status));
  const overdueTasks = tasks.filter((t: any) => t.status !== 'done' && t.status !== 'cancelled');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back. Here's your overview for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TZCard className="p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Clients</p>
            {filingsLoading ? <TZSkeleton className="h-8 w-16" /> : <p className="text-2xl font-bold text-gray-900">{clients.length}</p>}
          </div>
        </TZCard>
        
        <TZCard className="p-5 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><FileText size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Filings Done (This Month)</p>
            {filingsLoading ? <TZSkeleton className="h-8 w-16" /> : <p className="text-2xl font-bold text-gray-900">{filings.filter((f: any) => f.status === 'completed' || f.status === 'filed').length}</p>}
          </div>
        </TZCard>

        <TZCard className="p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><Clock size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Filings</p>
            {filingsLoading ? <TZSkeleton className="h-8 w-16" /> : <p className="text-2xl font-bold text-gray-900">{pendingFilings.length}</p>}
          </div>
        </TZCard>

        <TZCard className="p-5 flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg"><CheckSquare size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Open Tasks</p>
            {filingsLoading ? <TZSkeleton className="h-8 w-16" /> : <p className="text-2xl font-bold text-gray-900">{overdueTasks.length}</p>}
          </div>
        </TZCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TZCard className="p-5">
            <h3 className="text-lg font-semibold font-display mb-4">Recent Filings</h3>
            {filingsLoading ? (
              <TZSkeleton className="h-64 w-full" />
            ) : filings.length === 0 ? (
              <p className="text-gray-400 text-center py-12">No filings assigned yet</p>
            ) : (
              <div className="space-y-3">
                {filings.slice(0, 5).map((filing: any) => (
                  <div key={filing.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{filing.client?.displayName}</p>
                      <p className="text-sm text-gray-500">{filing.category} - {new Date(filing.dueAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      filing.status === 'completed' ? 'bg-green-100 text-green-700' :
                      filing.status === 'filed' ? 'bg-blue-100 text-blue-700' :
                      filing.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{filing.status}</span>
                  </div>
                ))}
              </div>
            )}
          </TZCard>
        </div>
        <div>
          <TZCard className="p-5">
            <h3 className="text-lg font-semibold font-display mb-4">Upcoming Deadlines</h3>
            {filingsLoading ? (
              <TZSkeleton className="h-64 w-full" />
            ) : filings.length === 0 ? (
              <p className="text-gray-400 text-center py-12">No upcoming deadlines</p>
            ) : (
              <div className="space-y-3">
                {filings
                  .filter((f: any) => f.status !== 'completed' && f.status !== 'filed')
                  .slice(0, 5)
                  .map((filing: any) => (
                    <div key={filing.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{filing.client?.displayName}</p>
                        <p className="text-sm text-gray-500">{filing.category}</p>
                      </div>
                      <span className="text-xs font-medium text-red-600">
                        {Math.ceil((new Date(filing.dueAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d left
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </TZCard>
        </div>
      </div>
    </div>
  );
}
