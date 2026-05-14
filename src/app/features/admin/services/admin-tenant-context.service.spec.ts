import { TestBed } from '@angular/core/testing';

import { AdminTenantContextService } from './admin-tenant-context.service';

describe('AdminTenantContextService', () => {
  let service: AdminTenantContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminTenantContextService);
  });

  it('should require an explicit tenantId before admin Firestore access', () => {
    expect(() => service.requireTenantId()).toThrow();

    service.setTenantId(' whitelabel ');

    expect(service.requireTenantId()).toBe('whitelabel');
    expect(service.hasTenant()).toBe(true);
  });
});
