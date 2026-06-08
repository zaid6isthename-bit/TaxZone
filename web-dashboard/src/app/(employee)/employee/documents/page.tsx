"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TZCard } from "@/components/ui/card";
import { TZBadge } from "@/components/ui/badge";
import { TZButton } from "@/components/ui/button";
import { TZInput } from "@/components/ui/input";
import { TZSkeleton } from "@/components/ui/skeleton";
import { Search, Upload, FileText, Filter } from "lucide-react";
import { documentsService, Document } from "@/services/documents";

export default function EmployeeDocumentsPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ['employee-documents', search],
    queryFn: () => documentsService.list({}),
  });

  const documents: Document[] = data?.data || [];

  const pendingReview = documents.filter(d => d.verificationStatus === 'pending_verification').length;
  const verified = documents.filter(d => d.verificationStatus === 'approved').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">Documents</h1>
          <p className="text-gray-500">Client documents, uploads, and verification status.</p>
        </div>
        <TZButton className="gap-2"><Upload size={18} /> Request Document</TZButton>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <TZCard className="p-4 flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600"><FileText size={20} /></div>
          <div>
            <p className="text-xl font-bold text-gray-900">{isLoading ? '...' : documents.length}</p>
            <p className="text-sm text-gray-500">Total Documents</p>
          </div>
        </TZCard>
        <TZCard className="p-4 flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600"><FileText size={20} /></div>
          <div>
            <p className="text-xl font-bold text-gray-900">{pendingReview}</p>
            <p className="text-sm text-gray-500">Pending Review</p>
          </div>
        </TZCard>
        <TZCard className="p-4 flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-green-50 text-green-600"><FileText size={20} /></div>
          <div>
            <p className="text-xl font-bold text-gray-900">{verified}</p>
            <p className="text-sm text-gray-500">Verified</p>
          </div>
        </TZCard>
      </div>

      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex w-1/3">
          <TZInput placeholder="Search documents..." icon={<Search size={18} />} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <TZButton variant="outline" className="gap-2"><Filter size={16} /> Filter</TZButton>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
        {isLoading ? (
          <div className="p-8"><TZSkeleton className="h-20 w-full" /></div>
        ) : documents.length === 0 ? (
          <p className="text-center py-12 text-gray-400">No documents found</p>
        ) : documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-red-50 text-red-500 rounded-lg"><FileText size={20} /></div>
              <div>
                <p className="text-[15px] font-semibold text-gray-900">{doc.originalFilename}</p>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                  <span>{doc.client?.displayName || 'Unknown'}</span>
                  <span>·</span>
                  <span>{(doc.fileSizeBytes / 1024 / 1024).toFixed(1)} MB</span>
                  <span>·</span>
                  <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TZBadge variant={doc.verificationStatus === 'approved' ? 'success' : doc.verificationStatus === 'rejected' ? 'danger' : 'warning'}>
                {doc.verificationStatus}
              </TZBadge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
