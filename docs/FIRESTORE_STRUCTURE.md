# Firestore Structure

## 1. Purpose

This document defines the Firestore data structure for the multi-tenant storefront platform.

The goals are:

- tenant isolation
- scalable data modeling
- simple reads for storefront performance
- safe writes through admin flows
- future support for cart, orders and payments

Firestore must support the product as a SaaS platform, not as a single static catalog.

---

## 2. Core Structure

Current base structure:

```text
tenants/
  {tenantId}/
    products/
    users/
```

Recommended expanded structure:

```text
tenants/
  {tenantId}/
    settings/
    products/
    categories/
    users/
    assets/
    analytics/
    carts/
    orders/
    payments/
```

## 3. Tenant Document

Path:

```text
tenants/{tenantId}
```

Example:

```json
{
  "name": "Alma Sexy",
  "slug": "alma-sexy",
  "status": "active",
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}
```

Rules:

- tenantId must be stable
- tenantId must be lowercase
- tenantId must be URL-safe
- tenantId must never depend on a mutable display name

## 4. Settings

Path:

```text
tenants/{tenantId}/settings/main
```

Example:

```json
{
  "brand": {
    "name": "Alma Sexy",
    "logoUrl": "",
    "description": "",
    "instagramUrl": "",
    "whatsappUrl": ""
  },
  "theme": {
    "preset": "editorial-luxury",
    "colors": {
      "brandPrimary": "#7b1e3a",
      "brandPrimaryStrong": "#5b142b",
      "brandSecondary": "#000000",
      "accent": "#c9a46b"
    },
    "typographyPreset": "editorial-serif"
  },
  "layout": {
    "heroVariant": "immersive",
    "productCardVariant": "editorial-minimal",
    "productGridVariant": "editorial-grid"
  },
  "catalog": {
    "currencyCode": "BRL",
    "defaultWhatsAppMessage": "Olá, tenho interesse no produto"
  },
  "updatedAt": "serverTimestamp"
}
```

Purpose:

- controls storefront identity
- drives theme engine
- avoids tenant-specific code

## 5. Products

Path:

```text
tenants/{tenantId}/products/{productId}
```

Example:

```json
{
  "tenantId": "alma-sexy",
  "slug": "anel-solitario-lumiere-oval",
  "title": "Anel Solitário Lumière Oval",
  "description": "Descrição curta do produto.",
  "longDescription": "Descrição longa e editorial do produto.",
  "price": 3890,
  "compareAtPrice": 4290,
  "category": "Anéis",
  "categoryId": null,
  "tags": ["anel", "ouro", "premium"],
  "highlights": ["Ouro 18k", "Premium"],
  "images": [
    {
      "url": "https://...",
      "alt": "Anel solitário dourado",
      "order": 0,
      "kind": "image"
    }
  ],
  "active": true,
  "status": "published",
  "rating": 5,
  "reviewCount": 184,
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}
```

Rules:

- document ID should remain Firebase auto-id
- slug is a field, not the document ID
- slug may change
- productId is technical identity
- slug is business/URL identity
- storefront reads only active/published products

## 6. Product Status

Allowed statuses:

- draft
- published
- inactive
- archived

Meaning:

- draft: not ready for storefront
- published: visible publicly
- inactive: temporarily hidden
- archived: preserved but not active

Avoid hard deleting products by default.

Prefer soft deletion through status.

## 7. Categories

Path:

```text
tenants/{tenantId}/categories/{categoryId}
```

Example:

```json
{
  "tenantId": "alma-sexy",
  "name": "Anéis",
  "slug": "aneis",
  "description": "",
  "order": 1,
  "active": true,
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}
```

Current MVP may use product.category as string.

Future version should migrate to categoryId.

## 8. Users

Path:

```text
tenants/{tenantId}/users/{uid}
```

Example:

```json
{
  "uid": "firebase-auth-uid",
  "email": "client@email.com",
  "name": "Client Name",
  "role": "owner",
  "active": true,
  "createdAt": "serverTimestamp"
}
```

Possible roles:

- owner
- manager
- editor
- viewer

Rules:

- users are scoped by tenant
- user access must be validated through Firestore rules
- no user should access another tenant

## 9. Assets

Future path:

```text
tenants/{tenantId}/assets/{assetId}
```

Example:

```json
{
  "tenantId": "alma-sexy",
  "url": "https://...",
  "path": "tenants/alma-sexy/products/image.jpg",
  "type": "product-image",
  "alt": "",
  "createdAt": "serverTimestamp"
}
```

Purpose:

- track uploaded files
- support cleanup
- support image management

## 10. Carts

Future path:

```text
tenants/{tenantId}/carts/{cartId}
```

Example:

```json
{
  "tenantId": "alma-sexy",
  "status": "active",
  "customerId": null,
  "items": [
    {
      "productId": "abc123",
      "slug": "anel-solitario",
      "title": "Anel Solitário",
      "quantity": 1,
      "unitPrice": 3890,
      "imageUrl": "https://..."
    }
  ],
  "subtotal": 3890,
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}
```

Purpose:

- prepare future checkout
- preserve platform evolution path

## 11. Orders

Future path:

```text
tenants/{tenantId}/orders/{orderId}
```

Example:

```json
{
  "tenantId": "alma-sexy",
  "status": "pending",
  "customer": {
    "name": "",
    "email": "",
    "phone": ""
  },
  "items": [],
  "subtotal": 0,
  "shipping": 0,
  "discount": 0,
  "total": 0,
  "paymentStatus": "pending",
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}
```

Possible order statuses:

- pending
- confirmed
- paid
- cancelled
- fulfilled

## 12. Payments

Future path:

```text
tenants/{tenantId}/payments/{paymentId}
```

Example:

```json
{
  "tenantId": "alma-sexy",
  "orderId": "order-id",
  "provider": "mercado-pago",
  "status": "pending",
  "amount": 0,
  "currency": "BRL",
  "externalReference": "",
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}
```

Purpose:

- abstract payment providers
- prepare future Pix/card integrations
- keep payment logic separate from orders

## 13. Analytics

Future path:

```text
tenants/{tenantId}/analytics/{eventId}
```

Example:

```json
{
  "tenantId": "alma-sexy",
  "event": "product_clicked",
  "productId": "abc123",
  "source": "storefront",
  "createdAt": "serverTimestamp"
}
```

Analytics should support:

- catalog loaded
- product viewed
- product clicked
- WhatsApp clicked
- Instagram clicked

## 14. Firestore Access Rules

Frontend components must never access Firestore directly.

Correct flow:

```text
Firestore -> Service -> Mapper -> Component
```

Services are responsible for:

- reading collections
- writing documents
- handling Firebase SDK calls

Mappers are responsible for:

- adapting Firestore documents to UI models

Components are responsible for:

- rendering
- interaction
- presentation

## 15. Security Rules Philosophy

Public storefront reads are allowed only for public data.

Examples:

- published products
- public settings
- public categories

Writes must require authentication and tenant membership.

Never allow public writes.

## 16. MVP Rules Direction

Example read/write direction:

```js
match /tenants/{tenantId}/products/{productId} {
  allow read: if resource.data.active == true
    && resource.data.status == "published";

  allow write: if request.auth != null
    && exists(/databases/$(database)/documents/tenants/$(tenantId)/users/$(request.auth.uid));
}
```

During development, rules may be temporarily relaxed, but must be restored before production.

## 17. Mapping Rules

Firestore document shape is not automatically UI shape.

Use mappers such as:

```ts
mapToProduct()
```

Mapping protects the UI from backend changes.

Never couple components directly to Firestore document structure.

## 18. Timestamp Rules

Use Firebase server timestamps for persisted created/updated fields.

Do not store literal strings like:

```json
{
  "createdAt": "timestamp"
}
```

Use:

```ts
serverTimestamp()
```

## 19. ID Rules

Use Firebase auto-id for documents.

Use slug as a field.

Reason:

- document ID is stable technical identity
- slug is mutable URL identity
- changing slug should not recreate the product
- future orders should reference stable product IDs

## 20. Future Migration Strategy

The structure should support future migrations:

- category string to categoryId
- basic image URLs to Storage assets
- WhatsApp catalog to checkout/cart
- public catalog to full ecommerce flow

Avoid decisions that block future growth.

## 21. Anti-Patterns

Avoid:

- using slug as document ID
- direct Firestore in components
- public write rules
- tenant hardcoding
- duplicated product structures
- deleting products permanently by default
- coupling UI directly to Firestore shape
- storing timestamps as strings

## 22. North Star

The Firestore structure succeeds when it supports multiple tenants, premium storefront rendering, admin management, future checkout and scalable platform growth without architectural rewrites.
