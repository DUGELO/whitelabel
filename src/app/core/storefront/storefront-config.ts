import { StorefrontThemeConfig } from '../theme/models/theme-config.types';

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
  tenantId: string;
  brand: StorefrontBrandingConfig;
  theme: StorefrontThemeConfig;
  content: StorefrontContentConfig;
  contactChannels: ContactChannel[];
  navigationLinks: StorefrontNavigationLink[];
  socialLinks: StorefrontSocialLinksConfig;
  catalog: StorefrontCatalogConfig;
  primaryContactChannel?: 'whatsapp' | 'instagram';
}

export const STOREFRONT_CONFIG: StorefrontConfig = {
  tenantId: 'whitelabel',
  brand: {
    name: 'Atelier Aurea',
    logoPath: 'atelier-aurea-logo.svg',
    logoAlt: 'Atelier Aurea',
    homeAriaLabel: 'Atelier Aurea home',
    faviconPath: 'atelier-aurea-favicon.svg',
    tagline: 'Joias autorais para momentos que merecem permanecer',
    description:
      'Joalheria de curadoria premium com aneis, aliancas, colares e presentes em ouro 18k, prata 925 e pedras selecionadas.',
    notFoundImagePath: 'atelier-aurea-logo.svg',
  },
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
      productGrid: 'editorial-grid',
      cta: 'solid-premium',
    },
  },
  content: {
    searchPlaceholder: 'Buscar produtos, colecoes e presentes...',
    searchAriaLabel: 'Buscar produtos',
    heroEyebrow: 'Destaque da vitrine',
    heroCtaLabel: 'Ver produto',
    popularSectionTitle: 'Produtos em destaque',
    emptyCatalogTitle: 'Nenhum produto encontrado',
    emptyCatalogDescription: 'Ajuste sua busca para encontrar outros itens da loja.',
    detailTitle: 'Sobre este produto',
    detailHighlightsTitle: 'Destaques',
    relatedSectionTitle: 'Outros produtos da loja',
    primaryCtaLabel: 'Comprar no WhatsApp',
    secondaryCtaLabel: 'Ver no Instagram',
    storeInfoSectionTitle: 'Sobre a loja',
    footerShortcutsTitle: 'Atalhos',
    footerSupportTitle: 'Atendimento',
    footerCopyrightText: 'Todos os direitos reservados.',
    searchButtonLabel: 'Buscar',
    notFoundTitle: 'Este produto nao esta disponivel na vitrine.',
    notFoundDescription:
      'O item que voce tentou acessar nao foi encontrado. Volte para a vitrine e descubra outros produtos.',
    notFoundBrowseLabel: 'Explorar produtos',
    filtersTitle: 'Filtros',
    filtersResetLabel: 'Limpar',
    filterSearchPlaceholder: 'Buscar por nome, categoria ou detalhe...',
    priceRangeTitle: 'Faixa de preco',
    priceRangeAriaLabel: 'Preco minimo',
    priceRangeCurrentPrefix: 'A partir de',
    pricePresetAllLabel: 'Todos',
    pricePresetMidLabel: 'Acima de R$ 2.500',
    pricePresetHighLabel: 'Acima de R$ 5.000',
    categoriesTitle: 'Categorias',
    sortByLabel: 'Ordenar por:',
    resultsCountSuffix: 'produtos',
    sortPopularLabel: 'Mais desejadas',
    sortLowestPriceLabel: 'Menor preco',
    sortHighestRatedLabel: 'Melhor avaliados',
    mobileFilterButtonLabel: 'Filtrar',
    mobileFilterApplyLabel: 'Aplicar',
    pageNotFoundEyebrow: 'Pagina nao encontrada',
    backToHomeLabel: 'Voltar ao inicio',
    productNotFoundEyebrow: 'Produto nao encontrado',
    productAriaPrefix: 'Abrir',
  },
  contactChannels: [
    {
      type: 'whatsapp',
      label: 'Atendimento no WhatsApp',
      url: 'https://wa.me/5598984655819',
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
    whatsappUrl: 'https://wa.me/5598984655819',
  },
  catalog: {
    currencyCode: 'BRL',
    baseProductUrl: 'https://atelieraurea.com/joias',
    defaultWhatsAppMessage: 'Ola! Tenho interesse neste produto:',
    priceRangeMin: 0,
    priceRangeMax: 7000,
    pricePresetMidValue: 2500,
    pricePresetHighValue: 5000,
  },
  primaryContactChannel: 'whatsapp',
};
