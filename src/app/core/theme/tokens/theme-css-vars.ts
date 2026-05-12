import { ResolvedTheme } from '../models/theme-runtime.types';
import { RuntimeThemeTokens } from '../models/theme-token.types';

export function buildThemeCssVariables(theme: ResolvedTheme): Record<string, string> {
  const tokens = theme.tokens;

  return {
    ...buildSemanticColorVariables(tokens),
    ...buildLegacyColorAliases(tokens),
    ...buildTypographyVariables(tokens),
    ...buildSpacingVariables(tokens),
    ...buildRadiusVariables(tokens),
    ...buildShadowVariables(tokens),
    ...buildMotionVariables(tokens),
  };
}

function buildSemanticColorVariables(tokens: RuntimeThemeTokens): Record<string, string> {
  const color = tokens.color;

  return {
    '--color-brand-primary': color.brandPrimary,
    '--color-brand-primary-strong': color.brandPrimaryStrong,
    '--color-brand-secondary': color.brandSecondary,
    '--color-accent': color.accent,
    '--color-background-canvas': color.backgroundCanvas,
    '--color-background-surface': color.backgroundSurface,
    '--color-background-surface-soft': color.backgroundSurfaceSoft,
    '--color-background-warm': color.backgroundWarm,
    '--color-text-primary': color.textPrimary,
    '--color-text-secondary': color.textSecondary,
    '--color-text-inverse': color.textInverse,
    '--color-text-placeholder': color.textPlaceholder,
    '--color-icon-muted': color.iconMuted,
    '--color-border-subtle': color.borderSubtle,
    '--color-input-border': color.inputBorder,
    '--color-input-bg': color.inputBackground,
    '--color-focus-ring': color.focusRing,
    '--color-overlay-backdrop': color.overlayBackdrop,
    '--color-footer-bg': color.footerBackground,
    '--color-feedback-positive': color.feedbackPositive,
    '--color-rating-star': color.ratingStar,
  };
}

function buildLegacyColorAliases(tokens: RuntimeThemeTokens): Record<string, string> {
  const color = tokens.color;

  return {
    '--color-primary': color.brandPrimary,
    '--color-primary-dark': color.brandPrimaryStrong,
    '--color-secondary': color.brandSecondary,
    '--color-background': color.backgroundCanvas,
    '--color-surface': color.backgroundSurface,
    '--color-surface-soft': color.backgroundSurfaceSoft,
    '--color-surface-warm': color.backgroundWarm,
    '--color-text-main': color.textPrimary,
    '--color-text-muted': color.textSecondary,
    '--color-border': color.borderSubtle,
    '--color-star': color.ratingStar,
    '--color-price-positive': color.feedbackPositive,
  };
}

function buildTypographyVariables(tokens: RuntimeThemeTokens): Record<string, string> {
  const typography = tokens.typography;

  return {
    '--font-brand': typography.fontBrand,
    '--font-title': typography.fontHeading,
    '--font-heading': typography.fontHeading,
    '--font-body': typography.fontBody,
    '--font-weight-heading': typography.headingWeight,
    '--font-weight-body': typography.bodyWeight,
    '--line-height-tight': typography.lineHeightTight,
    '--line-height-body': typography.lineHeightBody,
  };
}

function buildSpacingVariables(tokens: RuntimeThemeTokens): Record<string, string> {
  const spacing = tokens.spacing;

  return {
    '--spacing-xs': spacing.xs,
    '--spacing-sm': spacing.sm,
    '--spacing-sm-md': spacing.smMd,
    '--spacing-md': spacing.md,
    '--spacing-md-lg': spacing.mdLg,
    '--spacing-lg': spacing.lg,
    '--spacing-xl': spacing.xl,
    '--spacing-2xl': spacing.twoXl,
    '--spacing-xxl': spacing.twoXl,
    '--spacing-3xl': spacing.threeXl,
  };
}

function buildRadiusVariables(tokens: RuntimeThemeTokens): Record<string, string> {
  const radius = tokens.radius;

  return {
    '--border-radius-sm': radius.sm,
    '--border-radius-card': radius.card,
    '--border-radius-pill': radius.pill,
    '--border-radius-circle': radius.circle,
  };
}

function buildShadowVariables(tokens: RuntimeThemeTokens): Record<string, string> {
  const shadow = tokens.shadow;

  return {
    '--shadow-soft': shadow.soft,
    '--shadow-card': shadow.card,
    '--shadow-elevated': shadow.elevated,
    '--shadow-overlay': shadow.overlay,
  };
}

function buildMotionVariables(tokens: RuntimeThemeTokens): Record<string, string> {
  const motion = tokens.motion;

  return {
    '--motion-fast': motion.fast,
    '--motion-medium': motion.medium,
    '--motion-slow': motion.slow,
    '--motion-easing-standard': motion.easingStandard,
    '--motion-easing-emphasized': motion.easingEmphasized,
  };
}
