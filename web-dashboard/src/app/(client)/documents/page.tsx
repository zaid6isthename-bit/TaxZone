"use client";

import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useQuery } from "@tanstack/react-query";
import {
  Search, Upload, FileText, Image, Table2, Archive,
  File, ChevronRight, AlertCircle, Clock, Download
} from "lucide-react";
import { TZCard } from "@/components/ui/card";
import { TZStatusBadge } from "@/components/ui/status-badge";
import { TZSkeleton } from "@/components/ui/skeleton";
import { TZEmptyState } from "@/components/ui/empty-state";
import { useAuthStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const DOCUMENT_TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
];

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const { user } = useAuthStore();

  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents', activeTab, search, user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      let query = supabase.from('documents').select(`
        *,
        filings ( type, period )
      `).eq('client_id', user!.id);

      if (activeTab !== 'all') {
        query = query.eq('status', activeTab);
      }

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;

      return data.map((d: any) => ({
        id: d.id,
        originalFilename: d.name,
        mimeType: d.url.split('.').pop() === 'pdf' ? 'application/pdf' : 'image/jpeg', // simplified mime inference
        reviewStatus: d.status,
        filingName: d.filings ? `${d.filings.type} ${d.filings.period}` : 'General',
        createdAt: d.created_at,
        fileSizeBytes: 1024 * 1024, // Mock size for now as URL doesn't have it unless we fetch metadata
        url: d.url
      }));
    },
  });

  const displayDocs = documents || [];

  const handleDownload = async (doc: any) => {
    toast.success(`Opening ${doc.originalFilename}...`);
    // Assuming url is a path in the 'documents' bucket
    const { data } = supabase.storage.from('documents').getPublicUrl(doc.url);
    if (data?.publicUrl) {
      window.open(data.publicUrl, '_blank');
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-5 pt-12 pb-2">
        <h1 className="text-xl font-bold font-display text-gray-900 mb-4">My Documents</h1>

        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-100/50 border border-gray-100 rounded-xl
                       text-sm font-body text-gray-900 placeholder-gray-400
                       focus:outline-none focus:border-brand-primary focus:bg-white
                       transition-all duration-200"
          />
        </div>

        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {DOCUMENT_TABS.map(tab => (
              <Tabs.Trigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "px-5 py-2 rounded-full text-xs font-bold font-body whitespace-nowrap transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                    : "bg-white border border-gray-100 text-gray-500 hover:border-brand-primary/30"
                )}
              >
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
      </header>

      <div className="flex-1 px-5 py-5 space-y-3">
        {/* Rejected docs alert */}
        {activeTab === 'all' && displayDocs.some((d: any) => d.reviewStatus === 'rejected') && (
          <div className="mb-4 p-3.5 bg-danger-light/30 border border-danger/20 rounded-2xl flex items-center gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
              <AlertCircle size={16} className="text-danger" />
            </div>
            <p className="text-[13px] font-bold text-danger leading-tight">
              Action needed: Some documents were rejected. Please re-upload them.
            </p>
          </div>
        )}

        {isLoading ? (
          Array(6).fill(0).map((_, i) => <TZSkeleton key={i} className="h-20 w-full rounded-2xl" />)
        ) : displayDocs.length > 0 ? (
          displayDocs.map((doc: any) => (
            <DocumentRow key={doc.id} doc={doc} onDownload={() => handleDownload(doc.originalFilename)} />
          ))
        ) : (
          <TZEmptyState
            icon={<FileText className="w-12 h-12 text-gray-200" />}
            title="No documents here"
            description="Your uploaded documents and requested files will appear here."
          />
        )}
      </div>

      <button className="fixed bottom-24 right-5 w-14 h-14 bg-brand-primary text-white rounded-full shadow-xl shadow-brand-primary/40 flex items-center justify-center transition-all active:scale-90 hover:bg-brand-primary-hover z-20">
        <Upload size={24} />
      </button>
    </div>
  );
}

function DocumentRow({ doc, onDownload }: { doc: any; onDownload: () => void }) {
  const getFileConfig = (mime: string) => {
    if (mime.includes('pdf')) return { icon: FileText, bg: 'bg-red-50', color: 'text-red-500' };
    if (mime.includes('image')) return { icon: Image, bg: 'bg-blue-50', color: 'text-blue-500' };
    if (mime.includes('excel') || mime.includes('spreadsheet')) return { icon: Table2, bg: 'bg-green-50', color: 'text-green-600' };
    if (mime.includes('zip') || mime.includes('archive')) return { icon: Archive, bg: 'bg-orange-50', color: 'text-orange-500' };
    return { icon: File, bg: 'bg-gray-50', color: 'text-gray-500' };
  };

  const config = getFileConfig(doc.mimeType);

  return (
    <TZCard interactive className="p-3.5 flex items-center gap-4 border-none shadow-sm shadow-black/5 hover:ring-1 hover:ring-brand-primary/10">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner", config.bg)}>
        <config.icon className={cn("w-6 h-6", config.color)} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold font-display text-gray-900 truncate">{doc.originalFilename}</p>
        <p className="text-[11px] font-bold text-gray-400 font-body uppercase mt-1 tracking-wider">{doc.filingName}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <Clock size={10} className="text-gray-300" />
          <p className="text-[10px] font-medium text-gray-400">2 days ago</p>
          <span className="w-1 h-1 bg-gray-200 rounded-full mx-0.5" />
          <p className="text-[10px] font-medium text-gray-400">{(doc.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <TZStatusBadge status={doc.reviewStatus} size="xs" />
        <button
          onClick={(e) => { e.stopPropagation(); onDownload(); }}
          className="p-2 text-gray-300 hover:text-brand-primary hover:bg-brand-primary-light rounded-lg transition-all"
        >
          <Download size={18} />
        </button>
      </div>
    </TZCard>
  );
}
