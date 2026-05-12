import { resolveThemeTokens } from './resolve-theme-tokens';

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
});
