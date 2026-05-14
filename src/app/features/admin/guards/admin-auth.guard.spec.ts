import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  convertToParamMap,
} from '@angular/router';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { AdminAuthenticatedUser, AdminTenantAccess } from '../models/admin-auth.models';
import { AdminAuthService } from '../services/admin-auth.service';
import { AdminTenantContextService } from '../services/admin-tenant-context.service';
import { adminAuthGuard } from './admin-auth.guard';

describe('adminAuthGuard', () => {
  let router: Router;
  let tenantContext: AdminTenantContextService;
  let userState: ReturnType<typeof signal<AdminAuthenticatedUser | null>>;
  let authService: {
    user: ReturnType<typeof signal<AdminAuthenticatedUser | null>>;
    waitForAuthReady: ReturnType<typeof vi.fn>;
    ensureTenantAccess: ReturnType<typeof vi.fn>;
  };

  const user: AdminAuthenticatedUser = {
    uid: 'uid-1',
    email: 'owner@atelier.test',
    displayName: null,
  };

  const access: AdminTenantAccess = {
    tenantId: 'atelier-aurea',
    uid: user.uid,
    email: user.email,
    role: 'owner',
    tenantUser: {
      uid: user.uid,
      email: user.email ?? '',
      role: 'owner',
      active: true,
    },
  };

  beforeEach(() => {
    globalThis.localStorage?.clear();

    userState = signal(user);
    authService = {
      user: userState,
      waitForAuthReady: vi.fn().mockResolvedValue(undefined),
      ensureTenantAccess: vi.fn().mockResolvedValue(access),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        AdminTenantContextService,
        { provide: AdminAuthService, useValue: authService },
      ],
    });

    router = TestBed.inject(Router);
    tenantContext = TestBed.inject(AdminTenantContextService);
  });

  it('should allow an authenticated user linked to the tenant', async () => {
    const result = await runGuard('atelier-aurea');

    expect(result).toBe(true);
    expect(authService.ensureTenantAccess).toHaveBeenCalledWith('atelier-aurea');
    expect(tenantContext.requireTenantId()).toBe('atelier-aurea');
  });

  it('should redirect anonymous users to admin login', async () => {
    userState.set(null);

    const result = await runGuard('atelier-aurea');

    expect(router.serializeUrl(result as UrlTree)).toContain('/admin/login');
    expect(router.serializeUrl(result as UrlTree)).toContain('tenantId=atelier-aurea');
  });

  it('should redirect users without tenant access to admin login', async () => {
    authService.ensureTenantAccess.mockResolvedValue(null);

    const result = await runGuard('atelier-aurea');

    expect(router.serializeUrl(result as UrlTree)).toContain('/admin/login');
    expect(router.serializeUrl(result as UrlTree)).toContain('reason=access-denied');
  });

  async function runGuard(tenantId: string | null): Promise<boolean | UrlTree> {
    const route = {
      queryParamMap: convertToParamMap(tenantId ? { tenantId } : {}),
    } as ActivatedRouteSnapshot;
    const state = {
      url: tenantId ? `/admin?tenantId=${tenantId}` : '/admin',
    } as RouterStateSnapshot;

    return TestBed.runInInjectionContext(() => adminAuthGuard(route, state)) as Promise<
      boolean | UrlTree
    >;
  }
});
