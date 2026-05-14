import { Injectable, computed, signal } from '@angular/core';

import { AdminTenantId } from '../models/admin-firestore.models';

const ADMIN_TENANT_STORAGE_KEY = 'white-label.admin.tenantId';

@Injectable({
  providedIn: 'root',
})
export class AdminTenantContextService {
  private readonly tenantIdState = signal<AdminTenantId | null>(null);

  readonly tenantId = this.tenantIdState.asReadonly();
  readonly hasTenant = computed(() => this.tenantIdState() !== null);

  setTenantId(tenantId: AdminTenantId): void {
    const normalizedTenantId = tenantId.trim();

    if (!normalizedTenantId) {
      throw new Error('Admin tenantId cannot be empty.');
    }

    this.tenantIdState.set(normalizedTenantId);
  }

  clearTenantId(): void {
    this.tenantIdState.set(null);
  }

  resolveTenantId(candidateTenantId?: AdminTenantId | null): AdminTenantId | null {
    const tenantId = candidateTenantId?.trim() || this.tenantIdState() || this.readStoredTenantId();

    return tenantId?.trim() || null;
  }

  readStoredTenantId(): AdminTenantId | null {
    try {
      return globalThis.localStorage?.getItem(ADMIN_TENANT_STORAGE_KEY) ?? null;
    } catch {
      return null;
    }
  }

  storeTenantId(tenantId: AdminTenantId): void {
    try {
      globalThis.localStorage?.setItem(ADMIN_TENANT_STORAGE_KEY, tenantId.trim());
    } catch {
      return;
    }
  }

  requireTenantId(): AdminTenantId {
    const tenantId = this.tenantIdState();

    if (!tenantId) {
      throw new Error('Admin tenantId is required before accessing Firestore.');
    }

    return tenantId;
  }
}
