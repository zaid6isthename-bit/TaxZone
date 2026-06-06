"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, Settings, Upload, ChevronRight, Calendar, Phone, MessageCircle } from "lucide-react";
import { TZCard } from "@/components/ui/card";
import { TZStatusBadge } from "@/components/ui/status-badge";
import { TZAvatar } from "@/components/ui/avatar";
import { TZSkeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

export default function ClientDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      // Fetch Pending Documents
      const { count: pendingDocsCount } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', user!.id)
        .eq('status', 'pending');

      // Fetch Recent Filings
      const { data: recentFilings } = await supabase
        .from('filings')
        .select('*')
        .eq('client_id', user!.id)
        .order('days_until_due', { ascending: true })
        .limit(3);

      // Fetch Assigned CA
      let employee = { name: "Not Assigned", designation: "N/A", phone: "" };
      if (recentFilings && recentFilings.length > 0 && recentFilings[0].assigned_ca_id) {
        const { data: caData } = await supabase
          .from('users')
          .select('name, phone')
          .eq('id', recentFilings[0].assigned_ca_id)
          .single();
        if (caData) {
          employee = { name: caData.name, designation: "Tax Associate", phone: caData.phone || "" };
        }
      }

      return {
        pendingDocumentRequests: pendingDocsCount || 0,
        recentFilings: (recentFilings || []).map(f => ({
          id: f.id,
          type: f.type,
          period: f.period,
          currentStatus: f.current_status,
          completionPercentage: f.completion_percentage,
          daysUntilDue: f.days_until_due
        })),
        upcomingDeadlines: (recentFilings || []).map(f => {
          // Format date assuming days_until_due gives us the date
          const d = new Date();
          d.setDate(d.getDate() + (f.days_until_due || 0));
          const month = d.toLocaleString('en-US', { month: 'short' });
          const date = d.getDate().toString();
          return { date, month, title: `${f.type} ${month}`, status: f.current_status };
        }),
        employee
      };
    },
  });

  if (isLoading || !data) return <DashboardSkeleton />;

  const handleMessage = () => {
    const message = encodeURIComponent("Hi, I have a query regarding my tax filing.");
    if (data.employee.phone) {
      window.open(`https://wa.me/${data.employee.phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-gray-50 animate-fade-in">
      {/* AppBar */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div
          className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-all"
          onClick={() => router.push('/profile')}
        >
          <TZAvatar name={user?.name || "Rajesh Kumar"} size="md" className="group-hover:ring-2 ring-brand-primary/20 transition-all" />
          <div>
            <p className="text-xs text-gray-400 font-medium font-body uppercase tracking-wider">Good morning</p>
            <h1 className="text-base font-bold text-gray-900 font-display -mt-0.5">Hi, {user?.name?.split(' ')[0] || "Rajesh"} 👋</h1>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => router.push('/notifications')}
            className="relative p-2.5 text-gray-700 hover:bg-gray-100 rounded-full transition-all active:scale-90"
          >
            <Bell size={22} />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white" />
          </button>
          <button
            onClick={() => router.push('/profile')}
            className="p-2.5 text-gray-700 hover:bg-gray-100 rounded-full transition-all active:scale-90"
          >
            <Settings size={22} />
          </button>
        </div>
      </header>

      {/* Pending Actions Banner */}
      {data.pendingDocumentRequests > 0 && (
        <div className="px-5 pt-5 pb-2">
          <div
            onClick={() => router.push('/documents')}
            className="flex items-center justify-between p-4 rounded-2xl bg-brand-primary-light border border-brand-primary/10 cursor-pointer hover:bg-brand-primary-light/80 transition-all active:scale-[0.98] shadow-sm shadow-brand-primary/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-primary">
                <Upload size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-tight">Action Required</p>
                <p className="text-xs text-gray-500 font-body mt-0.5">{data.pendingDocumentRequests} document(s) need your attention</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-brand-primary" />
          </div>
        </div>
      )}

      {/* Your Filings */}
      <section className="pt-4">
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-[17px] font-bold text-gray-900 font-display">Your Filings</h2>
          <button onClick={() => router.push('/filings')} className="text-[13px] font-bold text-brand-primary hover:underline transition-all">See All</button>
        </div>

        <div className="flex gap-4 overflow-x-auto px-5 pb-5 no-scrollbar">
          {data.recentFilings.map((filing: any) => (
            <TZCard
              key={filing.id}
              interactive
              className="min-w-[240px] p-5 flex-shrink-0"
              onClick={() => router.push(`/filings/details?id=${filing.id}`)}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <TZStatusBadge status={filing.currentStatus} size="xs" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded-sm">
                    {filing.type}
                  </span>
                </div>

                <p className="text-base font-bold text-gray-900 mb-4 font-display">
                  {filing.period}
                </p>

                {/* Progress Section */}
                <div className="mt-auto pt-2">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase">Progress</span>
                    <span className="text-xs font-bold text-brand-primary">{filing.completionPercentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${filing.completionPercentage === 100 ? 'bg-success' : 'bg-brand-primary'}`}
                      style={{ width: `${filing.completionPercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-1.5 mt-3 text-[11px] font-medium text-gray-400">
                    <Calendar size={12} />
                    <span>
                      {filing.daysUntilDue < 0 ? `${Math.abs(filing.daysUntilDue)}d overdue` : `Due in ${filing.daysUntilDue} days`}
                    </span>
                  </div>
                </div>
              </div>
            </TZCard>
          ))}
        </div>
      </section>

      {/* Upcoming Deadlines */}
      <section className="px-5 pb-6">
        <h2 className="text-[17px] font-bold text-gray-900 mb-4 font-display flex items-center gap-2">
          Upcoming Deadlines
        </h2>
        <div className="flex flex-col gap-3">
          {data.upcomingDeadlines.map((d: any, i: number) => (
            <TZCard
              key={i}
              interactive
              className="p-4 flex items-center justify-between"
              onClick={() => router.push('/filings')}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-14 rounded-xl bg-brand-primary-light flex flex-col items-center justify-center shrink-0 border border-brand-primary/5">
                  <span className="text-[20px] font-extrabold text-brand-primary leading-none font-display">{d.date}</span>
                  <span className="text-[10px] font-bold text-brand-primary mt-1 uppercase">{d.month}</span>
                </div>
                <div>
                  <p className="text-[15px] font-bold text-gray-900 mb-1.5">{d.title}</p>
                  <TZStatusBadge status={d.status} size="xs" />
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </TZCard>
          ))}
        </div>
      </section>

      {/* Assigned CA Card */}
      <section className="px-5 pb-8">
        <TZCard className="p-5 border-brand-primary/5 bg-white">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            Your Assigned CA
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <TZAvatar name={data.employee.name} size="lg" />
              <div>
                <p className="text-base font-bold text-gray-900 leading-tight">{data.employee.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">{data.employee.designation}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${data.employee.phone}`}
                className="w-11 h-11 rounded-xl border border-gray-100 bg-gray-50 text-gray-700 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all active:scale-90 shadow-sm"
              >
                <Phone size={18} />
              </a>
              <button
                onClick={handleMessage}
                className="w-11 h-11 rounded-xl border border-success/10 bg-success-light text-success flex items-center justify-center hover:bg-success hover:text-white transition-all active:scale-90 shadow-sm"
              >
                <MessageCircle size={18} />
              </button>
            </div>
          </div>
        </TZCard>
      </section>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="px-5 py-4 bg-white flex justify-between">
        <div className="flex gap-3">
          <TZSkeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <TZSkeleton className="h-3 w-16" />
            <TZSkeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex gap-2">
          <TZSkeleton className="w-10 h-10 rounded-full" />
          <TZSkeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>
      <div className="p-5">
        <TZSkeleton className="h-20 w-full rounded-2xl" />
      </div>
      <div className="px-5 space-y-4">
        <TZSkeleton className="h-6 w-32" />
        <div className="flex gap-4 overflow-hidden">
          <TZSkeleton className="h-40 min-w-[240px] rounded-2xl" />
          <TZSkeleton className="h-40 min-w-[240px] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
