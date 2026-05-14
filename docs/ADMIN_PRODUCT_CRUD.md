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

- image uploads
- Storage assets
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

Sprint 5.4 keeps images as URLs in the product document:

```ts
images: Array<{ url: string; alt?: string; order?: number; kind: 'image' }>
```

Firebase Storage upload is deferred to Sprint 5.5.

## Sprint 5.5 Handoff

Next step:

- Firebase Storage
- upload logo/favicon/product images
- save uploaded product URLs in `images`
- keep assets tenant-scoped
- avoid building a complex DAM
