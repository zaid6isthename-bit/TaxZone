export const permissions = {
  clients: {
    readAssigned: 'clients:read_assigned',
    readAll: 'clients:read_all',
    import: 'clients:import',
    assign: 'clients:assign',
  },
  documents: {
    request: 'documents:request',
    upload: 'documents:upload',
    review: 'documents:review',
    download: 'documents:download',
  },
  filings: {
    read: 'filings:read',
    updateStatus: 'filings:update_status',
    approve: 'filings:approve',
  },
  admin: {
    manageUsers: 'admin:manage_users',
    manageRoles: 'admin:manage_roles',
    viewAudit: 'admin:view_audit',
  },
} as const;

