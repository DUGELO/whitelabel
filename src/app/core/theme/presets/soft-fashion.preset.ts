import { ThemePreset } from '../models/theme-preset.types';
import { BASE_THEME_TOKENS } from '../tokens/base-theme.tokens';

export const SOFT_FASHION_PRESET = {
  id: 'soft-fashion',
  name: 'Soft Fashion',
  description: 'Soft, fashion-oriented storefront with warm surfaces and delicate contrast.',
  tokens: {
    ...BASE_THEME_TOKENS,
    color: {
      ...BASE_THEME_TOKENS.color,
      brandPrimary: '#9f5368',
      brandPrimaryStrong: '#74364a',
      brandSecondary: '#b98877',
      accent: '#efd0cc',
      backgroundCanvas: '#fbf4f2',
      backgroundSurface: '#fffdfc',
      backgroundSurfaceSoft: '#f6e8e5',
      backgroundWarm: '#fff7f1',
      textPrimary: '#2a1c20',
      textSecondary: '#746269',
      textInverse: '#fffdfc',
      borderSubtle: '#ead8d4',
      inputBorder: '#dcc9c4',
      inputBackground: '#fbf6f4',
      focusRing: '#efd0cc',
      footerBackground: '#f4e7e3',
      feedbackPositive: '#35624d',
      ratingStar: '#b98255',
    },
    shadow: {
      soft: '0 8px 18px rgba(42, 28, 32, 0.08)',
      card: '0 14px 34px rgba(42, 28, 32, 0.1)',
      elevated: '0 20px 52px rgba(42, 28, 32, 0.14)',
      overlay: '0 -8px 32px rgba(42, 28, 32, 0.16)',
    },
  },
  variants: {
    hero: 'split-editorial',
    productCard: 'boutique-clean',
    productGrid: 'boutique-grid',
    cta: 'soft-outline',
  },
} satisfies ThemePreset;
