"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search, Plus, Upload, Filter, MoreHorizontal,
  Eye, Edit, UserPlus, ChevronRight, X, Phone, Mail,
  MapPin, Hash, Briefcase, Calendar, Clock
} from "lucide-react";
import { TZCard } from "@/components/ui/card";
import { TZStatusBadge } from "@/components/ui/status-badge";
import { TZSkeleton } from "@/components/ui/skeleton";
import { TZAvatar } from "@/components/ui/avatar";
import { TZButton } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import * as Tabs from "@radix-ui/react-tabs";

export default function AdminClientsPage() {
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const { data: clients, isLoading } = useQuery({
    queryKey: ['admin-clients', search],
    queryFn: async () => {
      let query = supabase
        .from('users')
        .select('id, name, phone, email, business_name, gstin, role, created_at')
        .eq('role', 'client');

      if (search) {
        query = query.or(`name.ilike.%${search}%,gstin.ilike.%${search}%,phone.ilike.%${search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;

      return data.map((u: any) => ({
        id: u.id,
        name: u.name,
        type: u.business_name ? 'Corporate' : 'Individual',
        gstin: u.gstin,
        phone: u.phone,
        email: u.email,
        assignee: 'Unassigned',
        status: 'not_started',
        department: 'Income Tax',
        activeFilings: 0,
        lastActivity: u.created_at,
      }));
    },
  });

  const displayClients = clients || [];

  const selectedClient = displayClients.find((c: any) => c.id === selectedClientId);

  return (
    <div className="flex h-full relative">
      <div className={cn("flex-1 space-y-6 transition-all duration-300 pr-0", selectedClientId && "pr-[480px]")}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display text-gray-900">Clients</h1>
            <p className="text-sm font-body text-gray-500 mt-0.5">{displayClients.length} registered clients</p>
          </div>
          <div className="flex gap-3">
            <TZButton variant="outline" className="rounded-xl font-bold text-xs uppercase tracking-widest px-6 h-11 border-gray-200">
              <Upload size={16} className="mr-2" /> Bulk Import
            </TZButton>
            <TZButton variant="primary" className="rounded-xl font-bold text-xs uppercase tracking-widest px-6 h-11 shadow-lg shadow-brand-primary/20">
              <Plus size={16} className="mr-2" /> Add Client
            </TZButton>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/[0.02] p-4 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[320px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search clients by name, GSTIN, PAN or phone..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl
                         text-sm font-body text-gray-900 placeholder-gray-400
                         focus:outline-none focus:border-brand-primary focus:bg-white
                         transition-all duration-200"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Clients Table */}
        <TZCard className="border-none shadow-sm shadow-black/[0.03] overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  {['Client Name', 'GSTIN / PAN', 'Department', 'Assigned To', 'Filings', 'Status', ''].map(h => (
                    <th key={h} className="px-6 py-4 text-[10px] font-extrabold font-display text-gray-400 uppercase tracking-[0.15em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={7}><TZSkeleton className="h-16 w-full rounded-none" /></td></tr>)
                ) : displayClients.map((client: any) => (
                  <tr
                    key={client.id}
                    onClick={() => setSelectedClientId(client.id)}
                    className={cn(
                      "group hover:bg-brand-primary/[0.01] transition-all cursor-pointer",
                      selectedClientId === client.id && "bg-brand-primary/[0.03]"
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <TZAvatar name={client.name} size="sm" />
                        <div>
                          <p className="text-sm font-bold text-gray-900 group-hover:text-brand-primary transition-colors">{client.name}</p>
                          <p className="text-[11px] font-medium text-gray-400 font-body">{client.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{client.gstin || "N/A"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-tighter">{client.department}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-1.5 h-1.5 rounded-full", client.assignee === 'Unassigned' ? 'bg-danger' : 'bg-success')} />
                        <span className="text-xs font-bold text-gray-700">{client.assignee}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-[11px] font-bold text-gray-600">{client.activeFilings}</div>
                    </td>
                    <td className="px-6 py-4"><TZStatusBadge status={client.status} size="xs" /></td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-300 hover:text-gray-600 transition-all rounded-lg opacity-0 group-hover:opacity-100">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TZCard>
      </div>

      {/* Client Detail Sidebar Panel */}
      {selectedClientId && (
        <aside className="fixed top-16 right-0 bottom-0 w-[480px] bg-white border-l border-gray-100 shadow-2xl z-40 flex flex-col animate-slide-in-right">
          <div className="flex items-center justify-between p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold font-display text-gray-900 uppercase tracking-widest text-xs">Client Profile</h2>
            <button onClick={() => setSelectedClientId(null)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {/* Profile Header */}
            <div className="p-8 flex flex-col items-center text-center">
              <TZAvatar name={selectedClient?.name || "Unknown"} size="xl" className="ring-8 ring-gray-50 mb-4" />
              <h3 className="text-2xl font-bold font-display text-gray-900 leading-tight">{selectedClient?.name}</h3>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1.5">{selectedClient?.type} · {selectedClient?.id}</p>

              <div className="flex gap-2 mt-6">
                <TZButton variant="primary" size="sm" className="h-10 px-6 rounded-full shadow-lg shadow-brand-primary/20 font-bold uppercase tracking-widest text-[10px]">
                  <Edit size={14} className="mr-2" /> Edit Details
                </TZButton>
                <TZButton variant="outline" size="sm" className="h-10 w-10 p-0 rounded-full border-gray-100">
                  <MoreHorizontal size={18} />
                </TZButton>
              </div>
            </div>

            {/* Quick Info Grid */}
            <div className="px-8 grid grid-cols-2 gap-4 pb-8">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                <div className="flex items-center gap-2 mb-1.5"><Phone size={12} className="text-gray-400" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</span></div>
                <p className="text-xs font-bold text-gray-900">{selectedClient?.phone || "N/A"}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                <div className="flex items-center gap-2 mb-1.5"><Mail size={12} className="text-gray-400" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</span></div>
                <p className="text-xs font-bold text-gray-900 truncate">{selectedClient?.email || "N/A"}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                <div className="flex items-center gap-2 mb-1.5"><Hash size={12} className="text-gray-400" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">GSTIN</span></div>
                <p className="text-xs font-mono font-bold text-brand-primary">{selectedClient?.gstin || "NOT ADDED"}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                <div className="flex items-center gap-2 mb-1.5"><Briefcase size={12} className="text-gray-400" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assigned CA</span></div>
                <p className="text-xs font-bold text-gray-900">{selectedClient?.assignee}</p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs.Root defaultValue="overview" className="px-8 pb-12">
              <Tabs.List className="flex border-b border-gray-100 gap-6 h-12">
                {['Overview', 'Filings', 'Documents', 'Notes'].map(tab => (
                  <Tabs.Trigger
                    key={tab}
                    value={tab.toLowerCase()}
                    className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gray-400 data-[state=active]:text-brand-primary data-[state=active]:relative transition-all"
                  >
                    {tab}
                    <div className="hidden data-[state=active]:block absolute -bottom-[1px] left-0 right-0 h-0.5 bg-brand-primary rounded-full" />
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              <Tabs.Content value="overview" className="pt-6 animate-fade-in">
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-white ring-1 ring-gray-100 rounded-xl shadow-sm">
                      <p className="text-xl font-extrabold text-gray-900">12</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">Filings</p>
                    </div>
                    <div className="text-center p-3 bg-white ring-1 ring-gray-100 rounded-xl shadow-sm">
                      <p className="text-xl font-extrabold text-gray-900">45</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">Docs</p>
                    </div>
                    <div className="text-center p-3 bg-white ring-1 ring-gray-100 rounded-xl shadow-sm">
                      <p className="text-xl font-extrabold text-danger">2</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">Pending</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-extrabold text-gray-900 uppercase tracking-widest">Recent Activity</h4>
                    <div className="space-y-4">
                      {[1, 2].map(i => (
                        <div key={i} className="flex gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0 shadow-[0_0_8px_rgba(26,79,186,0.4)]" />
                          <div>
                            <p className="text-xs font-bold text-gray-800 leading-snug">Priya Sharma updated ITR-1 status to <span className="text-brand-primary">Under Review</span></p>
                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">2 hours ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="filings" className="pt-6 animate-fade-in">
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all group cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-bold text-brand-primary bg-brand-primary-light px-2 py-0.5 rounded">GSTR-1</span>
                        <TZStatusBadge status="underReview" size="xs" />
                      </div>
                      <p className="text-sm font-bold text-gray-900 font-display">October 2024</p>
                      <div className="flex items-center justify-between mt-3">
                         <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5"><Calendar size={10} /> 31 Oct 2024</p>
                         <ChevronRight size={14} className="text-gray-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </aside>
      )}
    </div>
  );
}
