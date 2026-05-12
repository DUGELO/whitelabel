import { StorefrontThemeVariants, ThemePresetId } from './theme-preset.types';
import { ThemeColorTokens } from './theme-token.types';

export type TypographyPresetId =
  | 'editorial-serif'
  | 'modern-sans'
  | 'soft-serif'
  | 'cinematic-serif';

export interface StorefrontThemeColorOverrides
  extends Partial<
    Pick<
      ThemeColorTokens,
      'brandPrimary' | 'brandPrimaryStrong' | 'brandSecondary' | 'accent'
    >
  > {}

export interface StorefrontThemeConfig {
  preset: ThemePresetId;
  colors?: StorefrontThemeColorOverrides;
  typographyPreset?: TypographyPresetId;
  variants?: Partial<StorefrontThemeVariants>;
}
