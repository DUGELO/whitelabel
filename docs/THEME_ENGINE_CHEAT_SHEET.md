# Theme Engine Cheat Sheet

Consulta rapida para configurar e evoluir o Theme Engine.

## Config minima de tema

```ts
theme: {
  preset: 'editorial-luxury',
}
```

## Config com brand colors

```ts
theme: {
  preset: 'soft-fashion',
  colors: {
    brandPrimary: '#8b1e54',
    brandPrimaryStrong: '#6a1640',
    brandSecondary: '#d195b1',
    accent: '#f3c3d6',
  },
}
```

## Config com variants

```ts
theme: {
  preset: 'modern-boutique',
  variants: {
    hero: 'split-editorial',
    productCard: 'boutique-clean',
    productGrid: 'boutique-grid',
    cta: 'solid-premium',
  },
}
```

## Presets

```txt
editorial-luxury
minimal-premium
soft-fashion
dark-elegance
modern-boutique
```

## Variants

Hero:

```txt
immersive
split-editorial
minimal-focus
```

Product card:

```txt
editorial-minimal
quiet-luxury
boutique-clean
```

Product grid:

```txt
editorial-grid
minimal-grid
boutique-grid
```

CTA:

```txt
solid-premium
soft-outline
quiet-link
```

## Semantic CSS variables

Colors:

```txt
--color-brand-primary
--color-brand-primary-strong
--color-brand-secondary
--color-accent
--color-background-canvas
--color-background-surface
--color-background-surface-soft
--color-background-warm
--color-text-primary
--color-text-secondary
--color-text-inverse
--color-text-placeholder
--color-icon-muted
--color-border-subtle
--color-input-border
--color-input-bg
--color-focus-ring
--color-overlay-backdrop
--color-footer-bg
--color-feedback-positive
--color-rating-star
```

Typography:

```txt
--font-brand
--font-heading
--font-title
--font-body
--font-weight-heading
--font-weight-body
--line-height-tight
--line-height-body
```

Spacing:

```txt
--spacing-xs
--spacing-sm
--spacing-sm-md
--spacing-md
--spacing-md-lg
--spacing-lg
--spacing-xl
--spacing-2xl
--spacing-xxl
--spacing-3xl
```

Radius:

```txt
--border-radius-sm
--border-radius-card
--border-radius-pill
--border-radius-circle
```

Shadow:

```txt
--shadow-soft
--shadow-card
--shadow-elevated
--shadow-overlay
```

Motion:

```txt
--motion-fast
--motion-medium
--motion-slow
--motion-easing-standard
--motion-easing-emphasized
```

## Legacy aliases temporarios

Ainda funcionam durante a migracao:

```txt
--color-primary
--color-primary-dark
--color-secondary
--color-background
--color-surface
--color-surface-soft
--color-surface-warm
--color-text-main
--color-text-muted
--color-border
--color-star
--color-price-positive
```

Ao editar componente, prefira migrar para semantic tokens novos.

## Arquivos importantes

```txt
src/app/core/storefront/storefront-config.ts
src/app/core/theme/models/theme-config.types.ts
src/app/core/theme/models/theme-preset.types.ts
src/app/core/theme/models/theme-token.types.ts
src/app/core/theme/tokens/base-theme.tokens.ts
src/app/core/theme/tokens/theme-css-vars.ts
src/app/core/theme/presets/index.ts
src/app/core/theme/resolvers/resolve-theme-tokens.ts
src/app/core/theme/services/theme-engine.service.ts
src/app/core/theme/services/css-variable-theme-writer.service.ts
src/app/shared/design-system/tokens/
```

## Fazer

- Usar `preset`.
- Usar brand color overrides controlados.
- Usar semantic tokens em SCSS.
- Usar `computed()` para estado derivado.
- Usar `effect()` apenas para side effects inevitaveis.
- Registrar novos presets em `THEME_PRESETS_BY_ID`.
- Atualizar docs quando mudar contrato.

## Nao fazer

- Nao criar `if (tenant === 'x')`.
- Nao criar CSS por tenant.
- Nao adicionar `customCss`.
- Nao permitir spacing livre por tenant.
- Nao usar cores randomicas em componente.
- Nao duplicar componente por tema.
- Nao acessar Firestore dentro de componente por causa de tema.

## Comandos de validacao

```bash
npm run build
npm test -- --watch=false
```

Observacao: em ambiente sandbox Windows, pode ser necessario rodar os comandos com permissao fora do sandbox se aparecer `Acesso negado` ao resolver arquivos.
