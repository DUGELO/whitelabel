# Admin Firestore Contract

## 1. Purpose

This document defines the minimum Firestore contract for Phase 5 Admin Panel.

The admin is Firebase-first:

- Angular admin panel
- Firebase Auth
- Firestore
- Firebase Storage later

The goal is not to create a CMS abstraction. The goal is a simple, tenant-scoped admin surface that can safely manage storefront settings and products.

## 2. Current Database Shape

Current production-like structure:

```txt
tenants/
  whitelabel/
    name
    slug
    primaryColor
    secondaryColor
    instagram
    whatsapp
    createdAt

    products/
      {productId}
        active
        tenantId
        title
        slug
        description
        longDescription
        price
        compareAtPrice
        category
        tags
        highlights
        images
        rating
        reviewCount
        createdAt
        updatedAt

    users/
      {uid}
        uid
        email
        role
```

This shape remains valid during Sprint 5.0.

## 3. Target Database Shape

Target structure for Phase 5:

```txt
tenants/
  {tenantId}/
    name
    slug
    status
    createdAt
    updatedAt

    settings/
      main
        brand
        theme
        content
        contactChannels
        navigationLinks
        socialLinks
        catalog
        primaryContactChannel
        createdAt
        updatedAt

    products/
      {productId}

    users/
      {uid}
```

Future Phase 5.5 may add:

```txt
tenants/
  {tenantId}/
    assets/
      {assetId}
```

## 4. Tenant ID Decision

Admin data access must always receive an explicit `tenantId`.

Sprint 5.0 introduces:

```txt
AdminTenantContextService
```

This service stores the active admin `tenantId` and throws if Firestore access is attempted without one.

Resolution strategy by sprint:

| Sprint | Tenant resolution |
|---|---|
| 5.0 | explicit tenant context service, no hardcoded admin tenant |
| 5.1 | route/query/admin bootstrap may set the tenant context |
| 5.2 | Firebase Auth + `tenants/{tenantId}/users/{uid}` validates access |

The storefront may still have legacy development assumptions, but admin services must not hardcode `whitelabel`.

## 5. Settings Fallback

During migration, `tenants/{tenantId}/settings/main` may not exist.

When missing, admin reads legacy fields from `tenants/{tenantId}`:

- `name`
- `slug`
- `primaryColor`
- `secondaryColor`
- `instagram`
- `whatsapp`

These fields are mapped to an in-memory settings object:

```txt
tenant legacy fields -> AdminStorefrontSettingsDocument
```

The fallback source is returned as:

```ts
source: 'legacy-tenant'
```

If `settings/main` exists, the source is:

```ts
source: 'settings-main'
```

Sprint 5.3 can persist a generated settings document when the user saves settings.

## 6. Models

Sprint 5.0 models live in:

```txt
src/app/features/admin/models/admin-firestore.models.ts
```

Minimum models:

- `AdminTenantDocument`
- `AdminTenantUserDocument`
- `AdminProductDocument`
- `AdminStorefrontSettingsDocument`
- `AdminSettingsReadResult`

Allowed roles:

```txt
admin
owner
editor
viewer
```

## 7. Services

Sprint 5.0 services:

```txt
src/app/features/admin/services/admin-tenant-context.service.ts
src/app/features/admin/services/admin-firestore.service.ts
```

`AdminFirestoreService` currently supports:

- `getTenant(tenantId)`
- `getTenantUser(tenantId, uid)`
- `getStorefrontSettings(tenantId)`
- `getProducts(tenantId)`

Writes are intentionally deferred to later sprints:

- settings write: Sprint 5.3
- product CRUD: Sprint 5.4
- media upload: Sprint 5.5

## 8. Product Contract

Admin product documents mirror current Firestore product fields:

```ts
active: boolean;
tenantId: string;
title: string;
slug: string;
description: string;
longDescription?: string;
price: number;
compareAtPrice?: number;
category?: string;
tags: string[];
highlights: string[];
images: Array<{ url: string; alt?: string; order?: number; kind?: 'image' }>;
rating: number;
reviewCount: number;
createdAt?: unknown;
updatedAt?: unknown;
```

The admin reads all products for management. Public storefront filtering remains separate.

## 9. Guardrails

Do:

- require `tenantId`
- read/write inside `tenants/{tenantId}`
- keep Theme Engine fields controlled
- keep product documents compatible with current storefront mapper
- prefer small migration steps

Do not:

- hardcode tenant-specific logic
- allow arbitrary CSS
- create tenant-specific collections
- move product images to Storage before Sprint 5.5
- build admin UI before the contract is stable

## 10. Sprint 5.1 Handoff

Sprint 5.1 should build:

- `/admin` route
- admin shell layout
- dashboard placeholder
- loading/error states
- tenant context bootstrap

It should consume the Sprint 5.0 services without adding CRUD yet.
