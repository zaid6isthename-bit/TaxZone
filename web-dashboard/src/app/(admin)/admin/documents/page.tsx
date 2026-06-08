"use client";

import { useQuery } from "@tanstack/react-query";
import { TZTable, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { TZBadge } from "@/components/ui/badge";
import { TZSkeleton } from "@/components/ui/skeleton";
import { documentsService, Document } from "@/services/documents";

export default function AdminDocumentsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-documents'], queryFn: () => documentsService.list() });
  const documents: Document[] = data?.data || [];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-display text-gray-900">All Documents</h1><p className="text-gray-500">View all client documents across the organization.</p></div>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <TZTable>
          <TableHeader>
            <TableRow>
              <TableHead>Filename</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5}><TZSkeleton className="h-8 w-full" /></TableCell></TableRow>
            ) : documents.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-400">No documents found</TableCell></TableRow>
            ) : documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.originalFilename}</TableCell>
                <TableCell className="text-gray-600">{doc.client?.displayName || 'Unknown'}</TableCell>
                <TableCell className="text-gray-500 text-sm">{doc.mimeType}</TableCell>
                <TableCell className="text-gray-500 text-sm">{(doc.fileSizeBytes / 1024 / 1024).toFixed(1)} MB</TableCell>
                <TableCell><TZBadge variant={doc.verificationStatus === 'approved' ? 'success' : doc.verificationStatus === 'rejected' ? 'danger' : 'warning'}>{doc.verificationStatus}</TZBadge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TZTable>
      </div>
    </div>
  );
}
