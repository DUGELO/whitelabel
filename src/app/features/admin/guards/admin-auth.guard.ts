import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AdminAuthService } from '../services/admin-auth.service';
import { AdminTenantContextService } from '../services/admin-tenant-context.service';

export const adminAuthGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const adminAuth = inject(AdminAuthService);
  const tenantContext = inject(AdminTenantContextService);
  const tenantId = tenantContext.resolveTenantId(route.queryParamMap.get('tenantId'));

  await adminAuth.waitForAuthReady();

  if (!tenantId) {
    return router.createUrlTree(['/admin/login'], {
      queryParams: {
        reason: 'tenant-required',
        redirectTo: state.url,
      },
    });
  }

  if (!adminAuth.user()) {
    return router.createUrlTree(['/admin/login'], {
      queryParams: {
        tenantId,
        redirectTo: state.url,
      },
    });
  }

  const access = await adminAuth.ensureTenantAccess(tenantId);

  if (!access) {
    return router.createUrlTree(['/admin/login'], {
      queryParams: {
        tenantId,
        reason: 'access-denied',
        redirectTo: state.url,
      },
    });
  }

  tenantContext.setTenantId(tenantId);
  tenantContext.storeTenantId(tenantId);

  return true;
};
