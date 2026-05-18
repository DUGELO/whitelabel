# Admin Product CRUD

## Purpose

This document records the Sprint 5.4 product management foundation.

The admin can now manage documents in:

```txt
tenants/{tenantId}/products
```

The goal is a practical CRUD for the current catalog, not a full ecommerce back office.

## Route

Products live inside:

```txt
/admin?tenantId={tenantId}
```

The admin shell exposes the `Produtos` area after Auth + Tenant Access succeeds.

## Editable Fields

Sprint 5.4 edits:

- title
- slug
- description
- longDescription
- price
- compareAtPrice
- category
- tags
- highlights
- images as URL list
- active

It does not edit:

- Storage asset metadata
- product variants
- inventory
- checkout data
- orders
- arbitrary storefront styling

## Runtime Contract

Admin product writes go through:

```txt
AdminFirestoreService.createProduct(tenantId, product)
AdminFirestoreService.updateProduct(tenantId, productId, product)
AdminFirestoreService.setProductActive(tenantId, productId, active)
```

The component never writes Firestore directly.

Create uses Firebase auto-id and forces:

```txt
tenantId = active admin tenantId
createdAt = serverTimestamp()
updatedAt = serverTimestamp()
```

Update keeps the document ID stable and updates:

```txt
updatedAt = serverTimestamp()
```

## Product Visibility

Sprint 5.4 uses the existing `active` field.

The admin does not hard delete products by default. Deactivation is the safe MVP workflow.

New products start inactive unless the admin explicitly marks them active.

## Role Rules

Products are visible to all valid tenant users, but only these roles may save or activate/deactivate:

```txt
admin
owner
editor
```

`viewer` is read-only.

## Firestore Rules Direction

The UI blocks writes for viewers, but Firestore rules must also enforce write roles.

Example direction:

```js
function canManageTenantContent(tenantId) {
  return isTenantMember(tenantId)
    && tenantUserData(tenantId).role in ['admin', 'owner', 'editor'];
}

match /tenants/{tenantId}/products/{productId} {
  allow read: if true;
  allow write: if canManageTenantContent(tenantId);
}
```

Before production, public reads should be tightened to published/active public product rules.

## Image Handling

Sprint 5.4 kept images as URLs in the product document:

```ts
images: Array<{ url: string; alt?: string; order?: number; kind: 'image' }>;
```

Sprint 5.5 adds product image upload through Firebase Storage, but the product document contract stays the same: uploaded download URLs are saved in `images`.

Storage path:

```txt
tenants/{tenantId}/products/{productSlug}/{timestamp}-{fileName}
```

## Sprint 5.6 Handoff

Next step:

- preview and validation before publishing
- stronger empty/loading/error states
- no DAM unless real admin workflows require it

## Sprint 5.6 Update

Product management now includes a compact editor preview and stronger pre-save validation.

Save is blocked when required fields are missing, the slug is invalid or duplicated in the current tenant product list, price data is invalid, or image URLs are missing/invalid.

This is still not a publish workflow. The current `active` flag remains the MVP visibility control.

## Sprint 5.7 Update

Public storefront reads are now expected to query only active products.

The storefront Firestore service uses:

```txt
where active == true
```

Admin users with a valid tenant role can still read all products through the admin service.

Server-side product writes require:

```txt
owner
admin
editor
```
