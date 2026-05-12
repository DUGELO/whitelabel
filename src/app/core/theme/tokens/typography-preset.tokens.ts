import { TypographyPresetId } from '../models/theme-config.types';
import { ThemeTypographyTokens } from '../models/theme-token.types';

export const TYPOGRAPHY_PRESET_TOKENS: Record<
  TypographyPresetId,
  Partial<ThemeTypographyTokens>
> = {
  'editorial-serif': {
    fontBrand: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
    fontHeading: "'DM Serif Display', Georgia, serif",
    fontBody: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
    headingWeight: '400',
    lineHeightTight: '1.08',
  },
  'modern-sans': {
    fontBrand: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
    fontHeading: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
    fontBody: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
    headingWeight: '700',
    lineHeightTight: '1.12',
  },
  'soft-serif': {
    fontBrand: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
    fontHeading: "'DM Serif Display', Georgia, serif",
    fontBody: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
    headingWeight: '400',
    lineHeightTight: '1.14',
    lineHeightBody: '1.68',
  },
  'cinematic-serif': {
    fontBrand: "'DM Serif Display', Georgia, serif",
    fontHeading: "'DM Serif Display', Georgia, serif",
    fontBody: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
    headingWeight: '400',
    lineHeightTight: '1.02',
  },
};
