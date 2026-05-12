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
});
