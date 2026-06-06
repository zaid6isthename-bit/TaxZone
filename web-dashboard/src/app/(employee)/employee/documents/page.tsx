"use client";

import { TZCard } from "@/components/ui/card";
import { TZBadge } from "@/components/ui/badge";
import { TZButton } from "@/components/ui/button";
import { TZInput } from "@/components/ui/input";
import { Search, Upload, Download, FileText, File, Filter, FolderOpen } from "lucide-react";

const documents = [
  { id: "DOC-001", name: "GSTR-1 Oct 2024 Draft.pdf", client: "Rajesh Kumar", type: "PDF", size: "1.2 MB", uploaded: "10 Nov 2024", category: "Filing", status: "Pending Review" },
  { id: "DOC-002", name: "PAN Card - Acme Corp.pdf", client: "Acme Corp", type: "PDF", size: "880 KB", uploaded: "5 Sep 2024", category: "Identity", status: "Verified" },
  { id: "DOC-003", name: "Bank Statement Q3.pdf", client: "TechNova", type: "PDF", size: "4.1 MB", uploaded: "1 Nov 2024", category: "Financial", status: "Pending Review" },
  { id: "DOC-004", name: "Form 16 FY23-24.pdf", client: "Priya Singh", type: "PDF", size: "1.6 MB", uploaded: "20 Jun 2024", category: "Income", status: "Verified" },
];

export default function EmployeeDocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">Documents</h1>
          <p className="text-gray-500">Client documents, uploads, and verification status.</p>
        </div>
        <TZButton className="gap-2"><Upload size={18} /> Request Document</TZButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Documents", count: "248", icon: FileText, color: "text-brand-primary", bg: "bg-brand-primary-light" },
          { label: "Pending Review", count: "12", icon: FolderOpen, color: "text-warning", bg: "bg-warning-light" },
          { label: "Verified", count: "236", icon: File, color: "text-success", bg: "bg-success-light" },
        ].map((s) => (
          <TZCard key={s.label} className="p-4 flex items-center gap-4">
            <div className={`p-2.5 rounded-lg ${s.bg} ${s.color}`}><s.icon size={20} /></div>
            <div>
              <p className="text-xl font-bold text-gray-900">{s.count}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </TZCard>
        ))}
      </div>

      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex w-1/3">
          <TZInput placeholder="Search documents..." icon={<Search size={18} />} />
        </div>
        <TZButton variant="outline" className="gap-2"><Filter size={16} /> Filter</TZButton>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-red-50 text-red-500 rounded-lg">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-gray-900">{doc.name}</p>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                  <span>{doc.client}</span>
                  <span>·</span>
                  <span>{doc.size}</span>
                  <span>·</span>
                  <span>{doc.uploaded}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TZBadge variant={doc.status === "Verified" ? "success" : "warning"}>
                {doc.status}
              </TZBadge>
              <button className="p-2 text-gray-400 hover:text-brand-primary transition-colors rounded-lg hover:bg-brand-primary-light">
                <Download size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
