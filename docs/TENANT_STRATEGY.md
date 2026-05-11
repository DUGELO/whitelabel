# Tenant Strategy

## 1. Purpose

This document defines the multi-tenant strategy of the platform.

The goal is to ensure:

- scalability
- tenant isolation
- maintainability
- premium consistency
- operational simplicity

The platform must scale as a product, not as custom client projects.

---

## 2. Multi-Tenant Philosophy

The platform is:

> one system serving multiple storefronts.

Each storefront belongs to a tenant.

Each tenant has:

- branding
- products
- settings
- users
- visual identity

But all tenants share:

- architecture
- component system
- theme engine
- platform infrastructure

---

## 3. Core Principle

Tenants are configuration-driven.

Never hardcoded.

Forbidden:

```ts
if (tenant === 'x')
```

Correct:

```json
{
  "theme": "editorial-luxury",
  "heroVariant": "immersive",
  "brandColor": "#b38a5c"
}
```

## 4. Tenant Isolation

Each tenant must remain isolated.

Isolation applies to:

- products
- users
- branding
- settings
- uploaded assets
- analytics
- future orders

One tenant must never access another tenant’s data.

## 5. Firestore Structure

Current structure:

```txt
tenants/
  {tenantId}/
    config/
    products/
    users/
```

Future expandable structure:

```txt
tenants/
  {tenantId}/
    config/
    products/
    users/
    orders/
    analytics/
    themes/
    assets/
```

## 6. Tenant ID Rules

Tenant IDs must be:

- stable
- unique
- URL-safe
- lowercase
- slug-based

Correct examples:

- `alma-sexy`
- `atelier-lumiere`
- `verona-jewelry`

Avoid:

- spaces
- uppercase
- random ids
- user-facing unstable ids

## 7. Tenant Resolution Strategy

The storefront should resolve tenants through:

- domain
- subdomain
- route strategy
- configuration

Possible future examples:

```txt
alma.whitelabel.com
```

or:

```txt
whitelabel.com/alma
```

The resolution system must remain abstracted.

## 8. Theme Ownership

Themes belong to the platform.

Tenants only select:

- presets
- variants
- branding options

Tenants do NOT own:

- component logic
- custom rendering systems
- isolated frontend behavior

This preserves scalability.

## 9. Tenant Configuration Philosophy

Tenant configuration should remain declarative.

Correct:

```json
{
  "theme": "minimal-premium",
  "brandColor": "#d4b07b",
  "heroVariant": "split-editorial"
}
```

Avoid:

- logic in configuration
- executable behavior
- isolated feature toggles without architecture

## 10. Product Ownership

Products belong to tenants.

Each product should contain:

- stable slug
- images
- pricing
- category
- branding-compatible metadata

Products should remain presentation-friendly but normalized.

## 11. Shared Infrastructure Philosophy

All tenants share:

- frontend engine
- theme engine
- Firestore architecture
- component system
- animation system

This is critical for:

- maintainability
- scaling
- AI-assisted development
- operational simplicity

## 12. Controlled Customization

Tenants may customize:

- themes
- logos
- brand colors
- typography presets
- hero variants
- homepage composition presets

Tenants may NOT:

- redesign architecture
- inject arbitrary UI systems
- create custom frontend forks

## 13. Anti-Fork Philosophy

The platform must never evolve into:

> custom website per client

Every new requirement should ask:

> can this become a scalable preset or reusable variant?

If not:

- reconsider implementation
- avoid tenant-specific hacks

## 14. Asset Strategy

Tenant assets should remain isolated.

Examples:

- logos
- product images
- banners
- future media assets

Future structure:

```txt
storage/
  tenants/
    {tenantId}/
```

## 15. Tenant User Strategy

Tenant users should remain scoped to their tenant.

Users should not:

- access global admin behavior
- access other tenant data
- bypass isolation rules

Future possible roles:

- owner
- manager
- editor

## 16. Admin Panel Philosophy

The admin panel must expose:

- simplicity
- controlled branding
- easy product management

The admin panel should avoid:

- enterprise complexity
- overwhelming customization
- operational bloat

## 17. Tenant Scaling Philosophy

The system must support:

- many tenants
- isolated branding
- shared infrastructure
- reusable visual systems

without:

- duplicated code
- duplicated themes
- duplicated architecture

## 18. Performance Philosophy

Tenant architecture must remain performant.

Avoid:

- runtime-heavy tenant logic
- duplicated rendering systems
- isolated frontend bundles

Prefer:

- configuration-driven rendering
- shared optimized components
- lightweight theme switching

## 19. AI Development Constraints

AI-generated code must:

- preserve tenant isolation
- avoid tenant-specific logic
- preserve shared systems
- extend presets instead of creating forks

AI must never:

- create isolated storefront behavior
- create hardcoded tenant rendering

## 20. Business Philosophy

The business model depends on:

- scalability
- low support complexity
- reusable systems
- controlled customization

The platform must remain:

- scalable
- maintainable
- premium
- operationally simple

## 21. Future Scalability

The architecture should support future:

- custom domains
- analytics
- orders
- checkout
- payments
- SEO systems
- AI-generated storefront enhancements

without rewriting the tenant foundation.

## 22. Anti-Patterns

Forbidden:

- tenant hardcoding
- custom forks
- isolated themes
- duplicated storefront systems
- custom backend flows per tenant
- unique component systems per customer

## 23. North Star

The tenant system succeeds when:

- storefronts feel unique in identity
- architecture remains shared
- tenants remain isolated
- visual quality remains premium
- the platform scales without chaos
- new customers can onboard quickly
