import { ThemePreset } from './theme-preset.types';
import { RuntimeThemeTokens } from './theme-token.types';

export interface ResolvedTheme {
  preset: ThemePreset;
  tokens: RuntimeThemeTokens;
  variants: ThemePreset['variants'];
}
