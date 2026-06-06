export interface DomainEvent<TPayload extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  organizationId: string;
  actorUserId?: string;
  type: string;
  payload: TPayload;
  occurredAt: Date;
}

