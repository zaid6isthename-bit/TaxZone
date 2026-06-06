# Frontend And Mobile UX

## Client Dashboard

The client experience prioritizes clarity over density:

- Pending actions first.
- Requested documents grouped by urgency.
- Filing progress shown as simple stages.
- Assigned employee always visible.
- Rejected submissions include plain-language reasons and a direct re-upload action.
- Notifications use read/unread state and concise action labels.

## Employee Dashboard

The employee portal is a productivity command center:

- Assigned clients.
- Pending tasks.
- Urgent deadlines.
- Recently uploaded documents.
- Rejected items requiring follow-up.
- Overdue filings.
- Smart filters by status, filing category, due date, and client.

## Admin Dashboard

Organization admins need operational control:

- Employee workload.
- Client assignment health.
- Filing completion rate.
- Deadline compliance.
- Import validation reports.
- Automation rule controls.
- Role and permission management.

## State Management

- Server state should use a query cache such as TanStack Query.
- UI state should stay local unless shared across a workflow.
- Forms should use schema-backed validation.
- Optimistic updates are acceptable for read/unread notifications and task status changes.
- Document upload state must be durable and resumable where possible.

## Error Handling

- Validation errors appear beside fields.
- Permission errors show a clear access message and never expose hidden data.
- Upload failures support retry.
- Background processing states are visible for malware scanning, verification, and imports.

