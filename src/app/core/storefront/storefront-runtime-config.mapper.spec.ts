import { STOREFRONT_CONFIG } from './storefront-config';
import { mapRuntimeStorefrontConfig, normalizeWhatsappUrl } from './storefront-runtime-config.mapper';

describe('mapRuntimeStorefrontConfig', () => {
  it('should map Firestore settings into a complete storefront config with local fallbacks', () => {
    const config = mapRuntimeStorefrontConfig({
      tenantId: 'whitelabel',
      settings: {
        brand: {
          name: 'Loja Firestore',
          logoPath: 'logo-firestore.svg',
        },
        theme: {
          preset: 'soft-fashion',
          typographyPreset: 'soft-serif',
          colors: {
            brandPrimary: '#9f5368',
            customSurface: '#ffffff',
          },
          variants: {
            productCard: 'soft-fashion-card',
            customCss: 'body { display: none }',
          },
          customCss: 'body { display: none }',
        },
        socialLinks: {
          whatsappUrl: 'https://wa.me/5598984655819',
          instagramUrl: 'https://instagram.com/firestore',
        },
        contactChannels: [
          {
            type: 'whatsapp',
            label: 'Comprar no WhatsApp',
            url: 'https://wa.me/5598984655819',
          },
        ],
        catalog: {
          currencyCode: 'BRL',
          defaultWhatsAppMessage: 'Ola, quero comprar:',
        },
      },
    });

    expect(config.brand.name).toBe('Loja Firestore');
    expect(config.brand.logoPath).toBe('logo-firestore.svg');
    expect(config.brand.logoAlt).toBe(STOREFRONT_CONFIG.brand.logoAlt);
    expect(config.theme.preset).toBe('soft-fashion');
    expect(config.theme.typographyPreset).toBe('soft-serif');
    expect(config.theme.colors?.brandPrimary).toBe('#9f5368');
    expect(config.theme.colors).not.toHaveProperty('customSurface');
    expect(config.theme.variants?.productCard).toBe('soft-fashion-card');
    expect(config.theme.variants).not.toHaveProperty('customCss');
    expect(config.catalog.defaultWhatsAppMessage).toBe('Ola, quero comprar:');
  });

  it('should build storefront config from legacy tenant fields when settings are absent', () => {
    const config = mapRuntimeStorefrontConfig({
      tenantId: 'whitelabel',
      tenant: {
        name: 'White Label',
        slug: 'white-label',
        primaryColor: '#7b1e3a',
        secondaryColor: '#000000',
        instagram: 'https://instagram.com/eduardo_angelo_',
        whatsapp: '+5598984655819',
      },
      settings: null,
    });

    expect(config.brand.name).toBe('White Label');
    expect(config.theme.colors?.brandPrimary).toBe('#7b1e3a');
    expect(config.theme.colors?.brandSecondary).toBe('#000000');
    expect(config.socialLinks.whatsappUrl).toBe('https://wa.me/5598984655819');
    expect(config.primaryContactChannel).toBe('whatsapp');
  });

  it('should not leak local tenant assets or contact links into another tenant', () => {
    const config = mapRuntimeStorefrontConfig({
      tenantId: 'tenant-boutique',
      settings: {
        brand: {
          name: 'Boutique B',
        },
        theme: {
          preset: 'minimal-premium',
        },
        socialLinks: {},
        contactChannels: [],
        catalog: {
          currencyCode: 'BRL',
        },
      },
    });

    expect(config.brand.name).toBe('Boutique B');
    expect(config.brand.logoPath).toBe('');
    expect(config.brand.faviconPath).toBe('');
    expect(config.brand.notFoundImagePath).toBe('');
    expect(config.socialLinks.whatsappUrl).toBe('');
    expect(config.socialLinks.instagramUrl).toBe('');
    expect(config.contactChannels).toEqual([]);
    expect(config.catalog.baseProductUrl).toBe('');
    expect(config.catalog.defaultWhatsAppMessage).toBe('Ola! Tenho interesse em:');
    expect(config.primaryContactChannel).toBeUndefined();
  });

  it('should not leak local theme color overrides into another tenant fallback', () => {
    const config = mapRuntimeStorefrontConfig({
      tenantId: 'tenant-legacy',
      tenant: {
        name: 'Legacy Store',
        slug: 'legacy-store',
        primaryColor: '#123456',
      },
      settings: null,
    });

    expect(config.theme.preset).toBe(STOREFRONT_CONFIG.theme.preset);
    expect(config.theme.colors).toEqual({ brandPrimary: '#123456' });
    expect(config.theme.variants).toBeUndefined();
    expect(config.theme.typographyPreset).toBeUndefined();
  });

  it('should not apply legacy tenant colors after settings/main owns the theme', () => {
    const config = mapRuntimeStorefrontConfig({
      tenantId: 'whitelabel',
      tenant: {
        primaryColor: '#111111',
        secondaryColor: '#222222',
      },
      settings: {
        brand: {
          name: 'Loja Firestore',
        },
        theme: {
          preset: 'modern-boutique',
          colors: {
            brandPrimary: '#2f5f68',
          },
        },
      },
    });

    expect(config.theme.colors?.brandPrimary).toBe('#2f5f68');
    expect(config.theme.colors?.brandSecondary).toBeUndefined();
  });

  it('should keep theme colors absent when settings only selects a preset', () => {
    const config = mapRuntimeStorefrontConfig({
      tenantId: 'tenant-minimal',
      settings: {
        brand: {
          name: 'Minimal Store',
        },
        theme: {
          preset: 'minimal-premium',
        },
      },
    });

    expect(config.theme.preset).toBe('minimal-premium');
    expect(config.theme.colors).toBeUndefined();
  });

  it('should ignore navigation links outside the internal route contract', () => {
    const config = mapRuntimeStorefrontConfig({
      tenantId: 'tenant-nav',
      settings: {
        brand: {
          name: 'Loja Nav',
        },
        theme: {
          preset: 'minimal-premium',
        },
        navigationLinks: [
          { label: 'Inicio', route: '/' },
          { label: 'Externo', route: 'https://example.com' },
        ],
      },
    });

    expect(config.navigationLinks).toEqual([{ label: 'Inicio', route: '/' }]);
  });

  it('should ignore invalid theme values and keep safe defaults', () => {
    const config = mapRuntimeStorefrontConfig({
      tenantId: 'whitelabel',
      settings: {
        brand: {
          name: 'Loja Invalida',
        },
        theme: {
          preset: 'custom-theme',
          typographyPreset: 'free-font',
          colors: {
            brandPrimary: 'red',
          },
          variants: {
            productCard: 'tenant-special',
          },
        },
      },
    });

    expect(config.theme.preset).toBe(STOREFRONT_CONFIG.theme.preset);
    expect(config.theme.typographyPreset).toBe(STOREFRONT_CONFIG.theme.typographyPreset);
    expect(config.theme.colors?.brandPrimary).toBe(STOREFRONT_CONFIG.theme.colors?.brandPrimary);
    expect(config.theme.variants?.productCard).not.toBe('tenant-special');
  });

  it('should normalize WhatsApp URLs to the public rules contract', () => {
    expect(normalizeWhatsappUrl('+55 (98) 98465-5819')).toBe('https://wa.me/5598984655819');
    expect(normalizeWhatsappUrl('https://wa.me/5598984655819?text=ola')).toBe(
      'https://wa.me/5598984655819',
    );
    expect(normalizeWhatsappUrl('https://wa.me/abc')).toBeUndefined();
  });
});
