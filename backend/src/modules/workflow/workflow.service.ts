import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DomainEvent } from '../../common/domain-event';
import { TenantContext } from '../../common/tenant-context';

export type FilingStatus =
  | 'not_started'
  | 'awaiting_documents'
  | 'documents_under_review'
  | 'in_progress'
  | 'filed'
  | 'completed'
  | 'rejected'
  | 'needs_correction'
  | 'on_hold';

const allowedTransitions: Record<FilingStatus, FilingStatus[]> = {
  not_started: ['awaiting_documents', 'in_progress', 'on_hold'],
  awaiting_documents: ['documents_under_review', 'on_hold'],
  documents_under_review: ['in_progress', 'rejected', 'awaiting_documents'],
  in_progress: ['filed', 'needs_correction', 'on_hold'],
  filed: ['completed', 'needs_correction'],
  completed: [],
  rejected: ['awaiting_documents'],
  needs_correction: ['in_progress', 'awaiting_documents'],
  on_hold: ['awaiting_documents', 'in_progress'],
};

@Injectable()
export class WorkflowService {
  transitionFiling(
    context: TenantContext,
    filingId: string,
    from: FilingStatus,
    to: FilingStatus,
  ): DomainEvent {
    if (!allowedTransitions[from].includes(to)) {
      throw new Error(`Invalid filing transition from ${from} to ${to}`);
    }

    return {
      id: randomUUID(),
      organizationId: context.organizationId,
      actorUserId: context.actorUserId,
      type: 'FilingStatusChanged',
      payload: { filingId, from, to },
      occurredAt: new Date(),
    };
  }
}
