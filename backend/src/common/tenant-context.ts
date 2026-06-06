export interface TenantContext {
  organizationId: string;
  actorUserId: string;
  roles: string[];
  permissions: string[];
  ipAddress?: string;
  userAgent?: string;
}

