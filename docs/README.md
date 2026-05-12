# White Label Docs

Esta pasta concentra a documentacao operacional do sistema white label da vitrine.

## Objetivo

O projeto foi estruturado para operar como uma vitrine frontend-only por loja, com configuracao manual por codigo.

Na pratica, uma nova loja e configurada por:

1. branding e textos em `src/app/core/storefront/storefront-config.ts`
2. catalogo em `src/app/features/product/catalog-seed-data.ts`
3. assets visuais em `public/`

## Fonte de verdade

O centro da configuracao e o `STOREFRONT_CONFIG` em `src/app/core/storefront/storefront-config.ts`.

Ele define:

- identidade da marca
- tema visual
- textos da interface
- canais de contato
- links sociais
- configuracao de navegacao
- faixa e presets de preco do filtro
- referencia para o catalogo da loja

O catalogo entra no storefront por este fluxo:

```text
CATALOG_SEED_DATA
  -> LOCAL_PRODUCT_CATALOG
    -> STOREFRONT_CONFIG.productCatalog
      -> mapCatalogSeedToProducts()
        -> ProductCatalogService
          -> UI
```

## Documentos disponiveis

### [WHITE_LABEL_SETUP.md](WHITE_LABEL_SETUP.md)

Manual operacional completo para subir uma nova loja, cobrindo:

- diagnostico da arquitetura atual
- arquivos reais que precisam ser editados
- classificacao de campos obrigatorios, opcionais e com fallback
- passo a passo de configuracao
- exemplo completo de loja ficticia
- checklist final de publicacao
- riscos, hardcodes e melhorias recomendadas

### [THEME_ENGINE_TUTORIAL.md](THEME_ENGINE_TUTORIAL.md)

Tutorial pratico para usar e evoluir a fundacao do Theme Engine da Phase 4:

- fluxo runtime de tema
- configuracao por loja
- presets e variants
- uso de semantic tokens em SCSS
- como adicionar presets, tokens e variants
- checklist e anti-patterns

### [THEME_ENGINE_CHEAT_SHEET.md](THEME_ENGINE_CHEAT_SHEET.md)

Referencia rapida para consulta no dia a dia:

- presets disponiveis
- variants aceitas
- presets tipograficos aceitos
- CSS variables semanticas
- aliases legados temporarios
- arquivos principais
- comandos de validacao

### [logo-usage.md](logo-usage.md)

Guia de uso dos arquivos de logo e suas variacoes visuais.

### [THEME_ENGINE_PHASE4_QA.md](THEME_ENGINE_PHASE4_QA.md)

Checklist final da Phase 4:

- campos seguros para futuro admin
- matriz visual minima por preset
- rotas de validacao
- sinais de aprovacao do Theme Engine

## Fluxo recomendado para nova loja

1. Adicionar os assets em `public/`
2. Preencher `STOREFRONT_CONFIG`
3. Ajustar `CATALOG_SEED_DATA`
4. Rodar `ng build`
5. Rodar `ng test`
6. Validar no browser com `ng serve`

## Observacoes importantes

- O hero da home usa o primeiro item do catalogo.
- Os filtros de categoria dependem do campo `category` do catalogo.
- A busca textual usa `name`, `description` e `tags`.
- Os presets do filtro usam valores numericos em `catalog.pricePresetMidValue` e `catalog.pricePresetHighValue`, mas os labels continuam em `content.pricePresetMidLabel` e `content.pricePresetHighLabel`.
- Os assets de fonte ainda sao carregados em `src/index.html`; a familia tipografica ativa e controlada por tokens em runtime.

## Leitura sugerida

Se voce precisa operar uma nova loja agora, comece por [WHITE_LABEL_SETUP.md](WHITE_LABEL_SETUP.md).

Se voce precisa configurar ou evoluir temas, comece por [THEME_ENGINE_TUTORIAL.md](THEME_ENGINE_TUTORIAL.md) e use [THEME_ENGINE_CHEAT_SHEET.md](THEME_ENGINE_CHEAT_SHEET.md) como consulta rapida.
