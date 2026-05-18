# Admin Firestore Contract

## 1. Purpose

This document defines the minimum Firestore contract for Phase 5 Admin Panel.

The admin is Firebase-first:

- Angular admin panel
- Firebase Auth
- Firestore
- Firebase Storage

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

Future media workflows may add:

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

| Sprint | Tenant resolution                                                 |
| ------ | ----------------------------------------------------------------- |
| 5.0    | explicit tenant context service, no hardcoded admin tenant        |
| 5.1    | route/query/admin bootstrap may set the tenant context            |
| 5.2    | Firebase Auth + `tenants/{tenantId}/users/{uid}` validates access |

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
source: 'legacy-tenant';
```

If `settings/main` exists, the source is:

```ts
source: 'settings-main';
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
- create asset collections before they are needed
- build admin UI before the contract is stable

## 10. Sprint 5.1 Handoff

Sprint 5.1 should build:

- `/admin` route
- admin shell layout
- dashboard placeholder
- loading/error states
- tenant context bootstrap

It should consume the Sprint 5.0 services without adding CRUD yet.

## 11. Sprint 5.2 Auth Contract

Sprint 5.2 protects admin access with Firebase Auth plus tenant membership.

Access requires:

```txt
request Firebase user
  -> tenants/{tenantId}/users/{uid}
  -> active !== false
  -> role in admin | owner | editor | viewer
```

The admin route is:

```txt
/admin?tenantId={tenantId}
```

The sign-in route is:

```txt
/admin/login
```

`tenantId` remains mandatory. Remembered tenant context can prefill admin flows, but it never authorizes access by itself.

Sprint 5.2 does not add writes. Settings writes remain Sprint 5.3 and product writes remain Sprint 5.4.

## 12. Sprint 5.3 Settings Write Contract

Sprint 5.3 adds the first admin write:

```txt
tenants/{tenantId}/settings/main
```

The write is handled by:

```txt
AdminFirestoreService.saveStorefrontSettings(tenantId, settings)
```

The admin settings UI can create `settings/main` from the legacy tenant fallback returned by `getStorefrontSettings(tenantId)`.

Editable settings are intentionally controlled:

- brand name and slug
- slogan and store description
- logo, favicon and product-not-found image paths
- WhatsApp and Instagram URLs
- primary contact channel
- theme preset
- brand color overrides
- typography preset
- allowed variants
- catalog currency
- product base URL
- default WhatsApp message

No arbitrary CSS, custom fonts or freeform layout configuration is allowed.

Settings write roles:

```txt
admin
owner
editor
```

`viewer` remains read-only.

WhatsApp is stored as a URL:

```txt
socialLinks.whatsappUrl = https://wa.me/5598984655819
```

Phone-like input such as `+55 (98) 98465-5819` may be accepted by the admin UI, but it is normalized before persistence.

Settings writes replace the controlled `settings/main` document instead of merging arbitrary unknown fields.

## 13. Sprint 5.4 Product CRUD Contract

Sprint 5.4 adds product writes for:

```txt
tenants/{tenantId}/products/{productId}
```

The admin writes through:

```txt
AdminFirestoreService.createProduct(tenantId, product)
AdminFirestoreService.updateProduct(tenantId, productId, product)
AdminFirestoreService.setProductActive(tenantId, productId, active)
```

Create uses Firestore auto-id. The admin service owns `tenantId`, `createdAt` and `updatedAt`.

Editable product fields:

- title
- slug
- description
- longDescription
- price
- compareAtPrice
- category
- tags
- highlights
- images
- active

`rating` and `reviewCount` remain preserved or default to `0`.

Product write roles:

```txt
admin
owner
editor
```

`viewer` remains read-only.

Sprint 5.5 can generate image URLs through Firebase Storage, but the product document shape remains the same.

## 14. Sprint 5.5 Media Contract

Sprint 5.5 adds product image uploads through Firebase Storage.

Storage path:

```txt
tenants/{tenantId}/products/{productSlug}/{timestamp}-{fileName}
```

The admin writes media through:

```txt
AdminStorageService.uploadProductImage(tenantId, productSlug, file)
```

The returned download URL is saved in the existing product `images` array when the product form is saved through `AdminFirestoreService`.

Validation:

- `tenantId` required
- valid product slug required
- image files only
- maximum 5 MB per image

Storage upload roles:

```txt
admin
owner
editor
```

`viewer` remains read-only.

Sprint 5.5 does not create `tenants/{tenantId}/assets`; an asset registry can be added later if product, logo and favicon workflows need shared media management.

## 15. Sprint 5.6 Preview + Validation Contract

Sprint 5.6 adds pre-save validation and compact previews to the existing admin forms.

No Firestore document shape changes are introduced.

Settings validation protects:

- brand name
- URL-safe store slug
- at least one contact channel
- WhatsApp URL in `https://wa.me/{number}` format
- valid Instagram URL
- controlled theme preset
- controlled typography preset
- controlled variants
- valid hex brand colors

Product validation protects:

- title
- URL-safe slug
- slug uniqueness inside the active tenant product list
- short description
- positive price
- compare-at price not lower than price
- at least one image
- valid image URLs

Previews are derived from Angular Signals and do not write data.

Write methods remain unchanged:

```txt
AdminFirestoreService.saveStorefrontSettings(...)
AdminFirestoreService.createProduct(...)
AdminFirestoreService.updateProduct(...)
AdminFirestoreService.setProductActive(...)
```

Sprint 5.6 does not add publishing, draft review or custom tenant-specific validation.

## 16. Sprint 5.7 Security + Release Contract

Sprint 5.7 adds source-controlled Firebase rules:

```txt
firestore.rules
storage.rules
firebase.json
```

Firestore write roles:

```txt
settings: owner | admin | editor
products: owner | admin | editor
users: owner | admin
```

`viewer` can read admin data for its tenant but cannot write settings, products, users or media.

Public product reads are restricted to:

```txt
active == true
```

The storefront product query now uses:

```txt
where('active', '==', true)
```

Storage upload writes are restricted to:

```txt
tenants/{tenantId}/products/{productSlug}/{fileName}
```

with authenticated tenant membership, manager role, image content type and 5 MB max size.

Rules are documented in [ADMIN_SECURITY_RELEASE.md](ADMIN_SECURITY_RELEASE.md).
