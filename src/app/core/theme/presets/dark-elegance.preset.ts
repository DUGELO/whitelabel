import { ThemePreset } from '../models/theme-preset.types';
import { BASE_THEME_TOKENS } from '../tokens/base-theme.tokens';

export const DARK_ELEGANCE_PRESET = {
  id: 'dark-elegance',
  name: 'Dark Elegance',
  description: 'Cinematic dark storefront with high-contrast luxury surfaces.',
  tokens: {
    ...BASE_THEME_TOKENS,
    color: {
      ...BASE_THEME_TOKENS.color,
      brandPrimary: '#c7a568',
      brandPrimaryStrong: '#a98647',
      brandSecondary: '#84705c',
      accent: '#e0c995',
      backgroundCanvas: '#12100e',
      backgroundSurface: '#1c1915',
      backgroundSurfaceSoft: '#26211b',
      backgroundWarm: '#211b15',
      textPrimary: '#f7f0e6',
      textSecondary: '#b9afa2',
      textInverse: '#12100e',
      textPlaceholder: '#8f8377',
      iconMuted: '#a99d91',
      borderSubtle: '#3b332a',
      inputBorder: '#4a4035',
      inputBackground: '#1a1714',
      focusRing: '#c7a568',
      footerBackground: '#181511',
      feedbackPositive: '#8cbf9f',
      ratingStar: '#d6b267',
    },
    shadow: {
      soft: '0 8px 18px rgba(0, 0, 0, 0.24)',
      card: '0 16px 38px rgba(0, 0, 0, 0.3)',
      elevated: '0 24px 60px rgba(0, 0, 0, 0.36)',
      overlay: '0 -8px 32px rgba(0, 0, 0, 0.42)',
    },
  },
  variants: {
    hero: 'immersive',
    productCard: 'quiet-luxury',
    productGrid: 'editorial-grid',
    cta: 'solid-premium',
  },
} satisfies ThemePreset;
