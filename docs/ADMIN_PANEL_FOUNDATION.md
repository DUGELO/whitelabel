# Admin Panel Foundation

## Purpose

This document records the Sprint 5.1 admin foundation.

The admin panel is a tenant-scoped Angular surface. It is not a CMS abstraction and it does not bypass the Theme Engine.

## Route

```txt
/admin
```

The route lazy-loads:

```txt
src/app/features/admin/admin-shell/admin-shell.ts
```

The root layout removes storefront header, footer and floating contact CTA for `/admin`, so the admin shell owns the full screen.

## Current Folder Shape

```txt
src/app/features/admin/
  admin-shell/
    admin-shell.ts
    admin-shell.html
    admin-shell.scss
    admin-shell.spec.ts
  admin-dashboard/
    admin-dashboard.ts
    admin-dashboard.html
    admin-dashboard.scss
    admin-dashboard.spec.ts
  mappers/
  models/
  services/
```

## Tenant Bootstrap

Sprint 5.1 has no Firebase Auth guard yet.

The admin shell resolves the tenant context from:

1. `?tenantId={tenantId}` query param
2. previously stored `white-label.admin.tenantId`
3. manual tenantId input in the shell

No Firestore read happens until a tenantId exists.

When a tenant is loaded, `AdminTenantContextService` owns the active tenantId. Firestore reads still go through `AdminFirestoreService`.

## Dashboard Scope

The initial dashboard only reads:

- storefront settings via `getStorefrontSettings(tenantId)`
- products count via `getProducts(tenantId)`

It does not implement:

- Auth guard
- settings form
- product CRUD
- media upload

## Styling Rules

The admin foundation uses the existing runtime CSS variables:

- semantic colors
- spacing tokens
- radius tokens
- focus ring token

No tenant-specific CSS or free visual customization was introduced.

## Sprint 5.2 Update

Sprint 5.2 adds Firebase Auth and tenant access validation before the admin shell is allowed to load.

The admin foundation now depends on:

```txt
AdminAuthService
adminAuthGuard
tenants/{tenantId}/users/{uid}
```

See [ADMIN_AUTH_TENANT_ACCESS.md](ADMIN_AUTH_TENANT_ACCESS.md).

## Sprint 5.3 Handoff

Next step:

- build Storefront Settings UI
- persist controlled settings
- reuse tenant access and roles for write permissions
