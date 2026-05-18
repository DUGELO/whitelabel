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
- slogan and store description
- logo, favicon and product-not-found image paths
- WhatsApp URL
- Instagram URL
- primary contact channel
- theme preset
- brand color overrides, only after explicit color customization
- typography preset
- product card variant
- catalog currency
- default WhatsApp message

It does not edit:

- products
- media uploads
- arbitrary CSS
- custom fonts
- unrestricted layouts
- product base URL
- hero, product grid or CTA variants until those controls have storefront-visible effects

## Runtime Contract

Settings are persisted as an `AdminStorefrontSettingsDocument`.

When `settings/main` does not exist, the admin still loads the legacy tenant fallback from:

```txt
tenants/{tenantId}
```

Saving that fallback creates `settings/main`.

WhatsApp is normalized before save and follows the Firestore contact contract:

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

Current direction:

```js
function canManageSettings(tenantId) {
  return isTenantMember(tenantId)
    && tenantUserData(tenantId).role in ['admin', 'owner', 'editor'];
}

match /tenants/{tenantId}/settings/{settingsId} {
  allow get: if isTenantMember(tenantId)
    || (settingsId == 'main' && isPublicStorefrontSettings());
  allow create, update: if settingsId == 'main'
    && canManageSettings(tenantId)
    && isValidSettingsWrite();
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

Color overrides are intentionally opt-in:

- changing the theme preset saves only `theme.preset`
- preset colors are shown in the preview but are not persisted as `theme.colors`
- `theme.colors` is written only after the user chooses `Personalizar cores`
- overrides equal to the selected preset are removed on save
- `Usar cores do tema` clears color overrides

Only the product card variant is editable in Sprint 5 because it has a real storefront implementation today. Hero, grid and CTA variants remain controlled Theme Engine concepts, but they are not exposed in the admin until the storefront consumes them visually.

## Sprint 5.4 Handoff

Next step:

- Product CRUD
- list `tenants/{tenantId}/products`
- create and edit product documents
- activate and deactivate products
- keep media uploads deferred to Sprint 5.5

## Sprint 5.6 Update

Settings now include a compact preview and stronger pre-save validation.

Save is blocked when required identity/contact/theme data is missing or outside the controlled Theme Engine contract.

WhatsApp remains stored as:

```txt
https://wa.me/5598984655819
```

## Staff Review Update

The settings save now writes a canonical `settings/main` document instead of merging arbitrary existing fields.

This keeps old unknown keys, `customCss` and freeform theme payloads from surviving future saves.

## Staff Review Follow-up

The Loja screen no longer exposes fields with no storefront effect:

- `catalog.baseProductUrl` is not edited by the admin until it is used by a public/share flow.
- `theme.variants.hero`, `theme.variants.productGrid` and `theme.variants.cta` are not edited by the admin until their variants affect rendered storefront components.

Firestore settings may still contain these controlled keys for forward compatibility, but the current admin will not generate them.
