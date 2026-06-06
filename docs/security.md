# Security Architecture

## Controls

- JWT access tokens with short expiry.
- Refresh token rotation with reuse detection.
- Strong password hashing using Argon2id or bcrypt with secure cost settings.
- MFA-ready account model.
- Granular RBAC and ownership policies.
- Tenant-scoped repositories and optional PostgreSQL Row Level Security.
- API throttling by IP, user, organization, and endpoint risk.
- Secure headers, CORS allowlists, CSRF protection where cookies are used.
- DTO validation and ORM parameter binding.
- File MIME validation, size limits, checksum calculation, malware scan queue, and signed URLs.
- Sensitive document encryption at rest using object storage KMS.
- Immutable audit logs for sensitive actions.

## Tenant Boundaries

Tenant isolation is enforced in four layers:

1. API: request context resolves `organization_id`.
2. Service: business methods accept tenant context.
3. Repository: all queries include tenant predicates.
4. Database: indexes and optional RLS prevent accidental cross-tenant reads.

Super admin actions are explicitly platform-scoped and audited.

## Audit Events

Critical tracked events:

- Login success/failure.
- Password change.
- Refresh token reuse detection.
- File upload, approval, rejection, download.
- Filing status change.
- Assignment and reassignment.
- Permission and role changes.
- Organization status or plan changes.

