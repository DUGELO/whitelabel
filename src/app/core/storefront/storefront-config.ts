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
    name: 'Atelier Aurea',
    logoPath: 'atelier-aurea-logo.svg',
    logoAlt: 'Atelier Aurea',
    homeAriaLabel: 'Atelier Aurea home',
    faviconPath: 'atelier-aurea-favicon.svg',
    tagline: 'Joias autorais para momentos que merecem permanecer',
    description: 'Joalheria de curadoria premium com aneis, aliancas, colares e presentes em ouro 18k, prata 925 e pedras selecionadas.',
    notFoundImagePath: 'atelier-aurea-logo.svg',
  },
  theme: {
    primaryColor: '#8a6a2d',
    primaryColorDark: '#5f4617',
    secondaryColor: '#b99668',
    accentColor: '#e5d3b1',
    backgroundColor: '#f7f2e9',
    surfaceColor: '#fffdf9',
    surfaceSoftColor: '#f1e7d8',
    textMainColor: '#241b12',
    textMutedColor: '#6b6157',
    borderColor: '#dacbb3',
    starColor: '#c89a3c',
  },
  content: {
    searchPlaceholder: 'Buscar aneis, colares, pulseiras e presentes...',
    searchAriaLabel: 'Buscar joias',
    heroEyebrow: 'Colecao Lumiere',
    heroCtaLabel: 'Ver joia',
    popularSectionTitle: 'Joias mais desejadas',
    emptyCatalogTitle: 'Nenhuma joia encontrada',
    emptyCatalogDescription: 'Ajuste sua busca para encontrar outras pecas da curadoria.',
    detailTitle: 'Sobre esta joia',
    detailHighlightsTitle: 'Destaques',
    relatedSectionTitle: 'Outras joias da curadoria',
    primaryCtaLabel: 'Comprar no WhatsApp',
    secondaryCtaLabel: 'Ver no Instagram',
    storeInfoSectionTitle: 'Sobre o atelier',
    footerShortcutsTitle: 'Atalhos',
    footerSupportTitle: 'Atendimento',
    footerCopyrightText: 'Todos os direitos reservados.',
    searchButtonLabel: 'Buscar',
    notFoundTitle: 'Esta joia nao esta disponivel na vitrine.',
    notFoundDescription: 'A peca que voce tentou acessar nao foi encontrada. Volte para a curadoria e descubra outras joias.',
    notFoundBrowseLabel: 'Explorar joias',
    filtersTitle: 'Filtros',
    filtersResetLabel: 'Limpar',
    filterSearchPlaceholder: 'Buscar por nome, colecao ou material...',
    priceRangeTitle: 'Faixa de preco',
    priceRangeAriaLabel: 'Preco minimo',
    priceRangeCurrentPrefix: 'A partir de',
    pricePresetAllLabel: 'Todos',
    pricePresetMidLabel: 'Acima de R$ 2.500',
    pricePresetHighLabel: 'Acima de R$ 5.000',
    categoriesTitle: 'Categorias',
    sortByLabel: 'Ordenar por:',
    resultsCountSuffix: 'joias',
    sortPopularLabel: 'Mais desejadas',
    sortLowestPriceLabel: 'Menor preco',
    sortHighestRatedLabel: 'Melhor avaliadas',
    mobileFilterButtonLabel: 'Filtrar',
    mobileFilterApplyLabel: 'Aplicar',
    pageNotFoundEyebrow: 'Pagina nao encontrada',
    backToHomeLabel: 'Voltar ao inicio',
    productNotFoundEyebrow: 'Joia nao encontrada',
    productAriaPrefix: 'Abrir',
  },
  productCatalog: LOCAL_PRODUCT_CATALOG,
  contactChannels: [
    {
      type: 'whatsapp',
      label: 'Atendimento no WhatsApp',
      url: 'https://wa.me/5511988001122',
    },
    {
      type: 'instagram',
      label: 'Instagram do atelier',
      url: 'https://instagram.com/atelieraurea',
    },
    {
      type: 'support',
      label: 'Concierge por e-mail',
      url: 'mailto:concierge@atelieraurea.com',
    },
  ],
  navigationLinks: [
    { label: 'Inicio', route: '/' },
    { label: 'Buscar', route: '/search' },
  ],
  socialLinks: {
    instagramUrl: 'https://instagram.com/atelieraurea',
    whatsappUrl: 'https://wa.me/5511988001122',
  },
  catalog: {
    currencyCode: 'BRL',
    baseProductUrl: 'https://atelieraurea.com/joias',
    defaultWhatsAppMessage: 'Ola! Tenho interesse nesta joia:',
    priceRangeMin: 0,
    priceRangeMax: 7000,
    pricePresetMidValue: 2500,
    pricePresetHighValue: 5000,
  },
  primaryContactChannel: 'whatsapp',
};
