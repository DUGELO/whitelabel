import { ThemePreset, ThemePresetId } from '../models/theme-preset.types';
import { DARK_ELEGANCE_PRESET } from './dark-elegance.preset';
import { EDITORIAL_LUXURY_PRESET } from './editorial-luxury.preset';
import { MINIMAL_PREMIUM_PRESET } from './minimal-premium.preset';
import { MODERN_BOUTIQUE_PRESET } from './modern-boutique.preset';
import { SOFT_FASHION_PRESET } from './soft-fashion.preset';

export const THEME_PRESETS = [
  EDITORIAL_LUXURY_PRESET,
  MINIMAL_PREMIUM_PRESET,
  SOFT_FASHION_PRESET,
  DARK_ELEGANCE_PRESET,
  MODERN_BOUTIQUE_PRESET,
] satisfies ThemePreset[];

export const THEME_PRESETS_BY_ID: Record<ThemePresetId, ThemePreset> = {
  'editorial-luxury': EDITORIAL_LUXURY_PRESET,
  'minimal-premium': MINIMAL_PREMIUM_PRESET,
  'soft-fashion': SOFT_FASHION_PRESET,
  'dark-elegance': DARK_ELEGANCE_PRESET,
  'modern-boutique': MODERN_BOUTIQUE_PRESET,
};

export {
  DARK_ELEGANCE_PRESET,
  EDITORIAL_LUXURY_PRESET,
  MINIMAL_PREMIUM_PRESET,
  MODERN_BOUTIQUE_PRESET,
  SOFT_FASHION_PRESET,
};
