# Anti-Patterns

## 1. Purpose

This document defines the anti-patterns that must be avoided inside the platform.

The goal is to protect:
- scalability
- maintainability
- premium perception
- multi-tenant integrity
- frontend consistency
- long-term product quality

This project is a scalable platform.

Not a collection of custom websites.

---

# 2. Tenant-Specific Hardcoding

## Forbidden

```ts
if (tenant === 'x')

or:

switch (tenant)

Why this is harmful:

destroys scalability
creates maintenance chaos
introduces hidden coupling
creates platform fragmentation

Correct approach:

themes
presets
variants
configuration
3. Custom Feature Per Tenant

Forbidden:

isolated feature branches for specific tenants
one-off UI behaviors
unique business logic per customer

Why this is harmful:

creates freelance-agency architecture
destroys platform scalability
increases support complexity exponentially

Correct approach:

generalized patterns
reusable variants
optional configuration
4. Direct Firestore Access Inside Components

Forbidden:

collection(db, ...)

inside UI components.

Why this is harmful:

breaks architectural separation
couples UI to backend structure
reduces maintainability

Correct flow:

Firestore -> Service -> Mapper -> Component
5. Excessive effect()

Forbidden:

effects used for state derivation
chained effects
effect-driven architecture
duplicated reactive synchronization

Why this is harmful:

unpredictable state
difficult debugging
cascading updates
performance degradation

Correct approach:

computed()
derived state
clear ownership
6. State Duplication

Forbidden:

mirrored state
multiple sources of truth
duplicated signals

Why this is harmful:

synchronization bugs
inconsistent UI
maintenance complexity

Correct approach:

single ownership
derived state
normalized flows
7. Massive Components

Forbidden:

giant templates
giant TypeScript files
multi-responsibility components

Why this is harmful:

low maintainability
difficult reuse
hidden coupling
slower development

Correct approach:

composable architecture
smaller focused components
isolated responsibilities
8. Inline Arbitrary Styling

Forbidden:

margin-top: 37px;
padding: 13px;
color: #c291ff;

Why this is harmful:

visual inconsistency
impossible scaling
theme fragmentation

Correct approach:

spacing tokens
semantic tokens
shared scales
9. Random Visual Decisions

Forbidden:

inconsistent spacing
random border radius
inconsistent typography
arbitrary shadows
uncontrolled colors

Why this is harmful:

destroys premium perception
weakens brand identity
creates UI chaos

Correct approach:

design tokens
shared visual systems
preset-driven design
10. Over-Customization

Forbidden:

unrestricted visual editing
arbitrary layouts
user-controlled chaos

Why this is harmful:

destroys visual consistency
increases support complexity
weakens product identity

Correct approach:

controlled presets
curated themes
scalable variants
11. Generic Ecommerce Aesthetics

Forbidden:

cluttered homepages
excessive sales banners
noisy grids
visually dense interfaces
aggressive UI patterns

Why this is harmful:

reduces premium perception
weakens trust
hurts differentiation

Correct approach:

editorial layouts
calm hierarchy
spacious composition
elegant conversion
12. Excessive Motion

Forbidden:

flashy animations
chaotic transitions
bounce-heavy UI
exaggerated transforms

Why this is harmful:

feels cheap
hurts usability
weakens premium feel

Correct approach:

subtle motion
smooth transitions
intentional feedback
13. Premature Complexity

Forbidden:

overengineering
unnecessary abstractions
speculative architecture
unnecessary microservices

Why this is harmful:

slower iteration
maintenance burden
harder onboarding

Correct approach:

scalable simplicity
intentional abstractions
incremental evolution
14. UI Logic Mixed With Business Logic

Forbidden:

business orchestration inside components
heavy logic in templates
UI directly controlling persistence

Why this is harmful:

low maintainability
hidden coupling
difficult testing

Correct approach:

services
mappers
presentation-focused UI
15. Performance Neglect

Forbidden:

oversized images
unnecessary rerenders
excessive listeners
heavy runtime calculations
layout shift

Why this is harmful:

hurts conversion
hurts paid traffic ROI
weakens premium feel

Correct approach:

optimized rendering
lightweight interactions
image optimization
smooth performance
16. Theme Fragmentation

Forbidden:

isolated styling systems
duplicated theme logic
uncontrolled variants

Why this is harmful:

inconsistent branding
scaling difficulty
maintenance chaos

Correct approach:

centralized tokens
semantic theming
curated variants
17. Accessibility Neglect

Forbidden:

unreadable typography
inaccessible contrast
broken keyboard navigation
tiny touch targets

Why this is harmful:

poor UX
weaker trust
reduced usability

Correct approach:

integrated accessibility
responsive touch-friendly UI
readable interfaces
18. Copying Shopify Blindly

Forbidden:

generic ecommerce cloning
operational complexity obsession
feature quantity over quality

Why this is harmful:

weak differentiation
direct competition with giants
diluted identity

Correct approach:

premium perception
editorial commerce
conversion-focused storefronts
controlled simplicity
19. Freelance Agency Mentality

Forbidden:

solving every customer request individually
custom coding per client
isolated exceptions

Why this is harmful:

impossible scaling
operational collapse
platform fragmentation

Correct approach:

scalable systems
reusable patterns
controlled configuration
20. Ignoring Documentation

Forbidden:

undocumented architecture changes
undocumented conventions
hidden system behavior

Why this is harmful:

AI inconsistency
onboarding difficulty
architectural drift

Correct approach:

living documentation
explicit conventions
architectural clarity
21. AI Misuse

Forbidden:

blindly accepting generated code
architecture-breaking prompts
contextless generation

Why this is harmful:

inconsistent systems
regressions
hidden technical debt

Correct approach:

AI guided by architecture
documented constraints
controlled generation
22. Product Drift

Forbidden:

turning the platform into a generic builder
prioritizing unlimited customization
abandoning premium positioning

Why this is harmful:

destroys differentiation
weakens brand identity
creates market confusion

Correct approach:

preserve positioning
preserve visual identity
preserve curated experience
23. North Star

The platform succeeds when:

it scales without chaos
storefronts remain premium
architecture remains maintainable
tenants remain isolated
the visual identity remains cohesive
the product stays differentiated
small brands feel visually established