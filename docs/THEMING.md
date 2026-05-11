# Theming System

## 1. Theme System Philosophy

The platform uses a controlled theming system.

The objective is NOT unlimited customization.

The objective is:

- premium visual consistency
- scalable branding
- curated experiences
- maintainable storefronts
- high perceived value

Themes must feel professionally art directed.

The system prioritizes:

> controlled premium identity over unrestricted customization.

---

## 2. Core Principle

Themes are configuration-driven.

Never tenant-driven hardcoded UI.

Forbidden:

```ts
if (tenant === 'x')
```

Correct:

```json
{
  "theme": "editorial-luxury"
}
```

## 3. Theme Responsibilities

Themes are responsible for controlling:

- colors
- typography
- spacing
- border radius
- shadows
- motion behavior
- card styles
- hero styles
- layout density
- CTA appearance
- section aesthetics

Themes are NOT responsible for:

- business logic
- Firestore logic
- routing
- backend behavior

## 4. Theme Goals

Every theme must:

- feel cohesive
- feel premium
- preserve usability
- preserve mobile quality
- preserve conversion clarity

The user should feel:

- professionalism
- authenticity
- trust
- visual quality

## 5. Controlled Customization Strategy

The platform intentionally limits customization.

Customers may:

- choose themes
- choose variants
- choose branding colors
- choose typography presets
- choose section layouts

Customers may NOT:

- arbitrarily redesign the UI
- break spacing systems
- inject random visual styles
- create inconsistent interfaces

The system is curated.

## 6. Theme Architecture

### 6.1 Base Tokens

Global foundational tokens:

- spacing
- typography scale
- border radius
- shadows
- motion timing
- breakpoints

Base tokens should remain stable.

### 6.2 Semantic Tokens

Semantic meanings:

```json
{
  "colorBackground": "#ffffff",
  "colorTextPrimary": "#111111",
  "colorSurface": "#f8f8f8",
  "colorAccent": "#c89b6d"
}
```

Themes override semantic meaning, not component internals.

### 6.3 Component Variants

Components support controlled variants.

Example:

```json
{
  "productCardVariant": "editorial-minimal"
}
```

Variants should remain finite and curated.

## 7. Theme Presets

Initial preset direction:

### Editorial Luxury

Characteristics:

- spacious layouts
- serif headings
- soft neutral palette
- immersive imagery
- elegant motion

### Minimal Premium

Characteristics:

- minimal UI
- monochromatic focus
- clean spacing
- understated elegance

### Soft Fashion

Characteristics:

- warmer tones
- softer shadows
- emotional visual direction
- fashion-oriented layouts

### Dark Elegance

Characteristics:

- dark surfaces
- cinematic imagery
- high contrast luxury
- premium product focus

### Modern Boutique

Characteristics:

- balanced conversion
- modern minimalism
- approachable luxury
- strong mobile experience

## 8. Theme Consistency Rules

Themes must preserve:

- spacing rhythm
- typography hierarchy
- motion language
- component behavior
- layout clarity

Themes should feel different in identity but unified in quality.

## 9. Branding Strategy

Each tenant may define:

- brand colors
- logo
- typography preset
- hero variant
- theme preset

Branding should adapt within controlled limits.

The platform protects visual quality.

## 10. Layout Variants

Sections may support variants.

Example:

```json
{
  "heroVariant": "immersive",
  "gridVariant": "editorial-grid"
}
```

Variants must remain:

- reusable
- scalable
- visually validated

Avoid one-off layouts.

## 11. Motion Tokens

Motion must be tokenized.

Example:

```json
{
  "motionFast": "150ms",
  "motionMedium": "250ms",
  "motionSlow": "400ms"
}
```

Motion should feel:

- subtle
- premium
- smooth

Never chaotic.

## 12. Spacing Philosophy

Spacing is one of the strongest luxury perception drivers.

Themes should prefer:

- generous spacing
- visual breathing room
- calm composition

Avoid:

- cramped layouts
- dense grids
- excessive information density

## 13. Typography Strategy

Typography should remain highly curated.

Themes may switch:

- serif family
- sans family
- heading style

But typography hierarchy must remain consistent.

Avoid:

- random font combinations
- inconsistent scaling
- chaotic weights

## 14. Theme Scalability

Themes must scale without:

- duplicated code
- isolated forks
- tenant-specific hacks

New themes should extend the system rather than bypass it.

## 15. Multi-Tenant Isolation

Each tenant stores only theme configuration.

Never duplicate theme logic per tenant.

Correct:

```json
{
  "theme": "editorial-luxury",
  "brandColor": "#b38a5c"
}
```

Incorrect:

```ts
if (tenant === 'alma-sexy') {
  // special visual behavior
}
```

## 16. Theme + Conversion Relationship

Themes must preserve:

- CTA visibility
- readability
- mobile usability
- product clarity

Visual elegance must support conversion, not reduce it.

## 17. Performance Constraints

Themes must remain performant.

Avoid:

- excessive visual effects
- heavy runtime calculations
- oversized assets
- animation overload

Premium perception depends on smoothness.

## 18. AI Development Constraints

AI-generated code must:

- use tokens
- use variants
- follow preset philosophy
- avoid hardcoded visual values
- preserve consistency

AI must never invent isolated tenant behavior.

## 19. Anti-Patterns

Forbidden:

- tenant-specific styling
- inline visual hacks
- random colors
- uncontrolled customization
- visual inconsistency
- component duplication
- unvalidated theme additions

## 20. North Star

The theming system succeeds when storefronts feel visually unique in identity while remaining consistently premium, elegant and scalable.
