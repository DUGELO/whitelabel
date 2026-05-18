import { TestBed } from '@angular/core/testing';

import { AdminTenantContextService } from './admin-tenant-context.service';

describe('AdminTenantContextService', () => {
  let service: AdminTenantContextService;

  beforeEach(() => {
    globalThis.localStorage?.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminTenantContextService);
  });

  it('should require an explicit tenantId before admin Firestore access', () => {
    expect(() => service.requireTenantId()).toThrow();

    service.setTenantId(' whitelabel ');

    expect(service.requireTenantId()).toBe('whitelabel');
    expect(service.hasTenant()).toBe(true);
  });

  it('should resolve tenantId from candidates, memory or persisted admin context', () => {
    expect(service.resolveTenantId(' atelier-aurea ')).toBe('atelier-aurea');

    service.setTenantId('modern-boutique');
    expect(service.resolveTenantId()).toBe('modern-boutique');

    service.clearTenantId();
    service.storeTenantId('soft-fashion');

    expect(service.resolveTenantId()).toBe('soft-fashion');
  });

  it('should clear the persisted admin tenant on sign out flows', () => {
    service.storeTenantId('soft-fashion');
    service.clearStoredTenantId();

    expect(service.readStoredTenantId()).toBeNull();
  });
});
