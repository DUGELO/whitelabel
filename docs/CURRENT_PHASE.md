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

## Sprint 5.2 - Auth + Tenant Access

Goal:

- integrate Firebase Auth with the admin
- protect `/admin` with tenant-scoped access validation
- validate `tenants/{tenantId}/users/{uid}` before admin data reads
- prepare role-aware admin behavior for future settings and CRUD writes

Deliverables:

- Firebase Auth export
- `AdminAuthService` using Angular Signals
- `/admin/login` sign-in foundation
- `/admin` guard
- tenant membership validation
- allowed roles: `admin`, `owner`, `editor`, `viewer`
- blocked states for anonymous users and users without tenant access
- no settings form or Product CRUD yet

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
- CRUD-heavy admin work before settings and role permissions are ready

---

# Current Success Criteria

Sprint 5.2 succeeds when:

- unauthenticated users cannot access `/admin`
- authenticated users need a tenant membership document
- `tenantId` stays mandatory
- roles are represented in the admin access model
- settings/product reads run only after tenant access is validated
- future settings/Product CRUD can reuse the same auth contract
