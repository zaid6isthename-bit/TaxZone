# TaxZone

Enterprise SaaS platform blueprint for tax consultancy, GST compliance, document workflows, and multi-tenant firm operations.

## Repository Structure

- `docs/architecture.md` - end-to-end enterprise architecture.
- `docs/database-schema.md` - normalized PostgreSQL schema and tenancy strategy.
- `docs/api.md` - versioned API surface and module relationships.
- `docs/workflows.md` - client onboarding, document lifecycle, filings, assignments, reminders.
- `docs/security.md` - RBAC, tenant isolation, audit logging, file security, threat controls.
- `docs/deployment.md` - Docker, CI/CD, observability, backup, scaling plan.
- `backend/` - NestJS backend module scaffold.
- `frontend/` - Next.js employee/admin portal scaffold.
- `mobile/` - Flutter client app architecture scaffold.
- `infra/` - deployment and local orchestration templates.

TaxZone is designed around strict organization isolation, event-driven workflows, immutable audit trails, secure document handling, and extensible automation for future AI features.

