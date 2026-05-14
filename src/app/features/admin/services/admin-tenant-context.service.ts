import { Injectable, computed, signal } from '@angular/core';

import { AdminTenantId } from '../models/admin-firestore.models';

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

  requireTenantId(): AdminTenantId {
    const tenantId = this.tenantIdState();

    if (!tenantId) {
      throw new Error('Admin tenantId is required before accessing Firestore.');
    }

    return tenantId;
  }
}
