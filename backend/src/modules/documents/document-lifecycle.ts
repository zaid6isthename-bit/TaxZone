export type DocumentStatus =
  | 'uploaded'
  | 'pending_verification'
  | 'approved'
  | 'rejected'
  | 'archived';

export const documentTransitions: Record<DocumentStatus, DocumentStatus[]> = {
  uploaded: ['pending_verification', 'archived'],
  pending_verification: ['approved', 'rejected', 'archived'],
  approved: ['archived'],
  rejected: ['uploaded', 'archived'],
  archived: [],
};

export function assertDocumentTransition(from: DocumentStatus, to: DocumentStatus) {
  if (!documentTransitions[from].includes(to)) {
    throw new Error(`Invalid document transition from ${from} to ${to}`);
  }
}

