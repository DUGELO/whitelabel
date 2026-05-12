import { ThemePreset } from '../models/theme-preset.types';
import { BASE_THEME_TOKENS } from '../tokens/base-theme.tokens';

export const EDITORIAL_LUXURY_PRESET = {
  id: 'editorial-luxury',
  name: 'Editorial Luxury',
  description: 'Spacious editorial storefront with warm neutrals and refined serif hierarchy.',
  tokens: BASE_THEME_TOKENS,
  variants: {
    hero: 'immersive',
    productCard: 'editorial-minimal',
    productGrid: 'editorial-grid',
    cta: 'solid-premium',
  },
} satisfies ThemePreset;
