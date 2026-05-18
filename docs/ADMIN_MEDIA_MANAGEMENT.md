# Admin Media Management

## Purpose

This document records the Sprint 5.5 media foundation.

The admin can now upload product images with Firebase Storage and use the generated download URLs in:

```txt
tenants/{tenantId}/products/{productId}.images
```

This is not a full asset manager. The goal is a small, tenant-scoped upload path that fits the Product CRUD from Sprint 5.4.

## Storage Path

Product images are uploaded to:

```txt
tenants/{tenantId}/products/{productSlug}/{timestamp}-{fileName}
```

Examples:

```txt
tenants/whitelabel/products/colar-aurora/1789250000000-colar.jpg
```

Rules:

- `tenantId` is always required.
- `tenantId` is not inferred or hardcoded.
- product uploads require a valid product slug.
- file names are normalized before upload.

## Runtime Flow

The admin product editor uses this flow:

```txt
file input
  -> AdminStorageService.uploadProductImage(tenantId, productSlug, file)
  -> Firebase Storage upload
  -> Firebase download URL
  -> append URL to product images field
  -> AdminFirestoreService.createProduct/updateProduct persists images on save
```

Firestore product writes still go only through:

```txt
AdminFirestoreService.createProduct(...)
AdminFirestoreService.updateProduct(...)
AdminFirestoreService.setProductActive(...)
```

The Storage service does not write product documents directly.

## Validation

Sprint 5.5 validates:

- file must be an image (`image/*`)
- file must be at most 5 MB
- product slug must be present and URL-safe
- viewer role cannot upload

The UI exposes upload loading/error states with Angular Signals.

## Saved Product Shape

Uploaded images are still stored in the existing product contract:

```ts
images: Array<{
  url: string;
  alt?: string;
  order?: number;
  kind?: 'image';
}>;
```

Only URLs are persisted in the product document for now. Storage paths are kept in the Storage object location and can be added to a future asset registry if needed.

## Role Rules

Admin UI write roles:

```txt
owner
admin
editor
```

`viewer` remains read-only.

Firestore and Storage rules must enforce the same policy server-side. UI checks are not a security boundary.

## Storage Rules Direction

Recommended Storage rule direction:

```js
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    function isSignedIn() {
      return request.auth != null;
    }

    function tenantUserPath(tenantId) {
      return /databases/(default)/documents/tenants/$(tenantId)/users/$(request.auth.uid);
    }

    function tenantUserData(tenantId) {
      return firestore.get(tenantUserPath(tenantId)).data;
    }

    function canManageTenantContent(tenantId) {
      return isSignedIn()
        && firestore.exists(tenantUserPath(tenantId))
        && tenantUserData(tenantId).get('active', true) == true
        && tenantUserData(tenantId).role in ['admin', 'owner', 'editor'];
    }

    match /tenants/{tenantId}/products/{productSlug}/{fileName} {
      allow read: if true;
      allow write: if canManageTenantContent(tenantId)
        && request.resource.size <= 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

Before production, public reads can be tightened if product visibility rules require it.

## Explicit Non-Goals

Sprint 5.5 does not add:

- gallery management
- asset search
- image transforms
- delete/reorder UI
- logo/favicon upload
- `tenants/{tenantId}/assets`
- a DAM-style media library

Logo/favicon upload can be added later using the same `tenants/{tenantId}` Storage root if it becomes necessary.

## Sprint 5.6 Handoff

Next step:

- preview settings and product data before publishing
- validate required product image data before save
- improve empty/loading/error states
- keep media validation close to the admin workflow

## Sprint 5.7 Update

The Storage rule source now lives in:

```txt
storage.rules
```

Product image upload remains scoped to:

```txt
tenants/{tenantId}/products/{productSlug}/{fileName}
```

Only authenticated tenant users with `owner`, `admin` or `editor` role can upload product images.
