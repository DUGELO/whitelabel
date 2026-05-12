import { ThemePreset } from '../models/theme-preset.types';
import { BASE_THEME_TOKENS } from '../tokens/base-theme.tokens';

export const MINIMAL_PREMIUM_PRESET = {
  id: 'minimal-premium',
  name: 'Minimal Premium',
  description: 'Restrained monochrome storefront with quiet contrast and clean spacing.',
  tokens: {
    ...BASE_THEME_TOKENS,
    color: {
      ...BASE_THEME_TOKENS.color,
      brandPrimary: '#111111',
      brandPrimaryStrong: '#000000',
      brandSecondary: '#3f3f46',
      accent: '#d4d4d8',
      backgroundCanvas: '#f7f7f5',
      backgroundSurface: '#ffffff',
      backgroundSurfaceSoft: '#efefec',
      backgroundWarm: '#fafaf8',
      textPrimary: '#18181b',
      textSecondary: '#66666e',
      textInverse: '#ffffff',
      borderSubtle: '#d9d9d6',
      focusRing: '#c7c7c2',
      footerBackground: '#eeeeea',
      ratingStar: '#8a7654',
    },
    typography: {
      ...BASE_THEME_TOKENS.typography,
      fontHeading: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
      headingWeight: '600',
    },
    shadow: {
      soft: '0 4px 10px rgba(24, 24, 27, 0.06)',
      card: '0 10px 26px rgba(24, 24, 27, 0.08)',
      elevated: '0 18px 42px rgba(24, 24, 27, 0.12)',
      overlay: '0 -8px 32px rgba(24, 24, 27, 0.16)',
    },
  },
  variants: {
    hero: 'minimal-focus',
    productCard: 'quiet-luxury',
    productGrid: 'minimal-grid',
    cta: 'quiet-link',
  },
} satisfies ThemePreset;
