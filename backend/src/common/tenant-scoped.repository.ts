import { TenantContext } from './tenant-context';

export abstract class TenantScopedRepository<TEntity> {
  protected constructor(protected readonly tableName: string) {}

  protected tenantWhere(context: TenantContext): { organizationId: string } {
    return { organizationId: context.organizationId };
  }

  abstract findById(context: TenantContext, id: string): Promise<TEntity | null>;
}

