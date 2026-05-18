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
- Firebase Storage for tenant-scoped media
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

## Sprint 5.7 - Security + Release

Goal:

- close Phase 5 with secure Firebase rules
- document tenant isolation and role enforcement
- add operational release checklist for the admin
- verify build and tests before moving to future phases

Deliverables:

- source-controlled Firestore rules
- source-controlled Storage rules
- Firebase rules wired through `firebase.json`
- server-side role enforcement for admin writes
- tenant isolation documented
- admin operational checklist
- Phase 5 release documentation
- no large new admin features

---

# Current Constraints

Must preserve:

- tenant isolation
- Firebase-first architecture
- Firestore access through admin services
- Storage access through tenant-scoped admin services
- Angular Signals state model
- current product document compatibility
- low operational complexity

Must avoid:

- hardcoded tenant logic
- overengineered abstractions
- direct Firestore access inside components
- Storage paths without `tenantId`
- asset collections before they are needed
- publish workflow before it is explicitly designed
- open public writes
- tenant membership checks outside server rules
- visual customization outside Theme Engine tokens
- hard deletes as the default product workflow

---

# Current Success Criteria

Sprint 5.7 succeeds when:

- Firestore rules are versioned in the repo
- Storage rules are versioned in the repo
- settings/product writes require `owner`, `admin` or `editor`
- `viewer` remains read-only server-side
- tenant users can only access their own tenant path
- public product reads are limited to active products
- product image uploads are tenant-scoped
- build and tests pass
- no tenant-specific logic or hardcoded tenant id is introduced
