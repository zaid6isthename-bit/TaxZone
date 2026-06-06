# TaxZone Mobile App

Flutter client app for non-technical users who need clear pending actions, secure document uploads, filing progress, assigned employee visibility, notifications, and verification flows.

## Recommended Structure

- `lib/app/` - app bootstrap, routing, theming.
- `lib/features/auth/` - login, forced password change, phone and email verification.
- `lib/features/dashboard/` - pending actions, deadlines, assigned employee, rejected submissions.
- `lib/features/documents/` - upload, request list, status timeline, re-upload.
- `lib/features/notifications/` - read/unread inbox and push handling.
- `lib/core/api/` - typed API client, token refresh, tenant-safe response handling.
- `lib/core/storage/` - secure token and local cache storage.

State management should use a predictable feature-first pattern such as Riverpod or Bloc.

