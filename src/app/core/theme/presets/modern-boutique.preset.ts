import { ThemePreset } from '../models/theme-preset.types';
import { BASE_THEME_TOKENS } from '../tokens/base-theme.tokens';

export const MODERN_BOUTIQUE_PRESET = {
  id: 'modern-boutique',
  name: 'Modern Boutique',
  description: 'Balanced premium storefront for conversion-focused boutique catalogs.',
  tokens: {
    ...BASE_THEME_TOKENS,
    color: {
      ...BASE_THEME_TOKENS.color,
      brandPrimary: '#2f5f68',
      brandPrimaryStrong: '#1f4148',
      brandSecondary: '#93765f',
      accent: '#c6d6d4',
      backgroundCanvas: '#f4f6f3',
      backgroundSurface: '#ffffff',
      backgroundSurfaceSoft: '#e9efed',
      backgroundWarm: '#faf7f1',
      textPrimary: '#172326',
      textSecondary: '#5e686a',
      textInverse: '#ffffff',
      borderSubtle: '#d4ddda',
      inputBorder: '#cad4d1',
      inputBackground: '#f6f8f7',
      focusRing: '#c6d6d4',
      footerBackground: '#e8efec',
      feedbackPositive: '#28624c',
      ratingStar: '#b78643',
    },
    typography: {
      ...BASE_THEME_TOKENS.typography,
      fontHeading: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
      headingWeight: '600',
    },
  },
  variants: {
    hero: 'split-editorial',
    productCard: 'boutique-clean',
    productGrid: 'boutique-grid',
    cta: 'solid-premium',
  },
} satisfies ThemePreset;
