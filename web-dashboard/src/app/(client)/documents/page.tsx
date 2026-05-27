"use client";

import { useState } from "react";
import { TZCard } from "@/components/ui/card";
import { TZBadge } from "@/components/ui/badge";
import { TZButton } from "@/components/ui/button";
import { TZInput } from "@/components/ui/input";
import { Search, Upload, Download, FileText, Image, File, Filter } from "lucide-react";

const documents = [
  { name: "PAN Card Copy.pdf", type: "PDF", size: "2.4 MB", date: "10 May 2023", category: "Identity", status: "Verified" },
  { name: "Form 16 FY 2023-24.pdf", type: "PDF", size: "1.1 MB", date: "15 Jun 2024", category: "Income", status: "Verified" },
  { name: "Bank Statement Apr 2024.pdf", type: "PDF", size: "3.8 MB", date: "5 May 2024", category: "Financial", status: "Pending" },
  { name: "Aadhar Card.jpg", type: "IMG", size: "856 KB", date: "10 May 2023", category: "Identity", status: "Verified" },
  { name: "Rent Agreement 2023.pdf", type: "PDF", size: "4.2 MB", date: "1 Apr 2023", category: "Legal", status: "Not Required" },
];

const FileIcon = ({ type }: { type: string }) => {
  if (type === "IMG") return <Image size={20} className="text-purple-500" />;
  if (type === "PDF") return <FileText size={20} className="text-red-500" />;
  return <File size={20} className="text-gray-500" />;
};

export default function DocumentsPage() {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-gray-50">
      <header className="sticky top-0 z-10 px-4 py-3 bg-white border-b border-gray-200">
        <h1 className="text-lg font-bold font-display text-gray-900 mb-3">Documents</h1>
        <TZInput placeholder="Search documents..." icon={<Search size={17} />} className="bg-gray-50" />
      </header>

      {/* Upload Area */}
      <div className="mx-4 mt-4">
        <div
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-brand-primary/30 rounded-xl bg-brand-primary-light/30 cursor-pointer hover:bg-brand-primary-light/50 transition-colors"
          onClick={() => { setUploading(true); setTimeout(() => setUploading(false), 1200); }}
        >
          <div className="flex items-center justify-center w-12 h-12 mb-3 bg-brand-primary-light rounded-xl text-brand-primary">
            <Upload size={22} />
          </div>
          <p className="text-[14px] font-semibold text-gray-900 mb-0.5">Upload Document</p>
          <p className="text-[12px] text-gray-500">PDF, JPG, PNG up to 10MB</p>
          {uploading && (
            <div className="w-full mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-brand-primary rounded-full animate-pulse w-3/4"></div>
            </div>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {["All", "Identity", "Income", "Financial", "Legal"].map((cat) => (
          <button
            key={cat}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
              cat === "All" ? "bg-brand-primary text-white" : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Document List */}
      <div className="px-4 space-y-3">
        {documents.map((doc, i) => (
          <TZCard key={i} className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg shrink-0">
              <FileIcon type={doc.type} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-gray-900 truncate">{doc.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-gray-500">{doc.size}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="text-[11px] text-gray-500">{doc.date}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <TZBadge
                variant={doc.status === "Verified" ? "success" : doc.status === "Pending" ? "warning" : "secondary"}
                className="text-[10px]"
              >
                {doc.status}
              </TZBadge>
              <button className="text-gray-400 hover:text-brand-primary transition-colors">
                <Download size={16} />
              </button>
            </div>
          </TZCard>
        ))}
      </div>
    </div>
  );
}
