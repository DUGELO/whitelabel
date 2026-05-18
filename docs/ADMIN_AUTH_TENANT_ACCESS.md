# Admin Auth + Tenant Access

## Purpose

This document records the Sprint 5.2 auth foundation for the Admin Panel.

The admin remains Firebase-first:

- Firebase Auth owns user authentication
- Firestore owns tenant membership
- `tenantId` remains mandatory for admin data access

## Routes

```txt
/admin/login
/admin
```

`/admin/login` is public and only handles sign-in plus tenant selection.

`/admin` is protected by:

```txt
src/app/features/admin/guards/admin-auth.guard.ts
```

## Access Flow

```txt
/admin?tenantId={tenantId}
  -> wait for Firebase Auth
  -> require authenticated user
  -> read tenants/{tenantId}/users/{uid}
  -> require active user document
  -> require allowed role
  -> set AdminTenantContextService tenantId
  -> load admin shell
```

No admin Firestore reads for settings/products should happen before this tenant access check.

## Allowed Roles

Allowed admin roles:

```txt
admin
owner
editor
viewer
```

The role is stored in:

```txt
tenants/{tenantId}/users/{uid}.role
```

`active: false` blocks access even when the role is valid.

## Services

Sprint 5.2 adds:

```txt
src/app/features/admin/services/admin-auth.service.ts
```

Responsibilities:

- observe Firebase Auth with Signals
- expose current admin user
- sign in and sign out
- validate tenant access through `AdminFirestoreService.getTenantUser()`
- expose the active `AdminTenantAccess`

`AdminAuthService` does not query Firestore directly. It keeps Firestore access inside the admin Firestore service.

## Tenant Resolution

Tenant resolution remains explicit.

The guard and login can use:

1. `?tenantId={tenantId}`
2. remembered `white-label.admin.tenantId`
3. tenant input on the login/admin shell

The remembered tenant is convenience only. It is not an authorization source.

## Blocked States

The guard redirects to `/admin/login` when:

- there is no authenticated Firebase user
- there is no tenantId
- the user has no document in `tenants/{tenantId}/users/{uid}`
- the tenant user document has `active: false`
- the role is outside the allowed admin roles

## Deferred

Sprint 5.2 does not implement:

- settings edit form
- product CRUD
- media upload
- Firestore rules release hardening

## Sprint 5.3 Handoff

Next step:

- build Storefront Settings UI
- persist controlled settings to `tenants/{tenantId}/settings/main`
- keep using `AdminAuthService.tenantAccess()` to gate future write permissions by role

## Sprint 5.7 Update

Firebase rules now enforce the same tenant access model server-side.

The UI role checks remain useful for UX, but writes must be authorized by:

```txt
tenants/{tenantId}/users/{request.auth.uid}
```

Server-side write roles:

```txt
owner
admin
editor
```

`viewer` remains read-only in both UI and Firestore/Storage rules.
