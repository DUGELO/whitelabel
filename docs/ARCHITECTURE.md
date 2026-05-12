# Architecture

## 1. Architecture Philosophy

The platform architecture prioritizes:

- scalability
- maintainability
- premium performance
- multi-tenant isolation
- visual consistency
- controlled customization
- AI-assisted development compatibility

The architecture must support long-term growth without turning into tenant-specific custom development chaos.

The system is designed as a:

> Premium storefront engine with controlled visual presets.

---

## 2. Core Principles

### 2.1 Config Over Hardcoding

The platform must always prefer:

- configuration
- tokens
- variants
- presets

instead of:

- hardcoded tenant logic
- tenant-specific conditionals
- isolated forks

Forbidden:

```ts
if (tenant === 'x')
```

Correct approach:

```json
{
  "theme": "editorial-luxury",
  "heroVariant": "immersive",
  "productCardVariant": "editorial-minimal"
}
```

### 2.2 Controlled Customization

Customization is intentionally limited.

The goal is:

- preserve visual quality
- preserve consistency
- preserve scalability
- preserve maintainability

Clients choose among curated premium presets.

The platform is not a freeform website builder.

### 2.3 Presentation-Driven Frontend

Frontend components should prioritize:

- clarity
- elegance
- performance
- reusability
- visual consistency

Business logic must not leak into presentation components.

### 2.4 Mobile-First Architecture

All experiences are designed mobile-first.

Primary traffic sources:

- Instagram
- WhatsApp
- paid traffic
- mobile users

Every component must behave correctly on mobile before desktop adaptations.

## 3. Technology Stack

### Frontend

- Angular 21+
- Angular Signals
- Standalone Components
- SCSS
- TypeScript

### Backend / Infrastructure

- Firebase
- Firestore
- Firebase Authentication
- Firebase Storage
- Firebase Hosting

### Future Possibilities

- Cloud Functions
- SSR / Angular Universal
- Edge rendering
- CDN image optimization
- Search indexing

## 4. Multi-Tenant Strategy

Each storefront belongs to a tenant.

Firestore structure:

```txt
tenants/
  {tenantId}/
    config/
    products/
    users/
```

Each tenant is fully isolated.

No tenant should affect another tenant.

## 5. Firestore Philosophy

Firestore is the source of truth.

Rules:

- Components never access Firestore directly.
- Access only through services.
- Mapping layers must normalize data.
- Firestore documents should remain UI-agnostic when possible.

## 6. Layered Frontend Architecture

### 6.1 UI Layer

Responsible for:

- rendering
- interaction
- animations
- layout
- responsiveness

Must not contain:

- Firestore logic
- business persistence
- tenant resolution logic

### 6.2 Service Layer

Responsible for:

- data fetching
- persistence
- API communication
- Firestore communication

Services may expose:

- signals
- methods
- state

Services must not contain:

- visual hacks
- DOM manipulation
- theme decisions

### 6.3 Mapping Layer

Responsible for:

- transforming Firestore data
- normalizing models
- adapting backend structures to UI structures

Example:

```ts
mapToProduct()
```

### 6.4 Theme Layer

Responsible for:

- tokens
- colors
- spacing
- typography
- shadows
- motion
- variants

Theming must remain declarative.

## 7. Signals Philosophy

Angular Signals are preferred over unnecessary RxJS complexity.

Use:

- `signal()`
- `computed()`
- minimal `effects()`

Avoid:

- excessive effects
- state duplication
- unnecessary subscriptions

Principle:

> Derive state whenever possible.

## 8. Component Philosophy

Components should be:

- reusable
- composable
- variant-driven
- theme-aware
- visually consistent

Avoid:

- giant components
- tenant-specific components
- inline visual hacks

## 9. Performance Philosophy

Performance is critical because paid traffic is expensive.

The storefront must feel:

- fast
- responsive
- smooth
- premium

Priorities:

- lazy loading
- optimized rendering
- image optimization
- minimal blocking scripts
- smooth animations
- reduced layout shift

## 10. Motion Philosophy

Motion should feel:

- elegant
- subtle
- premium
- intentional

Avoid:

- excessive animations
- flashy effects
- distracting motion

Motion exists to:

- improve perception
- guide attention
- reinforce premium feel

## 11. AI-Assisted Development Philosophy

The project is designed for AI-assisted engineering.

Architecture and rules must be documented clearly so AI tools can:

- maintain consistency
- avoid regressions
- follow conventions
- preserve system identity

The system should remain understandable by both humans and AI agents.

## 12. Scalability Direction

The architecture must support future expansion:

- product pages
- search
- filters
- admin panel
- checkout
- payment integrations
- analytics
- A/B testing
- SEO improvements

without requiring architectural rewrites.

## 13. Anti-Chaos Principles

Never:

- create tenant forks
- duplicate UI systems
- bypass theme tokens
- create special-case architecture
- solve problems with hacks

Always:

- generalize carefully
- preserve visual consistency
- preserve maintainability
- preserve scalability

## 14. North Star

The architecture succeeds when:

- new storefronts can launch quickly
- premium perception remains consistent
- tenants stay isolated
- development remains scalable
- the system avoids becoming custom freelance work
- new features integrate without architectural degradation
