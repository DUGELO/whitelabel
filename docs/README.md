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

### [logo-usage.md](logo-usage.md)

Guia de uso dos arquivos de logo e suas variacoes visuais.

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
- Fonts e tema base do Angular Material ainda nao sao controlados pelo `storefront`.

## Leitura sugerida

Se voce precisa operar uma nova loja agora, comece por [WHITE_LABEL_SETUP.md](WHITE_LABEL_SETUP.md).