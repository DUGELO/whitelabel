import { RuntimeThemeTokens } from './theme-token.types';

export type ThemePresetId =
  | 'editorial-luxury'
  | 'minimal-premium'
  | 'soft-fashion'
  | 'dark-elegance'
  | 'modern-boutique';

export type HeroVariantId = 'immersive' | 'split-editorial' | 'minimal-focus';
export type ProductCardVariantId =
  | 'editorial-minimal'
  | 'quiet-luxury'
  | 'soft-fashion-card'
  | 'dark-elegance-card'
  | 'boutique-clean';
export type ProductGridVariantId = 'editorial-grid' | 'minimal-grid' | 'boutique-grid';
export type CtaVariantId = 'solid-premium' | 'soft-outline' | 'quiet-link';

export interface StorefrontThemeVariants {
  hero: HeroVariantId;
  productCard: ProductCardVariantId;
  productGrid: ProductGridVariantId;
  cta: CtaVariantId;
}

export interface ThemePreset {
  id: ThemePresetId;
  name: string;
  description: string;
  tokens: RuntimeThemeTokens;
  variants: StorefrontThemeVariants;
}
