# TaxZone Mobile API Contract

The Android APK does not use mock business records. It loads every screen from the production API configured in the Profile tab.

Base URL is owner-configurable inside the app. All requests use:

`Authorization: Bearer <token>`

## Dashboard

`GET /api/v1/mobile/dashboard`

```json
{
  "success": true,
  "data": {
    "title": "Welcome back, James",
    "summary": "You have 3 high-priority compliance actions.",
    "pendingDocuments": "3",
    "filingProgress": "72%",
    "actions": [
      {
        "id": "act_123",
        "title": "Upload bank statement",
        "description": "Required for GST reconciliation.",
        "dueLabel": "Due 20 Jun"
      }
    ],
    "consultant": {
      "name": "Sarah Harrington",
      "role": "Tax Compliance Advisor",
      "lastUpdate": "Purchase invoice mismatch found."
    }
  }
}
```

`POST /api/v1/mobile/actions/{id}/open`

## Documents

`GET /api/v1/mobile/documents`

```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "doc_123",
        "name": "Bank Statement Jul 2025",
        "status": "Pending upload",
        "description": "Required for document verification."
      }
    ]
  }
}
```

`POST /api/v1/mobile/documents/{id}/upload-intent`

```json
{
  "documentId": "doc_123",
  "fileName": "statement.pdf",
  "contentUri": "content://..."
}
```

The backend should respond with a signed upload URL or an accepted upload job record.

## Filings

`GET /api/v1/mobile/filings`

```json
{
  "success": true,
  "data": {
    "heading": "GST Monthly Filing",
    "description": "FY 2025-26 · July",
    "stages": [
      {
        "title": "Documents uploaded",
        "status": "Complete",
        "complete": true
      }
    ]
  }
}
```

## Notifications

`GET /api/v1/mobile/notifications`

```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "note_123",
        "title": "Document rejected",
        "body": "Please upload a corrected purchase invoice.",
        "createdAt": "2026-06-06T08:30:00Z"
      }
    ]
  }
}
```

`POST /api/v1/mobile/notifications/{id}/read`

## Profile

`GET /api/v1/mobile/profile`

```json
{
  "success": true,
  "data": {
    "name": "Aravind Sharma",
    "organization": "TaxZone client",
    "verificationSummary": "Email verified\nPhone verified\nPAN verified",
    "businessSummary": "PAN: ABCPS1234F\nGSTIN: 27ABCPS1234F1Z5"
  }
}
```

