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

## Sprint 5.0 - Firestore Admin Contract

Goal:

- define the minimum Firestore contract for admin
- keep compatibility with the current tenant/product structure
- prepare tenant-scoped admin services
- document current vs target database structure

Deliverables:

- admin models for tenant, tenant user, product and settings
- basic tenant context
- Firestore read service for admin foundation
- legacy tenant fallback for settings
- short operational documentation

---

# Current Constraints

Must preserve:

- tenant isolation
- controlled Theme Engine configuration
- minimal healthy component/service/model separation
- Firebase-first architecture
- low operational complexity

Must avoid:

- hardcoded tenant logic
- overengineered abstractions
- large migrations before they are needed
- visual customization outside Theme Engine
- UI-heavy admin work before the admin contract is stable

---

# Current Success Criteria

Sprint 5.0 succeeds when:

- the admin has a clear Firestore contract
- `tenantId` is mandatory for admin data access
- current legacy tenant fields can still seed settings
- future sprints can build UI/Auth/CRUD without reshaping the contract again
- documentation explains the current and target structures
