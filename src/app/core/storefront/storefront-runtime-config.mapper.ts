import {
  ContactChannel,
  STOREFRONT_CONFIG,
  StorefrontCatalogConfig,
  StorefrontConfig,
  StorefrontContentConfig,
  StorefrontNavigationLink,
  StorefrontSocialLinksConfig,
} from './storefront-config';
import { StorefrontThemeConfig } from '../theme/models/theme-config.types';
import {
  CtaVariantId,
  HeroVariantId,
  ProductCardVariantId,
  ProductGridVariantId,
  ThemePresetId,
} from '../theme/models/theme-preset.types';

export interface StorefrontRuntimeTenantDocument {
  name?: unknown;
  slug?: unknown;
  status?: unknown;
  primaryColor?: unknown;
  secondaryColor?: unknown;
  instagram?: unknown;
  whatsapp?: unknown;
}

export interface StorefrontRuntimeSettingsDocument {
  brand?: Record<string, unknown>;
  theme?: Record<string, unknown>;
  content?: Partial<Record<keyof StorefrontContentConfig, unknown>>;
  contactChannels?: unknown;
  navigationLinks?: unknown;
  socialLinks?: Partial<Record<keyof StorefrontSocialLinksConfig, unknown>>;
  catalog?: Partial<Record<keyof StorefrontCatalogConfig, unknown>>;
  primaryContactChannel?: unknown;
}

export interface MapRuntimeStorefrontConfigInput {
  tenantId: string;
  tenant?: StorefrontRuntimeTenantDocument | null;
  settings?: StorefrontRuntimeSettingsDocument | null;
  fallback?: StorefrontConfig;
}

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;
const THEME_PRESET_IDS = [
  'editorial-luxury',
  'minimal-premium',
  'soft-fashion',
  'dark-elegance',
  'modern-boutique',
] as const;
const TYPOGRAPHY_PRESET_IDS = [
  'editorial-serif',
  'modern-sans',
  'soft-serif',
  'cinematic-serif',
] as const;
const HERO_VARIANT_IDS = ['immersive', 'split-editorial', 'minimal-focus'] as const;
const PRODUCT_CARD_VARIANT_IDS = [
  'editorial-minimal',
  'quiet-luxury',
  'soft-fashion-card',
  'dark-elegance-card',
  'boutique-clean',
] as const;
const PRODUCT_GRID_VARIANT_IDS = ['editorial-grid', 'minimal-grid', 'boutique-grid'] as const;
const CTA_VARIANT_IDS = ['solid-premium', 'soft-outline', 'quiet-link'] as const;

export function mapRuntimeStorefrontConfig({
  tenantId,
  tenant = null,
  settings = null,
  fallback = STOREFRONT_CONFIG,
}: MapRuntimeStorefrontConfigInput): StorefrontConfig {
  const resolvedTenantId = tenantId || fallback.tenantId;
  const canUseLocalTenantFallback = resolvedTenantId === fallback.tenantId;
  const socialLinks = mapSocialLinks(
    settings,
    tenant,
    fallback.socialLinks,
    canUseLocalTenantFallback,
  );
  const contactChannels = mapContactChannels(
    settings,
    socialLinks,
    fallback.contactChannels,
    canUseLocalTenantFallback,
  );
  const brandName = readNonEmptyString(settings?.brand?.['name'])
    ?? readNonEmptyString(tenant?.name)
    ?? (canUseLocalTenantFallback ? fallback.brand.name : 'Loja');
  const brandFallback = canUseLocalTenantFallback
    ? fallback.brand
    : createTenantSafeBrandFallback(brandName);

  return {
    ...fallback,
    tenantId: resolvedTenantId,
    brand: {
      ...brandFallback,
      ...pickStringFields(settings?.brand, [
        'logoPath',
        'logoAlt',
        'homeAriaLabel',
        'faviconPath',
        'tagline',
        'description',
        'notFoundImagePath',
      ]),
      name: brandName,
    },
    theme: mapTheme(settings, tenant, fallback.theme, canUseLocalTenantFallback),
    content: {
      ...fallback.content,
      ...pickStringFields(settings?.content, Object.keys(fallback.content)),
    },
    contactChannels,
    navigationLinks: mapNavigationLinks(settings?.navigationLinks, fallback.navigationLinks),
    socialLinks,
    catalog: mapCatalog(settings?.catalog, fallback.catalog, canUseLocalTenantFallback),
    primaryContactChannel: mapPrimaryContactChannel(
      settings?.primaryContactChannel,
      socialLinks,
      canUseLocalTenantFallback ? fallback.primaryContactChannel : undefined,
    ),
  };
}

function createTenantSafeBrandFallback(brandName: string): StorefrontConfig['brand'] {
  return {
    name: brandName,
    logoPath: '',
    logoAlt: brandName,
    homeAriaLabel: `${brandName} home`,
    faviconPath: '',
    tagline: '',
    description: '',
    notFoundImagePath: '',
  };
}

function mapTheme(
  settings: StorefrontRuntimeSettingsDocument | null,
  tenant: StorefrontRuntimeTenantDocument | null,
  fallback: StorefrontThemeConfig,
  canUseLocalTenantFallback: boolean,
): StorefrontThemeConfig {
  const theme = settings?.theme;
  const settingsPreset = readOption(theme?.['preset'], THEME_PRESET_IDS);
  const preset = settingsPreset ?? fallback.preset;
  const colors = readRecord(theme?.['colors']);
  const variants = readRecord(theme?.['variants']);
  const settingsColors = pickHexColors(colors, [
    'brandPrimary',
    'brandPrimaryStrong',
    'brandSecondary',
    'accent',
  ]);
  const legacyColors = theme
    ? {}
    : {
        ...(isHexColor(tenant?.primaryColor) ? { brandPrimary: tenant.primaryColor } : {}),
        ...(isHexColor(tenant?.secondaryColor) ? { brandSecondary: tenant.secondaryColor } : {}),
      };
  const fallbackColors = settingsPreset || !canUseLocalTenantFallback ? {} : fallback.colors;
  const themeColors = {
    ...fallbackColors,
    ...legacyColors,
    ...settingsColors,
  };
  const themeVariants = settingsPreset
    ? {
        ...(readOption(variants?.['hero'], HERO_VARIANT_IDS)
          ? { hero: readOption(variants?.['hero'], HERO_VARIANT_IDS) as HeroVariantId }
          : {}),
        ...(readOption(variants?.['productCard'], PRODUCT_CARD_VARIANT_IDS)
          ? {
              productCard: readOption(
                variants?.['productCard'],
                PRODUCT_CARD_VARIANT_IDS,
              ) as ProductCardVariantId,
            }
          : {}),
        ...(readOption(variants?.['productGrid'], PRODUCT_GRID_VARIANT_IDS)
          ? {
              productGrid: readOption(
                variants?.['productGrid'],
                PRODUCT_GRID_VARIANT_IDS,
              ) as ProductGridVariantId,
            }
          : {}),
        ...(readOption(variants?.['cta'], CTA_VARIANT_IDS)
          ? { cta: readOption(variants?.['cta'], CTA_VARIANT_IDS) as CtaVariantId }
          : {}),
      }
    : canUseLocalTenantFallback
      ? fallback.variants
      : undefined;
  const typographyPreset =
    readOption(theme?.['typographyPreset'], TYPOGRAPHY_PRESET_IDS)
    ?? (canUseLocalTenantFallback ? fallback.typographyPreset : undefined);

  return {
    preset,
    ...(Object.keys(themeColors).length > 0 ? { colors: themeColors } : {}),
    ...(typographyPreset ? { typographyPreset } : {}),
    ...(themeVariants ? { variants: themeVariants } : {}),
  };
}

function mapSocialLinks(
  settings: StorefrontRuntimeSettingsDocument | null,
  tenant: StorefrontRuntimeTenantDocument | null,
  fallback: StorefrontSocialLinksConfig,
  canUseLocalTenantFallback: boolean,
): StorefrontSocialLinksConfig {
  const socialLinks = settings?.socialLinks;
  const whatsappUrl =
    normalizeWhatsappUrl(readNonEmptyString(socialLinks?.['whatsappUrl']))
    ?? normalizeWhatsappUrl(readNonEmptyString(tenant?.whatsapp))
    ?? (canUseLocalTenantFallback ? fallback.whatsappUrl : '');
  const instagramUrl =
    readNonEmptyString(socialLinks?.['instagramUrl'])
    ?? readNonEmptyString(tenant?.instagram)
    ?? (canUseLocalTenantFallback ? fallback.instagramUrl : '');

  return {
    instagramUrl,
    whatsappUrl,
    facebookUrl:
      readOptionalString(socialLinks?.['facebookUrl'])
      ?? (canUseLocalTenantFallback ? fallback.facebookUrl : undefined),
    youtubeUrl:
      readOptionalString(socialLinks?.['youtubeUrl'])
      ?? (canUseLocalTenantFallback ? fallback.youtubeUrl : undefined),
  };
}

function mapContactChannels(
  settings: StorefrontRuntimeSettingsDocument | null,
  socialLinks: StorefrontSocialLinksConfig,
  fallback: ContactChannel[],
  canUseLocalTenantFallback: boolean,
): ContactChannel[] {
  const channels = readContactChannels(settings?.contactChannels);

  if (channels.length > 0) {
    return channels;
  }

  const derivedChannels = ([
    socialLinks.whatsappUrl
      ? { type: 'whatsapp' as const, label: 'Atendimento no WhatsApp', url: socialLinks.whatsappUrl }
      : null,
    socialLinks.instagramUrl
      ? { type: 'instagram' as const, label: 'Instagram da loja', url: socialLinks.instagramUrl }
      : null,
  ] as Array<ContactChannel | null>).filter((channel): channel is ContactChannel =>
    Boolean(channel),
  );

  if (derivedChannels.length > 0) {
    return derivedChannels;
  }

  return canUseLocalTenantFallback ? fallback : [];
}

function mapNavigationLinks(
  value: unknown,
  fallback: StorefrontNavigationLink[],
): StorefrontNavigationLink[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const links = value
    .map((item) => {
      const record = readRecord(item);

      if (!record) {
        return null;
      }

      const label = readNonEmptyString(record['label']);
      const route = readNavigationRoute(record['route']);

      return label && route ? { label, route } : null;
    })
    .filter((link): link is StorefrontNavigationLink => Boolean(link));

  return links.length > 0 ? links : fallback;
}

function mapCatalog(
  value: StorefrontRuntimeSettingsDocument['catalog'],
  fallback: StorefrontCatalogConfig,
  canUseLocalTenantFallback: boolean,
): StorefrontCatalogConfig {
  return {
    ...fallback,
    currencyCode: readNonEmptyString(value?.['currencyCode']) ?? fallback.currencyCode,
    baseProductUrl:
      readNonEmptyString(value?.['baseProductUrl'])
      ?? (canUseLocalTenantFallback ? fallback.baseProductUrl : ''),
    defaultWhatsAppMessage:
      readNonEmptyString(value?.['defaultWhatsAppMessage'])
      ?? (canUseLocalTenantFallback ? fallback.defaultWhatsAppMessage : 'Ola! Tenho interesse em:'),
    priceRangeMin: readNumber(value?.['priceRangeMin']) ?? fallback.priceRangeMin,
    priceRangeMax: readNumber(value?.['priceRangeMax']) ?? fallback.priceRangeMax,
    pricePresetMidValue: readNumber(value?.['pricePresetMidValue']) ?? fallback.pricePresetMidValue,
    pricePresetHighValue: readNumber(value?.['pricePresetHighValue']) ?? fallback.pricePresetHighValue,
  };
}

function mapPrimaryContactChannel(
  value: unknown,
  socialLinks: StorefrontSocialLinksConfig,
  fallback: StorefrontConfig['primaryContactChannel'],
): StorefrontConfig['primaryContactChannel'] {
  if (value === 'whatsapp' && socialLinks.whatsappUrl) {
    return 'whatsapp';
  }

  if (value === 'instagram' && socialLinks.instagramUrl) {
    return 'instagram';
  }

  if (fallback) {
    return fallback;
  }

  return socialLinks.whatsappUrl ? 'whatsapp' : socialLinks.instagramUrl ? 'instagram' : undefined;
}

function readContactChannels(value: unknown): ContactChannel[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const record = readRecord(item);

      if (!record) {
        return null;
      }

      const type = readOption(record['type'], ['whatsapp', 'instagram', 'support'] as const);
      const label = readNonEmptyString(record['label']);
      const url =
        type === 'whatsapp'
          ? normalizeWhatsappUrl(readNonEmptyString(record['url']))
          : readNonEmptyString(record['url']);

      return type && label && url ? { type, label, url } : null;
    })
    .filter((channel): channel is ContactChannel => Boolean(channel));
}

function pickStringFields<T extends string>(
  source: Partial<Record<T, unknown>> | null | undefined,
  fields: readonly T[] | string[],
): Partial<Record<T, string>> {
  const result: Partial<Record<T, string>> = {};

  for (const field of fields as T[]) {
    const value = readOptionalString(source?.[field]);

    if (value !== undefined) {
      result[field] = value;
    }
  }

  return result;
}

function pickHexColors<T extends string>(
  source: Record<string, unknown> | null,
  fields: readonly T[],
): Partial<Record<T, string>> {
  const result: Partial<Record<T, string>> = {};

  for (const field of fields) {
    const value = source?.[field];

    if (isHexColor(value)) {
      result[field] = value;
    }
  }

  return result;
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function readOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function readNonEmptyString(value: unknown): string | undefined {
  const stringValue = readOptionalString(value)?.trim();

  return stringValue ? stringValue : undefined;
}

function readNavigationRoute(value: unknown): string | undefined {
  const route = readNonEmptyString(value);

  return route?.startsWith('/') ? route : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function readOption<const T extends readonly string[]>(value: unknown, options: T): T[number] | undefined {
  return typeof value === 'string' && options.includes(value) ? value : undefined;
}

function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_COLOR_PATTERN.test(value);
}

export function normalizeWhatsappUrl(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  if (value.startsWith('https://wa.me/')) {
    try {
      const url = new URL(value);
      const phoneNumber = url.pathname.replace(/\D/g, '');

      return phoneNumber.length >= 8 ? `https://wa.me/${phoneNumber}` : undefined;
    } catch {
      return undefined;
    }
  }

  const digits = value.replace(/\D/g, '');

  return digits.length >= 8 ? `https://wa.me/${digits}` : undefined;
}
