# Theme Engine Tutorial

## 1. Objetivo

Este guia explica como usar e evoluir a fundacao do Theme Engine da Phase 4.

O Theme Engine existe para permitir que cada storefront mude de identidade visual por configuracao, sem forks, sem hardcode de tenant e sem CSS isolado por cliente.

O sistema deve preservar:

- presets controlados
- semantic tokens
- runtime CSS variables
- Angular Signals
- multi-tenant scalability
- performance
- premium consistency

O sistema nao deve virar:

- editor visual livre
- CSS custom por tenant
- lista solta de cores arbitrarias
- fork de componente por cliente

## 2. Arquitetura

Estrutura principal:

```txt
src/app/core/theme/
  models/
  tokens/
  presets/
  resolvers/
  services/
```

Fluxo runtime:

```txt
StorefrontConfig.theme
  -> ThemeEngineService
  -> resolveThemeTokens()
  -> CssVariableThemeWriterService
  -> CSS variables on document.documentElement
  -> SCSS/components consume var(...)
```

Responsabilidades:

| Camada | Responsabilidade |
|---|---|
| `StorefrontConfigService` | config da loja, title e favicon |
| `ThemeEngineService` | resolve tema ativo com Signals |
| `resolveThemeTokens()` | combina preset + overrides controlados |
| `CssVariableThemeWriterService` | escreve CSS variables no DOM |
| `theme-css-vars.ts` | mapeia tokens para nomes CSS |
| `presets/` | define experiencias visuais controladas pela plataforma |

## 3. Como configurar o tema de uma loja

Arquivo:

```txt
src/app/core/storefront/storefront-config.ts
```

Exemplo recomendado:

```ts
theme: {
  preset: 'editorial-luxury',
  colors: {
    brandPrimary: '#8a6a2d',
    brandPrimaryStrong: '#5f4617',
    brandSecondary: '#b99668',
    accent: '#e5d3b1',
  },
  variants: {
    hero: 'immersive',
    productCard: 'editorial-minimal',
    productGrid: 'editorial-grid',
    cta: 'solid-premium',
  },
},
```

Regras:

- `preset` e obrigatorio.
- `colors` e opcional e deve ser usado apenas para identidade da marca.
- `variants` e opcional e deve usar apenas valores definidos nos types.
- Nao configure cor de texto, surface, border, shadow, spacing ou motion por tenant.

## 4. Presets disponiveis

| Preset | Uso indicado |
|---|---|
| `editorial-luxury` | marcas premium, joias, editorial, alto valor percebido |
| `minimal-premium` | marcas sobrias, visual limpo, foco em produto |
| `soft-fashion` | moda, beleza, cosmeticos, tons mais suaves |
| `dark-elegance` | experiencia cinematica, alto contraste, produto aspiracional |
| `modern-boutique` | boutiques modernas, equilibrio entre conversao e elegancia |

Os presets pertencem a plataforma. O tenant apenas escolhe um preset e fornece overrides controlados.

## 5. Variants disponiveis

Tipos atuais:

```ts
type HeroVariantId = 'immersive' | 'split-editorial' | 'minimal-focus';
type ProductCardVariantId = 'editorial-minimal' | 'quiet-luxury' | 'boutique-clean';
type ProductGridVariantId = 'editorial-grid' | 'minimal-grid' | 'boutique-grid';
type CtaVariantId = 'solid-premium' | 'soft-outline' | 'quiet-link';
```

Os variants ainda sao fundacao arquitetural. Componentes devem passar a consumir esses valores nas proximas etapas da Phase 4.

Regra importante:

```ts
// permitido
variant: themeEngine.variants().productCard

// proibido
if (tenant === 'atelier-aurea') {
  // comportamento visual especial
}
```

## 6. Como usar tokens em SCSS

Use semantic tokens novos:

```scss
.card {
  background: var(--color-background-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--border-radius-card);
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--motion-medium) var(--motion-easing-standard);
}
```

Evite hardcodes:

```scss
// proibido
.card {
  color: #241b12;
  padding: 19px;
  transition: 173ms ease;
}
```

Durante a migracao, aliases antigos continuam funcionando:

```scss
--color-primary
--color-primary-dark
--color-secondary
--color-background
--color-surface
--color-text-main
--color-text-muted
--color-border
```

Ao tocar em um componente, prefira migrar para semantic tokens novos.

## 7. Como adicionar um novo preset

1. Criar arquivo em:

```txt
src/app/core/theme/presets/{nome-do-preset}.preset.ts
```

2. Basear em `BASE_THEME_TOKENS`:

```ts
export const NOVO_PRESET = {
  id: 'novo-preset',
  name: 'Novo Preset',
  description: 'Descricao curta do direcionamento visual.',
  tokens: {
    ...BASE_THEME_TOKENS,
    color: {
      ...BASE_THEME_TOKENS.color,
      brandPrimary: '#000000',
      brandPrimaryStrong: '#111111',
      brandSecondary: '#444444',
      accent: '#d6c6a8',
    },
  },
  variants: {
    hero: 'immersive',
    productCard: 'editorial-minimal',
    productGrid: 'editorial-grid',
    cta: 'solid-premium',
  },
} satisfies ThemePreset;
```

3. Registrar em:

```txt
src/app/core/theme/presets/index.ts
```

4. Adicionar o id em:

```txt
src/app/core/theme/models/theme-preset.types.ts
```

5. Criar ou atualizar testes do resolver quando houver comportamento novo.

6. Rodar:

```bash
npm run build
npm test -- --watch=false
```

## 8. Como adicionar um novo token

1. Adicionar o campo no model correto:

```txt
src/app/core/theme/models/theme-token.types.ts
```

2. Adicionar fallback em:

```txt
src/app/core/theme/tokens/base-theme.tokens.ts
```

3. Mapear para CSS variable em:

```txt
src/app/core/theme/tokens/theme-css-vars.ts
```

4. Adicionar fallback SCSS em:

```txt
src/app/shared/design-system/tokens/
```

5. Usar o token no componente via `var(...)`.

Nao adicione tokens para resolver apenas um tenant. Se o token nao serve a uma familia de componentes ou presets, provavelmente e customizacao indevida.

## 9. Como adicionar uma nova variant

1. Adicionar o id no type apropriado:

```txt
src/app/core/theme/models/theme-preset.types.ts
```

2. Definir o valor em todos os presets ou garantir fallback no preset base.

3. Usar a variant no componente como configuracao, nao como tenant logic.

4. Documentar quando a variant deve ser usada.

Variants devem ser poucas, reutilizaveis e visualmente validadas.

## 10. Como debugar o tema ativo

No browser, inspecione o elemento `html`.

O writer adiciona:

```html
<html data-theme-preset="editorial-luxury">
```

Tambem confira CSS variables computadas:

```css
--color-brand-primary
--color-background-canvas
--color-text-primary
--color-overlay-backdrop
--font-heading
--spacing-md
--shadow-card
--motion-medium
```

Se uma variavel estiver vazia:

1. confira o preset em `src/app/core/theme/presets/`
2. confira `BASE_THEME_TOKENS`
3. confira `theme-css-vars.ts`
4. confira se `ThemeEngineService.initializeTheme()` roda no `app.config.ts`

## 11. Checklist antes de publicar uma mudanca de tema

- [ ] Nenhum hardcode de tenant foi criado.
- [ ] Nenhum componente acessa Firestore por causa de tema.
- [ ] O tema usa preset, tokens e variants.
- [ ] Overrides sao apenas de brand colors permitidas.
- [ ] Components usam CSS variables.
- [ ] `effect()` foi usado apenas para side effect de DOM quando necessario.
- [ ] `npm run build` passou.
- [ ] `npm test -- --watch=false` passou.
- [ ] Documentacao foi atualizada quando houve mudanca de contrato.

## 12. Anti-patterns

Nunca:

```ts
if (tenant === 'x') {}
```

Nunca:

```scss
.tenant-x-card {
  color: #ff44aa;
}
```

Nunca:

```ts
theme: {
  backgroundCanvas: '#ffffff',
  cardPadding: '27px',
  customCss: '...'
}
```

Sempre prefira:

```ts
theme: {
  preset: 'soft-fashion',
  colors: {
    brandPrimary: '#9f5368',
    brandPrimaryStrong: '#74364a',
    brandSecondary: '#b98877',
    accent: '#efd0cc',
  },
}
```
