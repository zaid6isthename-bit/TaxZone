"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft, Upload, Check, AlertCircle, FileText,
  Calendar, User, Clock, ChevronRight, Phone, MessageCircle
} from "lucide-react";
import { TZCard } from "@/components/ui/card";
import { TZStatusBadge } from "@/components/ui/status-badge";
import { TZSkeleton } from "@/components/ui/skeleton";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const FILING_STEPS = [
  { key: 'not_started',            label: 'Started'       },
  { key: 'awaiting_documents',     label: 'Docs Needed'   },
  { key: 'documents_under_review', label: 'Under Review'  },
  { key: 'in_progress',            label: 'In Progress'   },
  { key: 'ready_to_file',          label: 'Ready'         },
  { key: 'filed',                  label: 'Filed'         },
  { key: 'completed',              label: 'Done'          },
];

export function generateStaticParams() {
  return []; // We fetch dynamically on client
}

const STATUS_HERO_COLORS: Record<string, string> = {
  not_started:          'from-gray-500 to-gray-600',
  awaiting_documents:   'from-amber-500 to-orange-500',
  documents_under_review: 'from-brand-gradient-start to-brand-gradient-end',
  underReview:          'from-brand-gradient-start to-brand-gradient-end',
  in_progress:          'from-info to-brand-primary',
  ready_to_file:        'from-success to-emerald-600',
  filed:                'from-success to-emerald-700',
  completed:            'from-success to-emerald-800',
  rejected:             'from-danger to-red-700',
  needs_correction:     'from-danger to-orange-600',
  on_hold:              'from-gray-400 to-gray-600',
};

export default function FilingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [isUploadSheetOpen, setUploadSheetOpen] = useState(false);

  const { data: filing, isLoading } = useQuery({
    queryKey: ['filing', params?.id],
    enabled: !!params?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('filings')
        .select('*, documents(*), users:assigned_ca_id(name)')
        .eq('id', params!.id)
        .single();
        
      if (error) throw error;
      
      return {
        id: data.id,
        type: data.type,
        title: `${data.type} ${data.period}`,
        currentStatus: data.current_status,
        lastUpdatedBy: data.users?.name || "System",
        updatedAt: data.created_at,
        completionPercentage: data.completion_percentage,
        dueDate: "31 Oct 2024", // Hardcoded for now if not in schema
        documentRequests: data.documents.map((d: any) => ({
          id: d.id,
          title: d.name,
          status: d.status,
          reviewedBy: data.users?.name,
          url: d.url
        })),
        statusHistory: [] // Schema doesn't have history yet
      };
    },
  });

  if (isLoading) return <FilingDetailSkeleton />;

  const data = filing || {
    id: "1", type: "GSTR-1", title: "GSTR-1", currentStatus: "not_started",
    lastUpdatedBy: "System", updatedAt: "", completionPercentage: 0, dueDate: "",
    documentRequests: [], statusHistory: []
  };

  const currentStepIndex = FILING_STEPS.findIndex(s => s.key === data.currentStatus || (data.currentStatus === 'underReview' && s.key === 'documents_under_review'));

  return (
    <div className="flex flex-col min-h-screen pb-28 bg-gray-50 animate-fade-in">
      {/* Hero Header */}
      <div className={cn(
        "bg-gradient-to-br px-5 pt-12 pb-8 text-white relative overflow-hidden",
        STATUS_HERO_COLORS[data.currentStatus] || STATUS_HERO_COLORS.underReview
      )}>
        <button
          onClick={() => router.back()}
          className="absolute top-5 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white transition-all active:scale-90"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="mt-4">
          <TZStatusBadge status={data.currentStatus} size="lg" className="bg-white/20 text-white border-none backdrop-blur-md" />
          <h1 className="text-2xl font-bold font-display mt-3 leading-tight">{data.title}</h1>
          <p className="mt-2 text-white/80 text-sm font-body">
            Filing is currently under review by your assigned CA associate.
          </p>
          <p className="mt-4 text-white/60 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Clock size={12} />
            Updated {data.lastUpdatedBy} · 2 hours ago
          </p>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white border-b border-gray-100 shadow-sm overflow-x-auto no-scrollbar py-6 px-5">
        <div className="flex items-center min-w-max">
          {FILING_STEPS.map((step, i) => {
            const isDone = i < currentStepIndex;
            const isCurrent = i === currentStepIndex;
            return (
              <React.Fragment key={step.key}>
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-500",
                    isDone ? "bg-brand-primary text-white" :
                    isCurrent ? "bg-brand-primary text-white ring-4 ring-brand-primary/10 animate-pulse" :
                    "bg-gray-100 text-gray-400 border border-gray-200"
                  )}>
                    {isDone ? <Check size={18} /> : i + 1}
                  </div>
                  <p className={cn(
                    "text-[10px] mt-2 text-center font-bold uppercase tracking-tighter whitespace-nowrap",
                    isDone || isCurrent ? "text-brand-primary" : "text-gray-400"
                  )}>
                    {step.label}
                  </p>
                </div>
                {i < FILING_STEPS.length - 1 && (
                  <div className={cn(
                    "h-0.5 w-10 mx-1 rounded-full transition-all duration-700",
                    i < currentStepIndex ? "bg-brand-primary" : "bg-gray-200"
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Required Documents */}
      <div className="px-5 py-6">
        <h2 className="text-base font-bold font-display text-gray-900 mb-4 flex items-center justify-between">
          Required Documents
          <span className="px-2 py-0.5 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500">
            {data.documentRequests.length}
          </span>
        </h2>
        <div className="flex flex-col gap-3">
          {data.documentRequests.map((req: any) => (
            <DocumentRequestCard key={req.id} request={req} />
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="px-5 pb-10">
        <h2 className="text-base font-bold font-display text-gray-900 mb-5">Activity Timeline</h2>
        <div className="relative pl-4">
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-100" />
          <div className="space-y-8">
            {data.statusHistory.map((entry: any) => (
              <div key={entry.id} className="relative flex gap-4">
                <div className="absolute -left-[20px] w-3 h-3 rounded-full bg-brand-primary border-2 border-white ring-4 ring-gray-50 shadow-sm" />
                <div className="flex-1 -mt-1">
                  <p className="text-sm font-body text-gray-700">
                    <span className="font-bold text-gray-900">{entry.actorName}</span>
                    {' updated status to '}
                    <span className="font-bold text-brand-primary">Under Review</span>
                  </p>
                  {entry.notes && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-xs font-body text-gray-500 italic leading-relaxed">"{entry.notes}"</p>
                    </div>
                  )}
                  <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Upload FAB */}
      <button
        onClick={() => setUploadSheetOpen(true)}
        className="fixed bottom-24 right-5 flex items-center gap-2 px-6 py-3.5
                   bg-brand-primary text-white rounded-full shadow-lg shadow-brand-primary/30
                   hover:bg-brand-primary-hover active:scale-95
                   transition-all duration-200 font-bold font-display text-sm z-20"
      >
        <Upload size={18} />
        Upload Documents
      </button>
    </div>
  );
}

function DocumentRequestCard({ request }: { request: any }) {
  return (
    <TZCard className={cn(
      "p-4 border-l-4",
      request.status === 'pending'  ? 'border-l-warning bg-warning-light/20' :
      request.status === 'rejected' ? 'border-l-danger bg-danger-light/20'   :
      request.status === 'approved' ? 'border-l-success bg-success-light/20' :
                                      'border-l-gray-200 bg-gray-50'
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-[14px] font-bold font-display text-gray-900 leading-tight">{request.title}</p>
          {request.description && (
            <p className="text-[11px] font-medium font-body text-gray-500 mt-1">{request.description}</p>
          )}
          {request.status === 'rejected' && (
            <p className="text-[11px] font-bold font-body text-danger mt-2 flex items-center gap-1">
              <AlertCircle size={12} />
              {request.rejectionReason}
            </p>
          )}
        </div>
        <TZStatusBadge status={request.status} size="xs" />
      </div>
      {(request.status === 'pending' || request.status === 'rejected') && (
        <button
          className="mt-4 w-full py-2.5 rounded-xl border border-brand-primary
                     text-brand-primary text-[12px] font-bold font-display
                     hover:bg-brand-primary hover:text-white transition-all duration-200
                     shadow-sm active:scale-95"
        >
          {request.status === 'rejected' ? 'RE-UPLOAD DOCUMENT' : 'UPLOAD NOW'}
        </button>
      )}
      {request.status === 'approved' && (
        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-success uppercase tracking-widest">
          <Check size={14} strokeWidth={3} />
          Approved by {request.reviewedBy}
        </div>
      )}
    </TZCard>
  );
}

function FilingDetailSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TZSkeleton className="h-48 w-full rounded-none" />
      <div className="p-5 bg-white border-b border-gray-100 flex gap-4">
        <TZSkeleton className="h-10 w-10 rounded-full" />
        <TZSkeleton className="h-10 w-10 rounded-full" />
        <TZSkeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="p-5 space-y-4">
        <TZSkeleton className="h-6 w-40" />
        <TZSkeleton className="h-32 w-full rounded-2xl" />
        <TZSkeleton className="h-32 w-full rounded-2xl" />
      </div>
    </div>
  );
}
