"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, FileSearch, ChevronRight, Calendar, Filter } from "lucide-react";
import { TZCard } from "@/components/ui/card";
import { TZStatusBadge } from "@/components/ui/status-badge";
import { TZInput } from "@/components/ui/input";
import { TZSkeleton } from "@/components/ui/skeleton";
import { TZEmptyState } from "@/components/ui/empty-state";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

const STATUS_FILTERS = ['All','Pending','In Progress','Completed','Overdue'] as const;

export default function FilingsPage() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: filings, isLoading } = useQuery({
    queryKey: ['filings', activeFilter, search, user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      let query = supabase.from('filings').select('*').eq('client_id', user!.id);
      
      if (activeFilter !== 'All') {
        const statusMap: any = {
          'Pending': 'not_started',
          'In Progress': 'in_progress',
          'Completed': 'completed',
          'Overdue': 'overdue' // Assuming overdue logic or status exists
        };
        query = query.eq('current_status', statusMap[activeFilter] || activeFilter.toLowerCase());
      }

      if (search) {
        query = query.ilike('type', `%${search}%`); // Search by type for now
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      
      return data.map(f => ({
        id: f.id,
        type: f.type,
        title: `${f.type} ${f.period}`,
        currentStatus: f.current_status,
        completionPercentage: f.completion_percentage,
        daysUntilDue: f.days_until_due,
        updatedAt: f.created_at
      }));
    },
  });

  const displayFilings = filings || [];

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-5 pt-5 pb-3">
        <h1 className="text-xl font-bold font-display text-gray-900 mb-4">My Filings</h1>

        {/* Search & Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search filings..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-100/50 border border-gray-100 rounded-xl
                         text-sm font-body text-gray-900 placeholder-gray-400
                         focus:outline-none focus:border-brand-primary focus:bg-white
                         transition-all duration-200"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold font-body whitespace-nowrap
                            transition-all duration-200 active:scale-95 ${
                  activeFilter === f
                    ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                    : 'bg-white border border-gray-100 text-gray-500 hover:border-brand-primary/30'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="px-5 py-5 space-y-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <FilingCardSkeleton key={i} />)
        ) : displayFilings.length > 0 ? (
          displayFilings.map((filing: any) => (
            <FilingCard
              key={filing.id}
              filing={filing}
              onClick={() => router.push(`/filings/${filing.id}`)}
            />
          ))
        ) : (
          <TZEmptyState
            icon={<FileSearch className="w-12 h-12 text-gray-300" />}
            title="No filings found"
            description="Your CA will create filings for you. Contact your CA firm to get started."
          />
        )}
      </div>
    </div>
  );
}

function FilingCard({ filing, onClick }: { filing: any; onClick: () => void }) {
  const isOverdue = new Date(filing.dueDate) < new Date() && filing.currentStatus !== 'completed';

  return (
    <TZCard
      onClick={onClick}
      interactive
      className={`p-5 relative ${isOverdue ? 'border-l-4 border-l-danger' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-block px-2 py-0.5 rounded-sm text-[9px] font-extrabold uppercase tracking-widest text-gray-400 bg-gray-50 mb-2">
            {filing.type}
          </span>
          <h3 className="text-base font-bold font-display text-gray-900 leading-tight pr-8">
            {filing.title}
          </h3>
        </div>
        {filing.priority === 'urgent' && (
          <div className="px-2 py-0.5 bg-danger text-white text-[9px] font-bold rounded-full animate-pulse">URGENT</div>
        )}
      </div>

      <div className="flex items-center gap-3 mt-4">
        <TZStatusBadge status={filing.currentStatus} size="xs" />
        <span className={`text-[11px] font-bold font-body ml-auto ${
          isOverdue ? 'text-danger' : filing.daysUntilDue <= 3 ? 'text-warning' : 'text-gray-400'
        }`}>
          {isOverdue ? `${Math.abs(filing.daysUntilDue)}d overdue` : `Due in ${filing.daysUntilDue} days`}
        </span>
      </div>

      <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${filing.completionPercentage === 100 ? 'bg-success' : 'bg-brand-primary'}`}
          style={{ width: `${filing.completionPercentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-3">
        <p className="text-[10px] font-medium text-gray-400 font-body uppercase tracking-wider">
          Updated 2 hours ago
        </p>
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </div>
    </TZCard>
  );
}

function FilingCardSkeleton() {
  return (
    <TZCard className="p-5 space-y-4">
      <div className="flex justify-between">
        <TZSkeleton className="h-4 w-16" />
        <TZSkeleton className="h-4 w-12 rounded-full" />
      </div>
      <TZSkeleton className="h-6 w-3/4" />
      <div className="flex justify-between">
        <TZSkeleton className="h-5 w-24" />
        <TZSkeleton className="h-3 w-20" />
      </div>
      <TZSkeleton className="h-1.5 w-full" />
    </TZCard>
  );
}
