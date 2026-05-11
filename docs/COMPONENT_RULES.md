# Component Rules

## 1. Component Philosophy

Components are the foundation of the storefront experience.

Every component must prioritize:

- elegance
- clarity
- performance
- scalability
- reusability
- visual consistency

Components must support the platform identity.

The UI should always feel:

- premium
- calm
- intentional
- responsive
- cohesive

---

## 2. Component Responsibilities

Components are presentation-focused.

Components are responsible for:

- rendering
- interactions
- animations
- layout behavior
- responsive behavior
- visual consistency

Components are NOT responsible for:

- direct Firestore access
- persistence logic
- tenant resolution
- backend orchestration
- business-heavy logic

---

## 3. Architectural Separation

Correct architecture:

```text
Firestore -> Service -> Mapper -> Component
```

Forbidden:

```text
Component -> Firestore
```

Components must consume:

- signals
- inputs
- computed values
- presentation-ready data

## 4. Standalone Components

The project uses Angular standalone components.

Prefer:

- isolated imports
- local dependencies
- composable architecture

Avoid:

- giant monolithic modules
- deeply coupled component trees

## 5. Signals Philosophy

Angular Signals are the preferred state model.

Use:

- `signal()`
- `computed()`
- minimal `effect()`

Avoid:

- unnecessary RxJS complexity
- duplicated state
- effect overuse
- cascading state updates

Principle:

> derive state whenever possible.

## 6. Effects Rules

Effects should be rare and intentional.

Effects are allowed only for:

- synchronization
- imperative side effects
- integration boundaries

Effects should NOT:

- derive state
- duplicate computed behavior
- create loops
- coordinate complex UI flows

Prefer:

```ts
computed()
```

over:

```ts
effect()
```

whenever possible.

## 7. State Ownership

Each state should have a clear owner.

Avoid:

- duplicated signals
- mirrored state
- multiple sources of truth

The closer the state is to business logic, the higher it should live.

## 8. Component Size Rules

Components should remain focused.

Avoid:

- massive templates
- giant TypeScript files
- multi-responsibility components

Prefer:

- composition
- smaller reusable pieces
- isolated concerns

## 9. Variant-Driven Components

Components should support variants through configuration.

Correct:

```json
{
  "variant": "editorial"
}
```

Avoid:

- isolated component forks
- duplicated versions
- tenant-specific variants

Variants must remain:

- reusable
- scalable
- theme-aware

## 10. Styling Philosophy

Styling must remain:

- token-driven
- theme-aware
- consistent

Avoid:

- inline style hacks
- random spacing
- arbitrary values
- isolated visual decisions

Use:

- spacing tokens
- semantic colors
- shared motion values
- shared typography scales

## 11. Responsive Rules

All components must be mobile-first.

The mobile experience is primary.

Desktop should enhance the experience, not redefine it.

Every component must:

- work correctly on small screens
- preserve touch usability
- preserve readability
- preserve spacing quality

## 12. Motion Rules

Motion should feel:

- elegant
- smooth
- subtle
- premium

Avoid:

- excessive bounce
- aggressive transforms
- distracting effects

Animations must reinforce:

- clarity
- hierarchy
- polish

## 13. Accessibility Rules

Accessibility is mandatory.

Components should support:

- semantic HTML
- keyboard navigation
- readable contrast
- touch-friendly sizing
- reduced motion support

Accessibility should feel integrated naturally.

## 14. Performance Rules

Components must remain performant.

Avoid:

- unnecessary rerenders
- expensive DOM operations
- excessive effects
- heavy listeners
- large reactive chains

Prefer:

- computed values
- efficient rendering
- lazy loading
- lightweight interactions

## 15. Image Rules

Images are central to premium perception.

Components handling media should support:

- responsive images
- optimized loading
- graceful loading states
- immersive presentation

Avoid:

- layout shifts
- distorted images
- tiny media displays

## 16. Lightbox Philosophy

Product media interactions should feel premium.

Lightboxes should:

- feel immersive
- preserve smoothness
- support touch interactions
- support swipe
- support elegant zoom behavior

Avoid:

- clunky interactions
- abrupt transitions
- overloaded controls

## 17. Form Philosophy

Forms should feel:

- calm
- premium
- intuitive
- uncluttered

Avoid:

- crowded layouts
- excessive validation noise
- inconsistent field spacing

## 18. Service Interaction Rules

Components should not orchestrate backend logic heavily.

Prefer:

- service methods
- presentation-ready state
- clean interaction boundaries

Avoid:

- Firestore queries in components
- raw backend transformations
- business-heavy templates

## 19. Tenant Isolation Rules

Components must never contain:

```ts
if (tenant === 'x')
```

Tenant customization happens through:

- themes
- presets
- configuration
- variants

Never through isolated component logic.

## 20. Reusability Philosophy

Reusable does not mean infinitely generic.

Components should be:

- focused
- predictable
- composable

Avoid creating "god components".

## 21. Design Consistency Rules

Every component must reinforce:

- premium perception
- editorial feel
- visual trust
- brand quality

The storefront should feel:

- cohesive
- intentional
- professionally designed

## 22. AI-Assisted Development Rules

AI-generated components must:

- follow tokens
- follow variants
- preserve spacing rhythm
- preserve typography hierarchy
- preserve motion language

AI must avoid:

- isolated hacks
- arbitrary styling
- duplicated logic
- visual inconsistency

## 23. Anti-Patterns

Forbidden:

- Firestore access inside components
- tenant-specific conditionals
- duplicated state
- excessive effects
- inline arbitrary styles
- component forks
- giant monolithic components
- inconsistent spacing systems
- unscalable variants

## 24. North Star

Components succeed when they feel premium, scalable, elegant and maintainable while preserving performance and visual consistency across all storefronts.
