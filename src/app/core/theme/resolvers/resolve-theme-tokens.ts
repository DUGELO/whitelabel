import { StorefrontThemeConfig } from '../models/theme-config.types';
import { ResolvedTheme } from '../models/theme-runtime.types';
import { ThemePreset } from '../models/theme-preset.types';
import { EDITORIAL_LUXURY_PRESET, THEME_PRESETS_BY_ID } from '../presets';
import { TYPOGRAPHY_PRESET_TOKENS } from '../tokens/typography-preset.tokens';

export function resolveThemeTokens(config: StorefrontThemeConfig): ResolvedTheme {
  const preset = getThemePreset(config);

  return {
    preset,
    tokens: {
      ...preset.tokens,
      color: {
        ...preset.tokens.color,
        ...config.colors,
      },
      typography: {
        ...preset.tokens.typography,
        ...getTypographyPresetTokens(config),
      },
    },
    variants: {
      ...preset.variants,
      ...config.variants,
    },
  };
}

function getTypographyPresetTokens(config: StorefrontThemeConfig) {
  return config.typographyPreset ? TYPOGRAPHY_PRESET_TOKENS[config.typographyPreset] : {};
}

function getThemePreset(config: StorefrontThemeConfig): ThemePreset {
  return THEME_PRESETS_BY_ID[config.preset] ?? EDITORIAL_LUXURY_PRESET;
}
