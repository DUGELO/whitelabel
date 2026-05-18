# Admin Preview + Validation

## Purpose

This document records the Sprint 5.6 preview and validation foundation.

The admin now gives tenant users a simple pre-save view of storefront settings and product data, plus stricter validation before writing to Firestore.

The goal is to reduce broken storefront data without introducing a publication workflow or CMS complexity.

## Scope

Sprint 5.6 touches:

```txt
src/app/features/admin/admin-settings
src/app/features/admin/admin-products
```

It does not change the Firestore document contract.

Writes still go through:

```txt
AdminFirestoreService.saveStorefrontSettings(...)
AdminFirestoreService.createProduct(...)
AdminFirestoreService.updateProduct(...)
AdminFirestoreService.setProductActive(...)
```

Storage uploads still go through:

```txt
AdminStorageService.uploadProductImage(...)
```

## Settings Preview

The settings form derives a preview from the current Angular Signal form state.

Preview shows:

- store name
- slug
- theme preset
- typography preset
- primary contact channel
- WhatsApp URL
- Instagram URL
- brand colors
- selected variants

The preview is derived with `computed()` and does not create another source of truth.

## Settings Validation

Settings save is blocked when:

- store name is empty
- store slug is empty or not URL-safe
- no contact channel is configured
- WhatsApp URL is not in `https://wa.me/{number}` format
- Instagram URL is not a valid `http` or `https` URL
- primary contact channel is selected but its URL is empty
- theme preset, typography preset or variants are outside the controlled options
- brand colors are not valid hex values

This keeps Theme Engine customization controlled and prevents empty contact data from being persisted.

## Product Preview

The product editor derives a preview from the current Angular Signal form state.

Preview shows:

- first valid image URL
- title
- slug
- short description
- category
- active/inactive status
- price
- compare-at price
- image count
- tags
- highlights

The preview is not a storefront replica. It is a compact admin validation surface.

## Product Validation

Product save is blocked when:

- title is empty
- slug is empty or not URL-safe
- slug duplicates another product in the same tenant
- short description is empty
- price is missing or not positive
- compare-at price is lower than price
- no image exists
- any image URL is invalid

Product create/update still persists the current contract:

```ts
images: Array<{ url: string; alt?: string; order?: number; kind?: 'image' }>;
```

## States

Sprint 5.6 adds or improves:

- settings saving state
- product saving state
- product upload lock during save/edit/toggle flows
- clearer empty product list copy
- validation issue list near previews

Viewer users remain read-only.

## Explicit Non-Goals

Sprint 5.6 does not add:

- publish/unpublish workflow
- draft review workflow
- full storefront iframe preview
- route-level preview tokens
- content scheduling
- moderation
- advanced asset cleanup
- custom validation rules per tenant

## Sprint 5.7 Handoff

Next step:

- review Firestore rules
- review Storage rules
- ensure write roles are enforced server-side
- document operational rules
- run final build/test checks
- prepare a release checklist
