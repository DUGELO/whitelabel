# Admin Security + Release

## Purpose

This document records the Sprint 5.7 security and release foundation for Phase 5.

The admin is now ready to be released as a controlled Firebase-first surface, provided the Firebase rules in this repository are deployed and the tenant/user documents are configured correctly.

## Source-Controlled Rules

Sprint 5.7 adds:

```txt
firebase.json
firestore.rules
storage.rules
```

`firebase.json` points Firebase CLI deployments to the local rules files.

No rules are deployed by committing these files. Deploy must still be done intentionally with the Firebase CLI.

## Firestore Rules Summary

Firestore rules protect:

- `tenants/{tenantId}`
- `tenants/{tenantId}/settings/main`
- `tenants/{tenantId}/products/{productId}`
- `tenants/{tenantId}/users/{uid}`

Role model:

```txt
owner
admin
editor
viewer
```

Admin read access requires a tenant user document:

```txt
tenants/{tenantId}/users/{uid}
```

The user document must have:

```txt
active != false
role in owner | admin | editor | viewer
```

Write access for settings and products requires:

```txt
role in owner | admin | editor
```

User management writes are reserved for:

```txt
role in owner | admin
```

## Public Product Reads

Public storefront reads are limited to active products:

```txt
resource.data.active == true
```

The storefront product query was aligned with that rule:

```txt
where('active', '==', true)
```

This avoids keeping public product reads fully open while preserving the current storefront behavior.

The active storefront tenant is config-owned:

```txt
STOREFRONT_CONFIG.tenantId
```

The product service no longer hardcodes a tenant ID in loading logic.

## Settings Rules

Settings writes are allowed only for:

```txt
tenants/{tenantId}/settings/main
```

Rules validate the same core contract used by the admin UI:

- brand name
- URL-safe brand slug
- controlled theme preset
- controlled typography preset
- controlled variants
- valid hex brand colors
- at least one contact channel
- valid WhatsApp or Instagram URL

The rules intentionally do not allow arbitrary settings documents.

## Product Rules

Product writes require:

- `tenantId` equal to the path tenant
- active boolean
- title
- URL-safe slug
- description
- positive price
- valid compare-at price when present
- tags list
- highlights list
- at least one image
- rating number
- review count number

Product deletes remain blocked. The admin uses `active` for visibility control.

## Storage Rules Summary

Storage product media is scoped to:

```txt
tenants/{tenantId}/products/{productSlug}/{fileName}
```

Uploads require:

- signed-in Firebase user
- valid tenant membership
- role in `owner | admin | editor`
- valid product slug path segment
- `image/*` content type
- maximum 5 MB per file

Product images are public-readable because the storefront needs to render them.

All other Storage paths are denied.

## Staff Review Update

After the Phase 5 Staff/Product review, the source-controlled Firestore rules were tightened:

- brand asset fields now accept only http(s) URLs or controlled local asset paths
- every supported `contactChannels` item is validated, not only the first one
- every supported product image item is validated, not only the first one
- product image URLs must be http(s)

The runtime mapper was also adjusted so tenants other than the local fallback tenant do not inherit
the fallback brand assets, commercial contact links, or public product base URL.

## Tenant Isolation

Every Firestore and Storage rule depends on `tenantId` from the path.

The path tenant is matched against:

```txt
tenants/{tenantId}/users/{request.auth.uid}
```

This prevents a valid user from one tenant from using the same role in another tenant.

## Operational Checklist

Before enabling a tenant admin:

- Create `tenants/{tenantId}` with stable lowercase slug-based ID.
- Create Firebase Auth user.
- Create `tenants/{tenantId}/users/{uid}` with matching Auth UID.
- Set `role` to `owner`, `admin`, `editor` or `viewer`.
- Keep `active` omitted or set it to `true`.
- Confirm `/admin/login?tenantId={tenantId}` allows sign-in.
- Confirm `/admin?tenantId={tenantId}` loads dashboard.
- Confirm viewer cannot save settings, products or uploads.
- Confirm owner/admin/editor can save settings.
- Confirm owner/admin/editor can create/edit products.
- Confirm product upload writes to `tenants/{tenantId}/products/{productSlug}`.
- Confirm public storefront only loads active products.
- Run `npm run build`.
- Run `npm test`.

## Deployment Checklist

Before deploying rules:

- Review `firestore.rules`.
- Review `storage.rules`.
- Confirm all existing product documents have `active`.
- Confirm product documents include `tenantId` equal to the path tenant.
- Confirm settings have at least one valid contact channel before saving.
- Deploy Firestore rules with Firebase CLI.
- Deploy Storage rules with Firebase CLI.
- Re-test admin login, settings, product CRUD and upload after rules deployment.

## Explicit Non-Goals

Sprint 5.7 does not add:

- billing
- checkout
- orders
- global super admin
- product deletion UI
- asset library
- audit logs
- Cloud Functions
- tenant provisioning automation

Those can be added in future phases when the product needs them.

## Phase 5 Closeout

Phase 5 now has:

- admin route and shell
- Firebase Auth
- tenant access validation
- settings management
- product CRUD
- Storage upload for product images
- previews and validation
- source-controlled Firebase rules
- operational release checklist

The next architectural direction should move to Phase 6 only after the Firebase rules are deployed and verified in the real Firebase project.
