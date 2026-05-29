"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Users, UserCheck, FileText, CalendarClock,
  AlertTriangle, Trophy, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, MoreVertical,
  ChevronRight, Clock
} from "lucide-react";
import { TZCard } from "@/components/ui/card";
import { TZStatusBadge } from "@/components/ui/status-badge";
import { TZSkeleton } from "@/components/ui/skeleton";
import { TZAvatar } from "@/components/ui/avatar";
import { TZButton } from "@/components/ui/button";
import apiClient from "@/lib/api";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const KPI_CARDS = [
  { label: 'Total Clients',   key: 'totalClients',   icon: Users,        color: 'brand-primary', delta: 2.5 },
  { label: 'Total Employees', key: 'totalEmployees', icon: UserCheck,    color: 'info',          delta: 0   },
  { label: 'Active Filings',  key: 'activeFilings',  icon: FileText,     color: 'warning',       delta: 12.4},
  { label: 'Due This Week',   key: 'dueThisWeek',    icon: CalendarClock,color: 'warning',       delta: -5.2},
  { label: 'Overdue Filings', key: 'overdueCount',   icon: AlertTriangle,color: 'danger',        delta: 2   },
  { label: 'Completed YTD',   key: 'completedYTD',   icon: Trophy,       color: 'success',       delta: 18.5},
];

const STATUS_COLORS: Record<string, string> = {
  completed: '#16A34A',
  in_progress: '#0284C7',
  not_started: '#9CA3AF',
  overdue: '#DC2626',
  underReview: '#1A4FBA',
};

export default function AdminDashboard() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => apiClient.get('/admin/dashboard').then(r => r.data),
  });

  const data = dashboard || {
    totalClients: 1248,
    totalEmployees: 24,
    activeFilings: 312,
    dueThisWeek: 45,
    overdueCount: 8,
    completedYTD: 4820,
    priorityQueue: [
      { id: "f1", clientName: "Acme Corp Ltd", type: "GSTR-1", currentStatus: "underReview", dueDate: "2024-10-31", daysUntilDue: 2, isOverdue: false },
      { id: "f2", clientName: "Rajesh Kumar", type: "ITR-1", currentStatus: "needs_correction", dueDate: "2024-10-25", daysUntilDue: -4, isOverdue: true },
      { id: "f3", clientName: "TechNova Inc", type: "TDS", currentStatus: "awaiting_documents", dueDate: "2024-11-05", daysUntilDue: 7, isOverdue: false },
    ],
    monthlyTrend: [
      { month: 'Jun', created: 450, completed: 380 },
      { month: 'Jul', created: 520, completed: 490 },
      { month: 'Aug', created: 480, completed: 460 },
      { month: 'Sep', created: 610, completed: 540 },
      { month: 'Oct', created: 580, completed: 510 },
    ],
    statusDistribution: [
      { status: 'completed', count: 65 },
      { status: 'in_progress', count: 20 },
      { status: 'underReview', count: 10 },
      { status: 'overdue', count: 5 },
    ],
    recentActivity: [
      { id: "a1", actorName: "Amit Patel", actionDescription: "filed ITR-1 for", resourceName: "Rajesh Kumar", createdAt: "2024-10-29T10:30:00Z" },
      { id: "a2", actorName: "Priya Sharma", actionDescription: "approved document for", resourceName: "Acme Corp", createdAt: "2024-10-29T09:45:00Z" },
      { id: "a3", actorName: "System", actionDescription: "flagged overdue filing for", resourceName: "Sunil Desai", createdAt: "2024-10-29T08:00:00Z" },
    ]
  };

  if (isLoading) return <AdminDashboardSkeleton />;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {KPI_CARDS.map((kpi: any) => (
          <TZCard key={kpi.label} className="p-6 border-none shadow-sm shadow-black/[0.03]">
            <div className="flex items-center justify-between">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm", `bg-${kpi.color}-light`)}>
                <kpi.icon className={cn("w-5 h-5", `text-${kpi.color}`)} />
              </div>
              {kpi.delta !== 0 && (
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-inner",
                  kpi.delta > 0 ? 'bg-success-light text-success' : 'bg-danger-light text-danger'
                )}>
                  {kpi.delta > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {Math.abs(kpi.delta)}%
                </span>
              )}
            </div>
            <p className="text-3xl font-extrabold font-display text-gray-900 mt-4 tracking-tight tabular-nums">
              {data[kpi.key as keyof typeof data]?.toLocaleString()}
            </p>
            <p className="text-xs font-bold font-display text-gray-400 uppercase tracking-widest mt-1">{kpi.label}</p>
          </TZCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Priority Queue */}
        <div className="lg:col-span-2">
          <TZCard className="border-none shadow-sm shadow-black/[0.03] overflow-hidden flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 bg-white">
              <h2 className="font-bold font-display text-gray-900 flex items-center gap-2">
                <AlertTriangle size={18} className="text-warning" />
                Needs Attention
              </h2>
              <Link href="/admin/filings?filter=urgent" className="text-xs font-bold text-brand-primary uppercase tracking-widest hover:underline transition-all">View all</Link>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-50">
                    {['Client', 'Type', 'Status', 'Due Date', ''].map(h => (
                      <th key={h} className="px-6 py-3 text-[10px] font-extrabold font-display text-gray-400 uppercase tracking-[0.1em]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.priorityQueue.map((filing: any) => (
                    <tr key={filing.id} className="group hover:bg-brand-primary/[0.01] transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <TZAvatar name={filing.clientName} size="xs" />
                          <span className="text-sm font-bold text-gray-900 group-hover:text-brand-primary transition-colors">{filing.clientName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-500">{filing.type}</span>
                      </td>
                      <td className="px-6 py-4"><TZStatusBadge status={filing.currentStatus} size="xs" /></td>
                      <td className="px-6 py-4">
                        <span className={cn("text-xs font-bold", filing.isOverdue ? 'text-danger' : 'text-gray-500')}>
                          {filing.isOverdue ? `${Math.abs(filing.daysUntilDue)}d overdue` : `In ${filing.daysUntilDue} days`}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <TZButton variant="ghost" size="xs" className="opacity-0 group-hover:opacity-100 transition-all rounded-full h-8 w-8 p-0">
                          <ChevronRight size={16} />
                        </TZButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TZCard>
        </div>

        {/* Status Distribution */}
        <TZCard className="p-6 border-none shadow-sm shadow-black/[0.03] flex flex-col">
          <h2 className="font-bold font-display text-gray-900 mb-8 uppercase tracking-widest text-xs text-center border-b border-gray-50 pb-4">Filing Distribution</h2>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="count"
                  stroke="none"
                >
                  {data.statusDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold', fontFamily: 'DM Sans' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {data.statusDistribution.map((entry: any) => (
              <div key={entry.status} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.status] }} />
                <span className="text-[11px] font-bold text-gray-600 uppercase tracking-tighter truncate">{entry.status.replace('_', ' ')}</span>
                <span className="text-xs font-bold text-gray-900 ml-auto">{entry.count}%</span>
              </div>
            ))}
          </div>
        </TZCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Chart */}
        <TZCard className="lg:col-span-2 p-6 border-none shadow-sm shadow-black/[0.03]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-bold font-display text-gray-900 uppercase tracking-widest text-xs">Performance Trend</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-primary" /><span className="text-[10px] font-bold text-gray-400">COMPLETED</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-200" /><span className="text-[10px] font-bold text-gray-400">CREATED</span></div>
            </div>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 'bold', fill: '#9CA3AF', fontFamily: 'Plus Jakarta Sans' }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#9CA3AF', fontFamily: 'Plus Jakarta Sans' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#1A4FBA"
                  strokeWidth={3}
                  dot={{ fill: '#1A4FBA', r: 4, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="created"
                  stroke="#E5E7EB"
                  strokeWidth={3}
                  dot={{ fill: '#E5E7EB', r: 4, strokeWidth: 2, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TZCard>

        {/* Recent Activity */}
        <TZCard className="border-none shadow-sm shadow-black/[0.03] flex flex-col h-full">
          <div className="px-6 py-5 border-b border-gray-50 bg-white">
            <h2 className="font-bold font-display text-gray-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-brand-primary" />
              Recent Activity
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
            {data.recentActivity.map((activity: any, i: number) => (
              <div key={activity.id} className="flex gap-4 relative">
                {i !== data.recentActivity.length - 1 && (
                  <div className="absolute left-[18px] top-10 bottom-[-24px] w-px bg-gray-100" />
                )}
                <TZAvatar name={activity.actorName} size="xs" className="ring-4 ring-gray-50 z-10" />
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-gray-700 leading-snug">
                    <span className="font-bold text-gray-900">{activity.actorName}</span>
                    {' '}{activity.actionDescription}{' '}
                    <span className="font-bold text-brand-primary">{activity.resourceName}</span>
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest flex items-center gap-1.5">
                    <Clock size={10} />
                    15 mins ago
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50/50 border-t border-gray-50">
            <button className="w-full py-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-widest hover:text-brand-primary transition-all">View full audit trail</button>
          </div>
        </TZCard>
      </div>
    </div>
  );
}

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8 p-8">
      <div className="grid grid-cols-6 gap-6">
        {Array(6).fill(0).map((_, i) => <TZSkeleton key={i} className="h-32 w-full rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-3 gap-8">
        <TZSkeleton className="col-span-2 h-[400px] rounded-2xl" />
        <TZSkeleton className="h-[400px] rounded-2xl" />
      </div>
    </div>
  );
}
