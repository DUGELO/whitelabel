import {
  AdminTenantId,
  AdminTenantRole,
  AdminTenantUserDocument,
} from './admin-firestore.models';

export type AdminAuthStatus = 'checking' | 'authenticated' | 'anonymous';

export interface AdminAuthenticatedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AdminTenantAccess {
  tenantId: AdminTenantId;
  uid: string;
  email: string | null;
  role: AdminTenantRole;
  tenantUser: AdminTenantUserDocument;
}
