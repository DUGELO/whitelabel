# Current Active Phase

## Active Phase

# Phase 5 - Admin Panel

---

# Strategic Priority

The storefront engine now needs an owned admin surface so white label clients can manage store settings and products without code changes.

The goal is to evolve from:

> manually edited storefront configuration

to:

> Firebase-first tenant administration with controlled customization.

---

# Current Technical Direction

The platform will use:

- Angular admin panel
- Firebase Auth
- Firestore
- Firebase Storage later in Phase 5
- tenant-scoped services
- controlled theme configuration

The system will NOT use:

- Strapi for now
- tenant forks
- unrestricted visual customization
- CSS edited freely by clients
- enterprise admin complexity

---

# Current Sprint

## Sprint 5.4 - Product CRUD

Goal:

- allow tenant users to manage real Firestore products
- persist product changes in `tenants/{tenantId}/products`
- keep `tenantId` mandatory for all admin product reads and writes
- preserve compatibility with the current storefront product mapper

Deliverables:

- products area inside `/admin`
- product list for `tenants/{tenantId}/products`
- create product
- edit product
- activate and deactivate product
- simple validation for required product fields
- role-aware write behavior
- documentation for product CRUD
- no media upload yet

---

# Current Constraints

Must preserve:

- tenant isolation
- Firebase-first architecture
- Firestore access through admin services
- Angular Signals state model
- current product document compatibility
- low operational complexity

Must avoid:

- hardcoded tenant logic
- overengineered abstractions
- direct Firestore access inside components
- Product Storage upload before Sprint 5.5
- visual customization outside Theme Engine tokens
- hard deletes as the default product workflow

---

# Current Success Criteria

Sprint 5.4 succeeds when:

- products load from `tenants/{tenantId}/products`
- `owner`, `admin` and `editor` can create and edit products
- `viewer` users remain read-only
- created products include the active `tenantId`
- product activation is controlled through `active`
- products remain compatible with the storefront mapper
- future media upload can build on top of the image URL fields
