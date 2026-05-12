export interface ThemeColorTokens {
  brandPrimary: string;
  brandPrimaryStrong: string;
  brandSecondary: string;
  accent: string;
  backgroundCanvas: string;
  backgroundSurface: string;
  backgroundSurfaceSoft: string;
  backgroundWarm: string;
  textPrimary: string;
  textSecondary: string;
  textInverse: string;
  textPlaceholder: string;
  iconMuted: string;
  borderSubtle: string;
  inputBorder: string;
  inputBackground: string;
  focusRing: string;
  overlayBackdrop: string;
  footerBackground: string;
  feedbackPositive: string;
  ratingStar: string;
}

export interface ThemeTypographyTokens {
  fontBrand: string;
  fontHeading: string;
  fontBody: string;
  headingWeight: string;
  bodyWeight: string;
  lineHeightTight: string;
  lineHeightBody: string;
}

export interface ThemeSpacingTokens {
  xs: string;
  sm: string;
  smMd: string;
  md: string;
  mdLg: string;
  lg: string;
  xl: string;
  twoXl: string;
  threeXl: string;
}

export interface ThemeRadiusTokens {
  sm: string;
  card: string;
  pill: string;
  circle: string;
}

export interface ThemeShadowTokens {
  soft: string;
  card: string;
  elevated: string;
  overlay: string;
}

export interface ThemeMotionTokens {
  fast: string;
  medium: string;
  slow: string;
  easingStandard: string;
  easingEmphasized: string;
}

export interface RuntimeThemeTokens {
  color: ThemeColorTokens;
  typography: ThemeTypographyTokens;
  spacing: ThemeSpacingTokens;
  radius: ThemeRadiusTokens;
  shadow: ThemeShadowTokens;
  motion: ThemeMotionTokens;
}
