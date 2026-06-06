"use client";

import { TZCard } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const monthlyFilings = [
  { month: "Jun", filings: 62 }, { month: "Jul", filings: 88 }, { month: "Aug", filings: 55 },
  { month: "Sep", filings: 74 }, { month: "Oct", filings: 92 }, { month: "Nov", filings: 45 },
];

const revenueData = [
  { month: "Jun", revenue: 185000 }, { month: "Jul", revenue: 210000 }, { month: "Aug", revenue: 162000 },
  { month: "Sep", revenue: 224000 }, { month: "Oct", revenue: 246000 }, { month: "Nov", revenue: 128000 },
];

const statusBreakdown = [
  { name: "Completed", value: 68, color: "#16A34A" },
  { name: "In Progress", value: 18, color: "#0284C7" },
  { name: "Not Started", value: 9, color: "#9CA3AF" },
  { name: "Overdue", value: 5, color: "#DC2626" },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-gray-900">Analytics</h1>
        <p className="text-gray-500">Practice performance and filing metrics overview.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Filings MTD", value: "92", delta: "+12%", up: true },
          { label: "Revenue MTD", value: "₹2.46L", delta: "+9.8%", up: true },
          { label: "Client Retention", value: "96.2%", delta: "+0.4%", up: true },
          { label: "Avg. Turnaround", value: "4.2 days", delta: "-0.8d", up: true },
        ].map((kpi) => (
          <TZCard key={kpi.label} className="p-5">
            <p className="text-sm text-gray-500 mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold font-display text-gray-900">{kpi.value}</p>
            <span className={`mt-1 inline-flex items-center text-xs font-semibold ${kpi.up ? "text-success" : "text-danger"}`}>
              {kpi.delta} vs last month
            </span>
          </TZCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Filings Bar Chart */}
        <TZCard className="lg:col-span-2 p-5">
          <h3 className="text-base font-semibold font-display text-gray-900 mb-6">Filings per Month</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyFilings} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.07)" }}
                cursor={{ fill: "#EBF1FF" }}
              />
              <Bar dataKey="filings" fill="#1A4FBA" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </TZCard>

        {/* Status Breakdown Pie */}
        <TZCard className="p-5">
          <h3 className="text-base font-semibold font-display text-gray-900 mb-4">Filing Status</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {statusBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {statusBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }}></span>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </TZCard>
      </div>

      {/* Revenue line chart */}
      <TZCard className="p-5">
        <h3 className="text-base font-semibold font-display text-gray-900 mb-6">Revenue Trend (₹)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px" }}
              formatter={(v: any) => [`₹${Number(v || 0).toLocaleString("en-IN")}`, "Revenue"]}
            />
            <Line type="monotone" dataKey="revenue" stroke="#1A4FBA" strokeWidth={2.5} dot={{ fill: "#1A4FBA", strokeWidth: 2, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </TZCard>
    </div>
  );
}
