# Admin Storefront Settings

## Purpose

This document records the Sprint 5.3 settings foundation.

The admin can now create or update:

```txt
tenants/{tenantId}/settings/main
```

The goal is controlled storefront configuration, not freeform CMS customization.

## Route

Settings live inside:

```txt
/admin?tenantId={tenantId}
```

The admin shell exposes the `Configuracoes` area after Auth + Tenant Access succeeds.

## Editable Fields

Sprint 5.3 edits:

- store name
- store slug
- WhatsApp URL
- Instagram URL
- primary contact channel
- theme preset
- brand color overrides
- typography preset
- hero variant
- product card variant
- product grid variant
- CTA variant

It does not edit:

- products
- media uploads
- arbitrary CSS
- custom fonts
- unrestricted layouts

## Runtime Contract

Settings are persisted as an `AdminStorefrontSettingsDocument`.

When `settings/main` does not exist, the admin still loads the legacy tenant fallback from:

```txt
tenants/{tenantId}
```

Saving that fallback creates `settings/main`.

WhatsApp follows the Firestore contact contract:

```txt
socialLinks.whatsappUrl = https://wa.me/5598984655819
```

## Role Rules

Sprint 5.3 keeps settings visible to all valid tenant users, but only these roles may save:

```txt
admin
owner
editor
```

`viewer` is read-only.

## Firestore Rules Direction

The app blocks writes in the UI, but Firestore rules must also allow settings writes only for tenant managers.

Example direction:

```js
function canManageSettings(tenantId) {
  return isTenantMember(tenantId)
    && tenantUserData(tenantId).role in ['admin', 'owner', 'editor'];
}

match /tenants/{tenantId}/settings/{settingsId} {
  allow read: if isTenantMember(tenantId);
  allow write: if canManageSettings(tenantId);
}
```

## Theme Guardrails

The UI only exposes platform-owned values:

- `editorial-luxury`
- `minimal-premium`
- `soft-fashion`
- `dark-elegance`
- `modern-boutique`

Variants and typography presets follow the Theme Engine contract documented in `THEME_ENGINE_CHEAT_SHEET.md`.

## Sprint 5.4 Handoff

Next step:

- Product CRUD
- list `tenants/{tenantId}/products`
- create and edit product documents
- activate and deactivate products
- keep media uploads deferred to Sprint 5.5
