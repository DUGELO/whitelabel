import { CatalogSeedItem } from '../../features/product/catalog-seed-item.model';
import { LOCAL_PRODUCT_CATALOG } from '../../features/product/local-product-catalog.seed';

export interface StorefrontBrandingConfig {
  name: string;
  logoPath: string;
  logoAlt: string;
  homeAriaLabel: string;
  faviconPath: string;
  tagline: string;
  description: string;
  notFoundImagePath: string;
}

export interface BrandThemeTokens {
  primaryColor: string;
  primaryColorDark: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  surfaceSoftColor: string;
  textMainColor: string;
  textMutedColor: string;
  borderColor: string;
  starColor: string;
}

export interface ContactChannel {
  type: 'whatsapp' | 'instagram' | 'support';
  label: string;
  url: string;
}

export interface StorefrontContentConfig {
  searchPlaceholder: string;
  searchAriaLabel: string;
  heroEyebrow: string;
  heroCtaLabel: string;
  popularSectionTitle: string;
  emptyCatalogTitle: string;
  emptyCatalogDescription: string;
  detailTitle: string;
  detailHighlightsTitle: string;
  relatedSectionTitle: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  storeInfoSectionTitle: string;
  footerShortcutsTitle: string;
  footerSupportTitle: string;
  footerCopyrightText: string;
  searchButtonLabel: string;
  notFoundTitle: string;
  notFoundDescription: string;
  notFoundBrowseLabel: string;
  filtersTitle: string;
  filtersResetLabel: string;
  filterSearchPlaceholder: string;
  priceRangeTitle: string;
  priceRangeAriaLabel: string;
  priceRangeCurrentPrefix: string;
  pricePresetAllLabel: string;
  pricePresetMidLabel: string;
  pricePresetHighLabel: string;
  categoriesTitle: string;
  sortByLabel: string;
  resultsCountSuffix: string;
  sortPopularLabel: string;
  sortLowestPriceLabel: string;
  sortHighestRatedLabel: string;
  mobileFilterButtonLabel: string;
  mobileFilterApplyLabel: string;
  pageNotFoundEyebrow: string;
  backToHomeLabel: string;
  productNotFoundEyebrow: string;
  productAriaPrefix: string;
}

export interface StorefrontNavigationLink {
  label: string;
  route: string;
}

export interface StorefrontSocialLinksConfig {
  instagramUrl: string;
  whatsappUrl: string;
  facebookUrl?: string;
  youtubeUrl?: string;
}

export interface StorefrontCatalogConfig {
  currencyCode: string;
  baseProductUrl: string;
  defaultWhatsAppMessage: string;
  priceRangeMin: number;
  priceRangeMax: number;
  pricePresetMidValue: number;
  pricePresetHighValue: number;
}

export interface StorefrontConfig {
  brand: StorefrontBrandingConfig;
  theme: BrandThemeTokens;
  content: StorefrontContentConfig;
  productCatalog: CatalogSeedItem[];
  contactChannels: ContactChannel[];
  navigationLinks: StorefrontNavigationLink[];
  socialLinks: StorefrontSocialLinksConfig;
  catalog: StorefrontCatalogConfig;
  primaryContactChannel?: 'whatsapp' | 'instagram';
}

export const STOREFRONT_CONFIG: StorefrontConfig = {
  brand: {
    name: 'Catalog Flow',
    logoPath: 'recipe-box-logo.svg',
    logoAlt: 'Catalog Flow',
    homeAriaLabel: 'Catalog Flow home',
    faviconPath: 'favicon.ico',
    tagline: 'Catalogo leve para vender rapido',
    description: 'Exiba seus produtos com uma vitrine pronta para Instagram e WhatsApp, com configuracao simples e baixo custo operacional.',
    notFoundImagePath: 'recipe-box-logo.svg',
  },
  theme: {
    primaryColor: '#d95b43',
    primaryColorDark: '#b84a36',
    secondaryColor: '#2f7d5a',
    accentColor: '#f4bb46',
    backgroundColor: '#f6efe8',
    surfaceColor: '#ffffff',
    surfaceSoftColor: '#f8f4ef',
    textMainColor: '#231a16',
    textMutedColor: '#665e59',
    borderColor: '#e7ddd4',
    starColor: '#f4bb46',
  },
  content: {
    searchPlaceholder: 'Buscar produtos, categorias e destaques...',
    searchAriaLabel: 'Buscar produtos',
    heroEyebrow: 'Produto em destaque',
    heroCtaLabel: 'Ver produto',
    popularSectionTitle: 'Produtos em alta',
    emptyCatalogTitle: 'Nenhum produto encontrado',
    emptyCatalogDescription: 'Ajuste sua busca para encontrar outros itens do catalogo.',
    detailTitle: 'Sobre este produto',
    detailHighlightsTitle: 'Destaques',
    relatedSectionTitle: 'Produtos relacionados',
    primaryCtaLabel: 'Comprar no WhatsApp',
    secondaryCtaLabel: 'Ver no Instagram',
    storeInfoSectionTitle: 'Informações da Loja',
    footerShortcutsTitle: 'Atalhos',
    footerSupportTitle: 'Atendimento',
    footerCopyrightText: 'Todos os direitos reservados.',
    searchButtonLabel: 'Buscar',
    notFoundTitle: 'Este produto nao esta mais disponivel na vitrine.',
    notFoundDescription: 'O item que voce tentou acessar nao foi encontrado. Volte para a vitrine e continue navegando pelo catalogo.',
    notFoundBrowseLabel: 'Explorar produtos',
    filtersTitle: 'Filtros',
    filtersResetLabel: 'Limpar',
    filterSearchPlaceholder: 'Buscar nos resultados...',
    priceRangeTitle: 'Faixa de preco',
    priceRangeAriaLabel: 'Preco minimo',
    priceRangeCurrentPrefix: 'A partir de',
    pricePresetAllLabel: 'Todos',
    pricePresetMidLabel: 'Acima de R$ 80',
    pricePresetHighLabel: 'Acima de R$ 110',
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
  productCatalog: LOCAL_PRODUCT_CATALOG,
  contactChannels: [
    {
      type: 'whatsapp',
      label: 'Atendimento no WhatsApp',
      url: 'https://wa.me/5511999999999?text=Quero%20mais%20informacoes%20sobre%20os%20produtos',
    },
    {
      type: 'instagram',
      label: 'Instagram da loja',
      url: 'https://instagram.com/catalogflow',
    },
  ],
  navigationLinks: [
    { label: 'Inicio', route: '/' },
    { label: 'Buscar', route: '/search' },
  ],
  socialLinks: {
    instagramUrl: 'https://instagram.com/catalogflow',
    whatsappUrl: 'https://wa.me/5511999999999?text=Quero%20mais%20informacoes%20sobre%20os%20produtos',
  },
  catalog: {
    currencyCode: 'BRL',
    baseProductUrl: 'https://catalogflow.store/products',
    defaultWhatsAppMessage: 'Ola! Tenho interesse neste produto:',
    priceRangeMin: 0,
    priceRangeMax: 140,
    pricePresetMidValue: 80,
    pricePresetHighValue: 110,
  },
};