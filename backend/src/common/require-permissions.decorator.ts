import { SetMetadata } from '@nestjs/common';

export const REQUIRED_PERMISSIONS_KEY = 'required_permissions';

export const RequirePermissions = (...requiredPermissions: string[]) =>
  SetMetadata(REQUIRED_PERMISSIONS_KEY, requiredPermissions);

