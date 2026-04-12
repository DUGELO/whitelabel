# Manual Operacional do White Label

Documento baseado no codigo real da aplicacao em Abril de 2026.

## 1. Diagnostico

### Estado atual do white label

- A aplicacao e frontend-only. Nao existe backend, API, CMS ou painel administrativo.
- A configuracao principal da loja vive em `src/app/core/storefront/storefront-config.ts`.
- O catalogo da loja vive em `src/app/features/product/catalog-seed-data.ts`.
- Os assets visuais da loja vivem em `public/`.
- O `storefront` e a fonte de verdade da identidade da loja, mas o catalogo em si e mantido em arquivo separado e apenas referenciado pelo `storefront`.

### Fonte de verdade real da loja

Para subir uma nova loja, voce trabalha em 4 pontos reais:

1. `src/app/core/storefront/storefront-config.ts`
2. `src/app/features/product/catalog-seed-data.ts`
3. `src/app/features/product/local-product-catalog.seed.ts`
4. `public/`

Na pratica, o item 3 e so uma ponte:

```ts
export const LOCAL_PRODUCT_CATALOG: CatalogSeedItem[] = CATALOG_SEED_DATA;
```

Ou seja:

```text
CATALOG_SEED_DATA
  -> LOCAL_PRODUCT_CATALOG
    -> STOREFRONT_CONFIG.productCatalog
      -> mapCatalogSeedToProducts()
        -> ProductCatalogService
          -> UI
```

### Onde o storefront e consumido

`StorefrontConfigService` e injetado e consumido diretamente nestes pontos:

- `src/app/app.config.ts`
- `src/app/app.ts`
- `src/app/core/layouts/header/header.ts`
- `src/app/core/layouts/footer/footer.ts`
- `src/app/features/product/product-list/product-list.ts`
- `src/app/features/product/search-results/search-results.ts`
- `src/app/features/product/product-detail/product-detail.ts`
- `src/app/features/product/product-detail/product-not-found/product-not-found.ts`
- `src/app/features/errors/not-found-page/not-found-page.ts`
- `src/app/features/product/product-service.ts`
- `src/app/shared/design-system/components/product-card/product-card.ts`
- `src/app/shared/design-system/components/floating-contact-cta/floating-contact-cta.ts`

### Onde branding, contato, catalogo e identidade visual sao definidos

- Branding textual e visual: `src/app/core/storefront/storefront-config.ts`
- Catalogo: `src/app/features/product/catalog-seed-data.ts`
- Tema visual aplicado em runtime: `src/app/core/storefront/storefront-config.service.ts`
- Inicializacao do branding: `src/app/app.config.ts`
- Fonts globais: `src/index.html` e `src/app/shared/design-system/tokens/_typography.scss`
- Base visual global: `src/styles.scss`

### Outras fontes relevantes alem do storefront

Sim. Alem do `storefront`, existem estas dependencias reais:

- `src/app/features/product/catalog-seed-data.ts`: dados dos produtos
- `public/`: logo, favicon e imagem padrao usada pela loja
- `src/index.html`: titulo inicial, favicon inicial e fonts Google hardcoded
- `src/styles.scss`: tema base do Angular Material ainda hardcoded com cyan/orange + Roboto
- `src/app/shared/design-system/tokens/_typography.scss`: fonts do projeto ainda hardcoded

### Principais acoplamentos e riscos atuais

- O hero da home nao tem configuracao propria. Ele usa sempre o primeiro produto do catalogo.
- `brand.tagline` existe no contrato, mas hoje nao e renderizado em nenhuma tela.
- `content.detailTitle` e `content.detailHighlightsTitle` existem no contrato, mas hoje nao sao usados em runtime.
- `catalog.baseProductUrl` e transformado em `product.actionLinks.productUrl`, mas esse link nao e usado nas telas atuais.
- `socialLinks.facebookUrl` e `socialLinks.youtubeUrl` existem no tipo, mas nao sao renderizados em nenhum componente.
- Fonts e tema base do Angular Material ainda nao sao configurados pelo `storefront`.

## 2. Manual Operacional do White Label

### Visao geral

Para configurar uma nova loja, voce precisa:

1. adicionar os assets da marca em `public/`
2. preencher o `STOREFRONT_CONFIG` em `src/app/core/storefront/storefront-config.ts`
3. montar ou substituir o catalogo em `src/app/features/product/catalog-seed-data.ts`
4. validar build, testes e comportamento visual

Nenhum componente Angular precisa ser alterado para uma troca normal de loja.

### Ordem correta de configuracao

#### Etapa 1 - Assets da marca

Abra `public/` e adicione:

- logo da loja
- favicon da loja
- opcionalmente uma segunda imagem para not found, se nao quiser reaproveitar o logo

Arquivos atuais da pasta:

- `public/favicon.svg`
- `public/recipe-box-logo.svg`

#### Etapa 2 - Configuracao principal da loja

Abra `src/app/core/storefront/storefront-config.ts` e preencha:

- `brand`
- `theme`
- `content`
- `contactChannels`
- `navigationLinks`
- `socialLinks`
- `catalog`
- `primaryContactChannel` se quiser forcar o botao flutuante

#### Etapa 3 - Catalogo

Abra `src/app/features/product/catalog-seed-data.ts` e ajuste os produtos.

#### Etapa 4 - Validacao

Execute:

```bash
ng build
ng test
ng serve
```

### Arquivos que precisam ser editados

| Arquivo | Papel na operacao |
|---|---|
| `src/app/core/storefront/storefront-config.ts` | configuracao central da loja |
| `src/app/features/product/catalog-seed-data.ts` | produtos da loja |
| `public/` | logo, favicon, imagem de apoio |

Arquivos que voce normalmente nao precisa editar, mas precisa entender:

| Arquivo | Papel |
|---|---|
| `src/app/core/storefront/storefront-config.service.ts` | aplica tema, document title e favicon |
| `src/app/app.config.ts` | chama `initializeBranding()` no bootstrap |
| `src/app/features/product/product-catalog.mapper.ts` | mapeia catalogo para `Product` |
| `src/app/features/product/product-service.ts` | gera filtros, busca, ordenacao e categorias |
| `src/app/features/product/product-list/product-list.ts` | define hero e cards da home |

### Campos obrigatorios, opcionais e fallbacks

## `brand`

| Campo | Status | Se vazio |
|---|---|---|
| `name` | obrigatorio | nao quebra, mas header fallback, footer, analytics e document title ficam sem nome util |
| `logoPath` | obrigatorio por tipo, opcional na pratica | header cai para texto; footer e detalhe escondem a imagem |
| `logoAlt` | obrigatorio por tipo | se houver logo e estiver vazio, perde acessibilidade |
| `homeAriaLabel` | obrigatorio | nao quebra runtime, mas prejudica acessibilidade |
| `faviconPath` | obrigatorio | favicon fica incorreto ou vazio |
| `tagline` | obrigatorio por tipo, nao usado hoje | nao afeta runtime atual |
| `description` | obrigatorio por tipo, mas com guarda na UI | footer e bloco de loja no detalhe ficam sem texto |
| `notFoundImagePath` | obrigatorio | telas de not found exibem imagem quebrada se estiver vazio ou invalido |

## `theme`

Todos os campos abaixo sao obrigatorios e devem ser cores validas:

- `primaryColor`
- `primaryColorDark`
- `secondaryColor`
- `accentColor`
- `backgroundColor`
- `surfaceColor`
- `surfaceSoftColor`
- `textMainColor`
- `textMutedColor`
- `borderColor`
- `starColor`

Se vierem vazios ou invalidos, o CSS variable aplicado por `initializeBranding()` fica inconsistente e o visual da loja degrada.

## `content`

Todos sao obrigatorios por tipo. Vazio normalmente nao quebra runtime, mas quebra UX e copy.

### Header e home

- `searchPlaceholder`
- `searchAriaLabel`
- `heroEyebrow`
- `heroCtaLabel`
- `popularSectionTitle`
- `emptyCatalogTitle`
- `emptyCatalogDescription`
- `searchButtonLabel`
- `productAriaPrefix`

### Produto e loja

- `detailTitle` (nao usado hoje)
- `detailHighlightsTitle` (nao usado hoje)
- `relatedSectionTitle`
- `primaryCtaLabel`
- `secondaryCtaLabel`
- `storeInfoSectionTitle`

### Footer

- `footerShortcutsTitle`
- `footerSupportTitle`
- `footerCopyrightText`

### Busca e filtros

- `filtersTitle`
- `filtersResetLabel`
- `filterSearchPlaceholder`
- `priceRangeTitle`
- `priceRangeAriaLabel`
- `priceRangeCurrentPrefix`
- `pricePresetAllLabel`
- `pricePresetMidLabel`
- `pricePresetHighLabel`
- `categoriesTitle`
- `sortByLabel`
- `resultsCountSuffix`
- `sortPopularLabel`
- `sortLowestPriceLabel`
- `sortHighestRatedLabel`
- `mobileFilterButtonLabel`
- `mobileFilterApplyLabel`

### Paginas de erro e not found

- `notFoundTitle`
- `notFoundDescription`
- `notFoundBrowseLabel`
- `pageNotFoundEyebrow`
- `backToHomeLabel`
- `productNotFoundEyebrow`

## `contactChannels`

| Campo | Status | Se vazio |
|---|---|---|
| array `contactChannels` | obrigatorio por tipo, pode ser vazio | footer perde bloco de atendimento; floating CTA pode sumir |
| `type` | obrigatorio | se incorreto, floating CTA nao encontra o canal |
| `label` | obrigatorio | link fica sem copy util |
| `url` | obrigatorio | link quebra ou nao abre corretamente |

## `socialLinks`

| Campo | Status | Se vazio |
|---|---|---|
| `instagramUrl` | obrigatorio por tipo, opcional na pratica | CTA secundario some do detalhe; icone some do footer |
| `whatsappUrl` | obrigatorio por tipo, opcional na pratica | CTA primario some do detalhe; floating CTA tenta Instagram |
| `facebookUrl` | opcional | nao faz diferenca hoje |
| `youtubeUrl` | opcional | nao faz diferenca hoje |

## `navigationLinks`

| Campo | Status | Se vazio |
|---|---|---|
| array `navigationLinks` | obrigatorio por tipo, pode ser vazio | footer perde atalhos |

## `catalog`

| Campo | Status | Se vazio ou inconsistente |
|---|---|---|
| `currencyCode` | obrigatorio | preco formatado incorretamente |
| `baseProductUrl` | obrigatorio por tipo, baixo impacto hoje | so alimenta `productUrl`, que nao e usado nas telas atuais |
| `defaultWhatsAppMessage` | obrigatorio | CTA do WhatsApp abre sem texto util |
| `priceRangeMin` | obrigatorio | slider de preco e reset de filtros ficam incoerentes |
| `priceRangeMax` | obrigatorio | slider limita a busca a um teto incorreto |
| `pricePresetMidValue` | obrigatorio | preset medio do filtro quebra se nao combinar com o label |
| `pricePresetHighValue` | obrigatorio | preset alto do filtro quebra se nao combinar com o label |

## `primaryContactChannel`

| Campo | Status | Se vazio |
|---|---|---|
| `primaryContactChannel` | opcional | fallback automatico: WhatsApp -> Instagram -> nenhum |

## `CatalogSeedItem`

Cada produto em `src/app/features/product/catalog-seed-data.ts` segue este contrato:

```ts
export interface CatalogSeedItem {
  id: number;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  imgUrl: string;
  imageAlt?: string;
  price: number;
  compareAtPrice?: number;
  category?: string;
  tags?: string[];
  rating: number;
  reviewCount: number;
  highlights?: string[];
}
```

### Classificacao dos campos do catalogo

| Campo | Status | Efeito real |
|---|---|---|
| `id` | obrigatorio | usado em rota, tracking e renderizacao |
| `slug` | obrigatorio | usado em URLs e integridade do dataset |
| `name` | obrigatorio | titulo do produto |
| `description` | obrigatorio | copy curta do card e da home |
| `longDescription` | opcional com fallback | se faltar, mapper usa `description` |
| `imgUrl` | obrigatorio e perigoso se vazio | card, hero e detalhe exibem imagem quebrada |
| `imageAlt` | opcional com fallback | mapper usa `name` |
| `price` | obrigatorio | filtro, ordenacao e exibicao de preco |
| `compareAtPrice` | opcional | exibe preco riscado no card |
| `category` | opcional | alimenta filtros de categoria e fallback de highlights |
| `tags` | opcional | melhora busca textual; nao gera UI propria |
| `rating` | obrigatorio | estrelas e ordenacao |
| `reviewCount` | obrigatorio | ordenacao e prova social |
| `highlights` | opcional com fallback | se faltar, mapper usa `[category]` quando existir |

### Dependencias indiretas do catalogo

- O primeiro item do array vira o hero da home.
- Os proximos itens alimentam quick picks e grade principal da home.
- `category` gera os chips de filtro em `search-results`.
- `tags` participam da busca textual em `product-service`.
- `compareAtPrice` precisa ser maior que `price`.
- A faixa `catalog.priceRangeMin/Max` precisa cobrir o menor e o maior preco reais do catalogo.

### Cuidados por tela e componente

#### Header

- Se `brand.logoPath` vier vazio, o header cai para `brand.name`.
- Busca usa `content.searchPlaceholder`, `content.searchAriaLabel` e `content.searchButtonLabel`.

#### Footer

- `brand.description` e opcional na pratica: se vazio, o footer omite o texto.
- `navigationLinks` vazio remove atalhos.
- `contactChannels` vazio remove atendimento.
- `socialLinks.instagramUrl` e `socialLinks.whatsappUrl` controlam os icones.

#### Home

- Nao existe banner independente.
- O hero usa o primeiro produto do catalogo.
- Para trocar o destaque principal da home, troque a ordem do array em `catalog-seed-data.ts`.
- `content.heroEyebrow` e `content.heroCtaLabel` so controlam o texto do hero.

#### Busca

- O slider usa `catalog.priceRangeMin` e `catalog.priceRangeMax`.
- Os presets usam `catalog.pricePresetMidValue` e `catalog.pricePresetHighValue`, mas o texto dos botoes continua em `content.pricePresetMidLabel` e `content.pricePresetHighLabel`.
- Se voce mudar o valor numerico, atualize o label textual junto.

#### Detalhe do produto

- CTA primario aparece apenas se `socialLinks.whatsappUrl` existir.
- CTA secundario aparece apenas se `socialLinks.instagramUrl` existir.
- `brand.description` e opcional na pratica: se vazio, o detalhe omite esse texto.
- `brand.logoPath` e opcional na pratica: se vazio, o bloco de loja oculta o logo.

#### Produto nao encontrado e pagina 404

- `brand.notFoundImagePath` nao tem guarda na view. Se estiver vazio, a imagem quebra.

### Como validar antes de publicar

Execute:

```bash
ng build
ng test
ng serve
```

Depois valide visualmente:

1. home com hero correto
2. footer com nome, descricao e contatos corretos
3. busca com slider coerente com os precos reais
4. categorias aparecendo corretamente
5. CTA de WhatsApp abrindo com mensagem correta
6. CTA de Instagram abrindo o perfil correto
7. botao flutuante correto
8. pagina de produto inexistente sem imagem quebrada
9. responsivo em mobile

## 3. Exemplo de Configuracao de Nova Loja

### Loja ficticia: Noite Secreta Boutique

### Etapa 1 - Assets

Adicionar em `public/`:

- `noite-secreta-logo.svg`
- `noite-secreta-favicon.svg`

### Etapa 2 - storefront-config.ts

Preencha assim em `src/app/core/storefront/storefront-config.ts`:

```ts
brand: {
  name: 'Noite Secreta Boutique',
  logoPath: 'noite-secreta-logo.svg',
  logoAlt: 'Noite Secreta Boutique',
  homeAriaLabel: 'Noite Secreta Boutique home',
  faviconPath: 'noite-secreta-favicon.svg',
  tagline: 'Prazer com discricao e curadoria',
  description: 'Boutique de bem-estar intimo com entrega discreta e atendimento consultivo.',
  notFoundImagePath: 'noite-secreta-logo.svg',
},
theme: {
  primaryColor: '#8b1e54',
  primaryColorDark: '#6a1640',
  secondaryColor: '#d195b1',
  accentColor: '#f3c3d6',
  backgroundColor: '#faf5f8',
  surfaceColor: '#ffffff',
  surfaceSoftColor: '#f7eef3',
  textMainColor: '#271822',
  textMutedColor: '#6e5964',
  borderColor: '#ead9e1',
  starColor: '#c98aa7',
},
content: {
  searchPlaceholder: 'Buscar produtos, kits e acessorios...',
  searchAriaLabel: 'Buscar produtos',
  heroEyebrow: 'Curadoria da semana',
  heroCtaLabel: 'Ver produto',
  popularSectionTitle: 'Mais procurados',
  emptyCatalogTitle: 'Nenhum produto encontrado',
  emptyCatalogDescription: 'Ajuste sua busca para encontrar outros itens da vitrine.',
  detailTitle: 'Sobre este produto',
  detailHighlightsTitle: 'Destaques',
  relatedSectionTitle: 'Voce tambem pode gostar',
  primaryCtaLabel: 'Comprar no WhatsApp',
  secondaryCtaLabel: 'Ver no Instagram',
  storeInfoSectionTitle: 'Sobre a loja',
  footerShortcutsTitle: 'Atalhos',
  footerSupportTitle: 'Atendimento',
  footerCopyrightText: 'Todos os direitos reservados.',
  searchButtonLabel: 'Buscar',
  notFoundTitle: 'Este produto nao esta disponivel na vitrine.',
  notFoundDescription: 'O item que voce tentou acessar nao foi encontrado.',
  notFoundBrowseLabel: 'Explorar produtos',
  filtersTitle: 'Filtros',
  filtersResetLabel: 'Limpar',
  filterSearchPlaceholder: 'Buscar nos resultados...',
  priceRangeTitle: 'Faixa de preco',
  priceRangeAriaLabel: 'Preco minimo',
  priceRangeCurrentPrefix: 'A partir de',
  pricePresetAllLabel: 'Todos',
  pricePresetMidLabel: 'Acima de R$ 120',
  pricePresetHighLabel: 'Acima de R$ 220',
  categoriesTitle: 'Categorias',
  sortByLabel: 'Ordenar por:',
  resultsCountSuffix: 'produtos',
  sortPopularLabel: 'Mais populares',
  sortLowestPriceLabel: 'Menor preco',
  sortHighestRatedLabel: 'Mais bem avaliados',
  mobileFilterButtonLabel: 'Filtrar',
  mobileFilterApplyLabel: 'Aplicar',
  pageNotFoundEyebrow: 'Pagina nao encontrada',
  backToHomeLabel: 'Voltar ao inicio',
  productNotFoundEyebrow: 'Produto nao encontrado',
  productAriaPrefix: 'Abrir',
},
contactChannels: [
  { type: 'whatsapp', label: 'Atendimento no WhatsApp', url: 'https://wa.me/5511999991111' },
  { type: 'instagram', label: 'Instagram da loja', url: 'https://instagram.com/noitesecreta' },
],
navigationLinks: [
  { label: 'Inicio', route: '/' },
  { label: 'Buscar', route: '/search' },
],
socialLinks: {
  instagramUrl: 'https://instagram.com/noitesecreta',
  whatsappUrl: 'https://wa.me/5511999991111',
},
catalog: {
  currencyCode: 'BRL',
  baseProductUrl: 'https://noitesecreta.com/produtos',
  defaultWhatsAppMessage: 'Ola! Tenho interesse neste produto:',
  priceRangeMin: 0,
  priceRangeMax: 320,
  pricePresetMidValue: 120,
  pricePresetHighValue: 220,
},
primaryContactChannel: 'whatsapp',
```

### Etapa 3 - catalog-seed-data.ts

Monte os produtos em `src/app/features/product/catalog-seed-data.ts`.

O primeiro item vira o hero da home, entao coloque o produto mais importante primeiro:

```ts
export const CATALOG_SEED_DATA: CatalogSeedItem[] = [
  {
    id: 1,
    slug: 'vibrador-sereia-premium',
    name: 'Vibrador Sereia Premium',
    description: 'Silicone ultra macio com 10 modos de vibracao e acabamento premium.',
    longDescription: 'Produto resistente a agua, recarregavel por USB e com toque aveludado.',
    imgUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Vibrador premium em embalagem elegante',
    price: 219.9,
    compareAtPrice: 259.9,
    category: 'Vibradores',
    tags: ['premium', 'silicone', 'recarregavel'],
    rating: 4.9,
    reviewCount: 184,
    highlights: ['Silicone premium', 'USB recarregavel', 'Resistente a agua'],
  },
  {
    id: 2,
    slug: 'gel-massagem-cereja',
    name: 'Gel de Massagem Cereja',
    description: 'Gel sensorial com aroma adocicado e textura deslizante.',
    imgUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Gel sensorial em frasco vermelho',
    price: 49.9,
    category: 'Cosmeticos',
    tags: ['gel', 'massagem', 'sensorial'],
    rating: 4.6,
    reviewCount: 92,
    highlights: ['Aroma marcante', 'Textura leve'],
  },
];
```

## 4. Checklist Final de Publicacao

- [ ] `brand.name` correto
- [ ] `logoPath` aponta para arquivo existente em `public/`
- [ ] `faviconPath` aponta para arquivo existente em `public/`
- [ ] `notFoundImagePath` aponta para arquivo valido
- [ ] `theme` inteiro preenchido com cores validas
- [ ] `socialLinks.whatsappUrl` valido
- [ ] `socialLinks.instagramUrl` valido ou conscientemente vazio
- [ ] `contactChannels` consistente com os links sociais
- [ ] `catalog.priceRangeMin/Max` cobrem o menor e maior preco do dataset
- [ ] `catalog.pricePresetMidValue` bate com `content.pricePresetMidLabel`
- [ ] `catalog.pricePresetHighValue` bate com `content.pricePresetHighLabel`
- [ ] primeiro item do catalogo e o produto que deve ir para o hero
- [ ] `slug` unico e em kebab-case para todos os itens
- [ ] `price` preenchido para todos os itens
- [ ] `compareAtPrice`, quando existir, e maior que `price`
- [ ] `imgUrl` de todos os produtos responde corretamente
- [ ] `rating` entre 1 e 5
- [ ] `reviewCount` maior que zero
- [ ] `ng build` sem erro
- [ ] `ng test` verde
- [ ] home correta em desktop e mobile
- [ ] busca correta em desktop e mobile
- [ ] detalhe correto em desktop e mobile
- [ ] CTA de WhatsApp abre com mensagem padrao correta
- [ ] CTA de Instagram abre perfil correto
- [ ] floating CTA aponta para o canal correto

## 5. Riscos e Atencoes

### Hardcodes ainda existentes

- `src/index.html`
  - titulo inicial `Catalog Flow`
  - favicon inicial `favicon.svg`
  - fonts Google hardcoded
- `src/styles.scss`
  - tema base do Angular Material ainda usa cyan/orange e `Roboto`
- `src/app/shared/design-system/tokens/_typography.scss`
  - fonts `Plus Jakarta Sans` e `DM Serif Display` hardcoded
- `public/recipe-box-logo.svg`
  - nome legado do asset padrao

### Dependencias escondidas

- O hero da home depende da ordem do array de `CATALOG_SEED_DATA`.
- Os chips de categoria dependem de `category` no catalogo.
- A busca textual usa `name`, `description` e `tags`.
- `highlights` so aparecem se voce preencher `highlights` ou ao menos `category`.
- `baseProductUrl` nao aparece na UI atual, mesmo existindo no `storefront`.

### Campos que parecem opcionais, mas exigem cuidado

- `logoPath`: pode ficar vazio, mas a marca perde logo em quase toda a UI.
- `description`: pode ficar vazia, mas o footer e o detalhe da loja ficam pobres.
- `instagramUrl` e `whatsappUrl`: podem ficar vazios, mas isso corta canais comerciais.
- `imgUrl`: tecnicamente string, mas se vier quebrada o produto fica com imagem ruim em hero, card e detalhe.
- `pricePresetMidLabel` e `pricePresetHighLabel`: se nao acompanharem os valores numericos do `catalog`, o filtro fica incoerente para o usuario.

## 6. Melhorias Recomendadas

### O que ja existe no projeto

- `storefront` centraliza branding, copy, contatos, navegacao e faixa de preco
- `catalog-seed-data.ts` centraliza o catalogo
- `initializeBranding()` aplica tema e favicon automaticamente
- o contrato do catalogo ja foi simplificado para um modelo realmente util de vitrine

### O que eu recomendo melhorar depois

1. Gerar automaticamente `pricePresetMidLabel` e `pricePresetHighLabel` a partir dos valores numericos do `catalog`
2. Mover fonts para configuracao de white label em vez de mantelas hardcoded
3. Remover do contrato os campos nao usados hoje: `brand.tagline`, `content.detailTitle`, `content.detailHighlightsTitle`, `catalog.baseProductUrl` ou passar a usa-los de fato
4. Criar um schema de validacao do `STOREFRONT_CONFIG` para detectar erro de configuracao antes do build
5. Criar uma pasta por tenant com assets e config separados, caso o numero de lojas cresca
