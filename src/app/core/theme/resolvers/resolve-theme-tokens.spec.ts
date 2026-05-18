import { resolveThemeTokens } from './resolve-theme-tokens';
import { StorefrontThemeConfig } from '../models/theme-config.types';
import { ThemePresetId } from '../models/theme-preset.types';

describe('resolveThemeTokens', () => {
  it('should resolve preset tokens with controlled color overrides', () => {
    const theme = resolveThemeTokens({
      preset: 'editorial-luxury',
      colors: {
        brandPrimary: '#123456',
      },
    });

    expect(theme.preset.id).toBe('editorial-luxury');
    expect(theme.tokens.color.brandPrimary).toBe('#123456');
    expect(theme.tokens.color.backgroundCanvas).toBe('#f7f2e9');
    expect(theme.tokens.color.brandSecondary).toBe('#b99668');
  });

  it('should merge curated variants over the selected preset defaults', () => {
    const theme = resolveThemeTokens({
      preset: 'modern-boutique',
      variants: {
        cta: 'soft-outline',
      },
    });

    expect(theme.variants.productCard).toBe('boutique-clean');
    expect(theme.variants.cta).toBe('soft-outline');
  });

  it('should resolve a distinct product card variant for each preset family', () => {
    expect(resolveThemeTokens({ preset: 'editorial-luxury' }).variants.productCard).toBe(
      'editorial-minimal',
    );
    expect(resolveThemeTokens({ preset: 'minimal-premium' }).variants.productCard).toBe(
      'quiet-luxury',
    );
    expect(resolveThemeTokens({ preset: 'soft-fashion' }).variants.productCard).toBe(
      'soft-fashion-card',
    );
    expect(resolveThemeTokens({ preset: 'dark-elegance' }).variants.productCard).toBe(
      'dark-elegance-card',
    );
    expect(resolveThemeTokens({ preset: 'modern-boutique' }).variants.productCard).toBe(
      'boutique-clean',
    );
  });

  it('should apply controlled typography presets over preset typography tokens', () => {
    const theme = resolveThemeTokens({
      preset: 'editorial-luxury',
      typographyPreset: 'modern-sans',
    });

    expect(theme.tokens.typography.fontHeading).toContain('Plus Jakarta Sans');
    expect(theme.tokens.typography.headingWeight).toBe('700');
    expect(theme.tokens.typography.lineHeightTight).toBe('1.12');
  });

  it('should keep preset color precedence when only part of the palette is overridden', () => {
    const theme = resolveThemeTokens({
      preset: 'modern-boutique',
      colors: {
        brandPrimary: '#101010',
        accent: '#fefefe',
      },
    });

    expect(theme.tokens.color.brandPrimary).toBe('#101010');
    expect(theme.tokens.color.accent).toBe('#fefefe');
    expect(theme.tokens.color.brandPrimaryStrong).toBe('#1f4148');
    expect(theme.tokens.color.backgroundCanvas).toBe('#f4f6f3');
    expect(theme.variants.productGrid).toBe('boutique-grid');
  });

  it('should not mutate preset tokens between resolutions', () => {
    const firstTheme = resolveThemeTokens({
      preset: 'editorial-luxury',
      colors: {
        brandPrimary: '#111111',
      },
    });
    const secondTheme = resolveThemeTokens({ preset: 'editorial-luxury' });

    firstTheme.tokens.color.brandPrimary = '#222222';

    expect(secondTheme.tokens.color.brandPrimary).toBe('#8a6a2d');
    expect(resolveThemeTokens({ preset: 'editorial-luxury' }).tokens.color.brandPrimary).toBe(
      '#8a6a2d',
    );
  });

  it('should fall back to the editorial preset for an unknown preset while preserving safe overrides', () => {
    const theme = resolveThemeTokens({
      preset: 'unknown-preset' as ThemePresetId,
      colors: {
        brandPrimary: '#445566',
      },
      variants: {
        cta: 'quiet-link',
      },
    });

    expect(theme.preset.id).toBe('editorial-luxury');
    expect(theme.tokens.color.brandPrimary).toBe('#445566');
    expect(theme.tokens.color.backgroundCanvas).toBe('#f7f2e9');
    expect(theme.variants.cta).toBe('quiet-link');
    expect(theme.variants.hero).toBe('immersive');
  });

  it('should tolerate missing optional configuration without erasing preset defaults', () => {
    const theme = resolveThemeTokens({
      preset: 'dark-elegance',
      colors: undefined,
      variants: undefined,
      typographyPreset: undefined,
    });

    expect(theme.preset.id).toBe('dark-elegance');
    expect(theme.tokens.color.brandPrimary).toBe('#c7a568');
    expect(theme.tokens.typography.fontHeading).toContain('DM Serif Display');
    expect(theme.variants.productCard).toBe('dark-elegance-card');
  });

  it('should be deterministic for the same theme configuration', () => {
    const config: StorefrontThemeConfig = {
      preset: 'soft-fashion',
      typographyPreset: 'soft-serif',
      colors: {
        brandPrimary: '#aa3377',
      },
      variants: {
        productGrid: 'minimal-grid',
      },
    };

    expect(resolveThemeTokens(config)).toEqual(resolveThemeTokens(config));
  });
});
