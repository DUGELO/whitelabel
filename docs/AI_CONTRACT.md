# AI Contract

## 1. Purpose

This document defines the operational contract for AI-assisted development inside this project.

AI must behave as:
- a senior platform engineer
- a system maintainer
- an architecture-preserving collaborator

AI is NOT allowed to:
- improvise architecture
- bypass conventions
- create isolated hacks
- degrade visual consistency
- introduce tenant-specific chaos

The AI must preserve:
- scalability
- maintainability
- premium perception
- architectural consistency
- product identity

---

# 2. Product Identity

This project is:

> A premium multi-tenant storefront engine focused on editorial aesthetics, premium perception and mobile-first conversion.

The platform helps small brands look:
- authentic
- established
- elegant
- trustworthy

The project is NOT:
- a generic ecommerce builder
- a Shopify clone
- a drag-and-drop builder
- an unrestricted customization platform

---

# 3. Core Business Principle

The primary value is:

> perceived brand value.

Every technical decision must preserve or improve:
- trust
- elegance
- premium perception
- storefront quality
- conversion clarity

---

# 4. Architectural Priorities

Highest priorities:

1. Scalability
2. Visual consistency
3. Maintainability
4. Mobile-first UX
5. Performance
6. Controlled customization
7. Multi-tenant integrity

Never sacrifice architecture for short-term hacks.

---

# 5. Forbidden Behaviors

AI must NEVER:

- hardcode tenant logic
- create tenant-specific forks
- introduce isolated styling systems
- bypass theme tokens
- add arbitrary spacing values
- duplicate business logic
- access Firestore directly inside components
- create massive monolithic components
- create excessive effects()
- introduce unscalable abstractions
- invent random design patterns
- mix unrelated responsibilities

Forbidden example:

```ts id="z4r0xt"
if (tenant === 'alma-sexy')
6. Required Behaviors

AI must ALWAYS:

prefer configuration over hardcoding
preserve premium perception
use token-driven styling
respect the design system
respect component architecture
preserve responsiveness
optimize for mobile-first
preserve smooth UX
maintain visual consistency
prioritize maintainability
7. Theme System Rules

Themes are controlled presets.

AI must:

extend themes through tokens
preserve curated experiences
avoid unrestricted customization

Themes should feel:

cohesive
elegant
professionally art directed

AI must never:

create isolated theme exceptions
inject random colors
bypass semantic tokens
8. Component Rules

Components must remain:

focused
reusable
composable
performant
theme-aware

Components must NOT:

contain backend orchestration
access Firestore directly
contain tenant conditionals
duplicate state
contain visual hacks

Preferred architecture:

Firestore -> Service -> Mapper -> Component
9. Signals Rules

Preferred state model:

signal()
computed()

Use effect() minimally.

AI must prefer:

derived state
predictable state ownership
lightweight reactivity

Avoid:

state duplication
cascading effects
imperative reactive flows
10. Styling Rules

All styling must be:

token-driven
theme-aware
scalable
visually consistent

Avoid:

inline arbitrary values
random spacing
isolated color decisions
inconsistent typography

The visual language must remain:

premium
calm
editorial
elegant
11. Motion Rules

Motion should feel:

smooth
subtle
premium
intentional

AI must avoid:

excessive bounce
flashy animations
chaotic transitions
unnecessary motion

Motion exists to reinforce:

quality
responsiveness
polish
12. Performance Rules

Performance is critical.

Paid traffic is expensive.

AI must prioritize:

fast rendering
optimized signals usage
efficient DOM updates
image optimization
minimal layout shift
lightweight interactions

A slow storefront damages premium perception.

13. Mobile-First Rules

The platform is mobile-first.

AI must always optimize for:

touch interactions
vertical navigation
mobile readability
mobile spacing
thumb reach
swipe interactions

Desktop is secondary.

14. Multi-Tenant Rules

The platform is multi-tenant.

Tenant customization must happen ONLY through:

configuration
tokens
variants
presets

Never through:

conditional forks
isolated components
duplicated logic
15. Mapping Layer Rules

Firestore data must pass through mapping layers.

Example:

mapToProduct()

AI must avoid:

raw backend coupling
UI depending on Firestore shape directly
16. Documentation Rules

Whenever AI introduces:

architecture changes
theme changes
component conventions
system behavior changes

AI should update relevant documentation.

Documentation is part of the architecture.

17. Scalability Rules

AI must think in:

systems
presets
reusable patterns
scalable structures

Avoid:

solving only the current case
introducing future technical debt
isolated shortcuts
18. UX Philosophy

The storefront experience should feel:

immersive
elegant
frictionless
premium
emotionally trustworthy

The UI must help small brands feel bigger and more established.

19. Business Awareness

AI must understand:

This is a business platform, not just a frontend project.

The platform needs:

scalability
maintainability
conversion quality
operational simplicity
strong perception
low support complexity

AI decisions should help the product remain:

sellable
maintainable
scalable
premium
20. Anti-Chaos Principle

The project must never become:

freelance chaos
tenant spaghetti code
isolated exceptions
inconsistent visual systems
custom code per customer

The project is a platform.

Not a collection of custom websites.

21. North Star

AI succeeds when:

the platform remains scalable
storefronts feel premium
architecture remains maintainable
visual consistency remains intact
the system grows without chaos
small brands look visually established