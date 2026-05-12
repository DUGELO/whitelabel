# Theme Engine Phase 4 QA

Checklist objetivo para fechar a Phase 4 sem virar customizacao livre.

## Campos seguros para futuro admin

| Campo | Pode expor? | Regra |
|---|---:|---|
| `theme.preset` | Sim | Escolher apenas presets existentes em `ThemePresetId`. |
| `theme.colors.brandPrimary` | Sim | Override de identidade da marca. |
| `theme.colors.brandPrimaryStrong` | Sim | Override de identidade da marca. |
| `theme.colors.brandSecondary` | Sim | Override de identidade da marca. |
| `theme.colors.accent` | Sim | Override de apoio visual. |
| `theme.typographyPreset` | Sim | Escolher apenas `TypographyPresetId`. |
| `theme.variants.hero` | Sim | Escolher apenas variants controlados. |
| `theme.variants.productCard` | Sim | Opcional; se vazio, usa default do preset. |
| `theme.variants.productGrid` | Sim | Escolher apenas variants controlados. |
| `theme.variants.cta` | Sim | Escolher apenas variants controlados. |
| surface/text/border/shadow/spacing/motion livres | Nao | Pertencem aos presets da plataforma. |
| `customCss` | Nao | Quebra a arquitetura white label. |

## Matriz minima de validacao visual

| Preset | ProductCard default | Typography sugerida | Validar visualmente |
|---|---|---|---|
| `editorial-luxury` | `editorial-minimal` | `editorial-serif` | Home editorial, card com serif, detalhe legivel. |
| `minimal-premium` | `quiet-luxury` | `modern-sans` | Cards sobrios, menos ruido, busca com boa densidade. |
| `soft-fashion` | `soft-fashion-card` | `soft-serif` | Superficies suaves, card com acento delicado, CTA legivel. |
| `dark-elegance` | `dark-elegance-card` | `cinematic-serif` | Contraste em home/search/detail, preco e CTA visiveis. |
| `modern-boutique` | `boutique-clean` | `modern-sans` | Card comercial limpo, grid escaneavel, mobile sem aperto. |

## Rotas para testar

1. `/` para hero, side cards e grid principal.
2. `/search` para filtros, compact cards e responsivo.
3. `/products/1` para detalhe, galeria, CTAs e relacionados.
4. `/products/999999` para product not found.
5. rota inexistente, por exemplo `/nao-existe`, para 404.

## Sinais de aprovacao

- `html[data-theme-preset]` muda conforme o preset ativo.
- CSS variables em `html` refletem cores, fontes, spacing, radius, shadow e motion.
- `ProductCard` recebe exatamente uma classe tematica de card.
- Sem `if (tenant === ...)` para visual.
- Sem CSS por tenant.
- Brand color overrides nao alteram surface, texto, spacing ou shadow fora do contrato.
- `npm test -- --watch=false` passa.
- `npm run build` passa sem warnings de budget inesperados.
