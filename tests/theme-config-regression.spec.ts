import { Page, expect, test as base } from '@playwright/test';

import { createStorefrontConfig, seedE2ERuntime } from './support/e2e-runtime';

type ThemeExpectation = {
  preset: string;
  theme: Parameters<typeof createStorefrontConfig>[0];
  brandPrimary: string;
  brandPrimaryStrong: string;
  brandSecondary: string;
  accent: string;
  backgroundCanvas: string;
  productCardClass: string;
  fontHeadingIncludes: string;
  headingWeight: string;
};

const test = base.extend<{ browserErrors: string[] }>({
  browserErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];

      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') {
          errors.push(message.text());
        }
      });

      await use(errors);

      expect(errors).toEqual([]);
    },
    { auto: true },
  ],
});

const presetCases: ThemeExpectation[] = [
  {
    preset: 'editorial-luxury',
    theme: { preset: 'editorial-luxury' },
    brandPrimary: '#8a6a2d',
    brandPrimaryStrong: '#5f4617',
    brandSecondary: '#b99668',
    accent: '#e5d3b1',
    backgroundCanvas: '#f7f2e9',
    productCardClass: 'product-card--editorial-minimal',
    fontHeadingIncludes: 'DM Serif Display',
    headingWeight: '400',
  },
  {
    preset: 'minimal-premium',
    theme: { preset: 'minimal-premium' },
    brandPrimary: '#111111',
    brandPrimaryStrong: '#000000',
    brandSecondary: '#3f3f46',
    accent: '#d4d4d8',
    backgroundCanvas: '#f7f7f5',
    productCardClass: 'product-card--quiet-luxury',
    fontHeadingIncludes: 'Plus Jakarta Sans',
    headingWeight: '600',
  },
  {
    preset: 'soft-fashion',
    theme: { preset: 'soft-fashion' },
    brandPrimary: '#9f5368',
    brandPrimaryStrong: '#74364a',
    brandSecondary: '#b98877',
    accent: '#efd0cc',
    backgroundCanvas: '#fbf4f2',
    productCardClass: 'product-card--soft-fashion-card',
    fontHeadingIncludes: 'DM Serif Display',
    headingWeight: '400',
  },
  {
    preset: 'dark-elegance',
    theme: { preset: 'dark-elegance' },
    brandPrimary: '#c7a568',
    brandPrimaryStrong: '#a98647',
    brandSecondary: '#84705c',
    accent: '#e0c995',
    backgroundCanvas: '#12100e',
    productCardClass: 'product-card--dark-elegance-card',
    fontHeadingIncludes: 'DM Serif Display',
    headingWeight: '400',
  },
  {
    preset: 'modern-boutique',
    theme: { preset: 'modern-boutique' },
    brandPrimary: '#2f5f68',
    brandPrimaryStrong: '#1f4148',
    brandSecondary: '#93765f',
    accent: '#c6d6d4',
    backgroundCanvas: '#f4f6f3',
    productCardClass: 'product-card--boutique-clean',
    fontHeadingIncludes: 'Plus Jakarta Sans',
    headingWeight: '600',
  },
];

for (const presetCase of presetCases) {
  test(`applies preset config for ${presetCase.preset}`, async ({ page }) => {
    const config = createStorefrontConfig(presetCase.theme);

    await seedE2ERuntime(page, config);
    await page.goto('/');

    await expect(page).toHaveTitle(config.brand.name);
    await expect(page.locator('html')).toHaveAttribute('data-theme-preset', presetCase.preset);
    await expect(page.locator('.feature-card h1')).toHaveText('Anel Solitario Aurora');
    await expect(page.locator('.product-card').first()).toHaveClass(
      new RegExp(presetCase.productCardClass),
    );

    const themeState = await readThemeState(page);

    expect(themeState.brandPrimary).toBe(presetCase.brandPrimary);
    expect(themeState.legacyPrimary).toBe(presetCase.brandPrimary);
    expect(themeState.brandPrimaryStrong).toBe(presetCase.brandPrimaryStrong);
    expect(themeState.legacyPrimaryDark).toBe(presetCase.brandPrimaryStrong);
    expect(themeState.brandSecondary).toBe(presetCase.brandSecondary);
    expect(themeState.accent).toBe(presetCase.accent);
    expect(themeState.backgroundCanvas).toBe(presetCase.backgroundCanvas);
    expect(themeState.fontHeading).toContain(presetCase.fontHeadingIncludes);
    expect(themeState.headingWeight).toBe(presetCase.headingWeight);
    expect(themeState.styleAttribute).not.toContain('undefined');
    expect(themeState.styleAttribute).not.toContain('null');
  });
}

test('applies color, typography and variant overrides over a selected preset', async ({ page }) => {
  const config = createStorefrontConfig({
    preset: 'modern-boutique',
    typographyPreset: 'cinematic-serif',
    colors: {
      brandPrimary: '#13579b',
      brandPrimaryStrong: '#0f315f',
      brandSecondary: '#2468ac',
      accent: '#abcdef',
    },
    variants: {
      productCard: 'quiet-luxury',
    },
  });

  await seedE2ERuntime(page, config);
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('data-theme-preset', 'modern-boutique');
  await expect(page.locator('.product-card').first()).toHaveClass(/product-card--quiet-luxury/);

  const themeState = await readThemeState(page);

  expect(themeState.brandPrimary).toBe('#13579b');
  expect(themeState.legacyPrimary).toBe('#13579b');
  expect(themeState.brandPrimaryStrong).toBe('#0f315f');
  expect(themeState.legacyPrimaryDark).toBe('#0f315f');
  expect(themeState.brandSecondary).toBe('#2468ac');
  expect(themeState.legacySecondary).toBe('#2468ac');
  expect(themeState.accent).toBe('#abcdef');
  expect(themeState.backgroundCanvas).toBe('#f4f6f3');
  expect(themeState.fontHeading).toContain('DM Serif Display');
  expect(themeState.headingWeight).toBe('400');
  expect(themeState.styleAttribute).not.toContain('#8a6a2d');
});

test('does not carry custom colors when a tenant inherits a different preset palette', async ({
  page,
}) => {
  const config = createStorefrontConfig({
    preset: 'minimal-premium',
    variants: {
      productCard: 'quiet-luxury',
    },
  });

  await seedE2ERuntime(page, config);
  await page.goto('/search');

  await expect(page.locator('html')).toHaveAttribute('data-theme-preset', 'minimal-premium');

  const themeState = await readThemeState(page);

  expect(themeState.brandPrimary).toBe('#111111');
  expect(themeState.backgroundCanvas).toBe('#f7f7f5');
  expect(themeState.styleAttribute).not.toContain('#8a6a2d');
  expect(themeState.styleAttribute).not.toContain('#2f5f68');
  await expect(page.locator('.product-card').first()).toHaveClass(/product-card--quiet-luxury/);
});

async function readThemeState(page: Page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const style = getComputedStyle(root);

    return {
      brandPrimary: style.getPropertyValue('--color-brand-primary').trim(),
      legacyPrimary: style.getPropertyValue('--color-primary').trim(),
      brandPrimaryStrong: style.getPropertyValue('--color-brand-primary-strong').trim(),
      legacyPrimaryDark: style.getPropertyValue('--color-primary-dark').trim(),
      brandSecondary: style.getPropertyValue('--color-brand-secondary').trim(),
      legacySecondary: style.getPropertyValue('--color-secondary').trim(),
      accent: style.getPropertyValue('--color-accent').trim(),
      backgroundCanvas: style.getPropertyValue('--color-background-canvas').trim(),
      fontHeading: style.getPropertyValue('--font-heading').trim(),
      headingWeight: style.getPropertyValue('--font-weight-heading').trim(),
      styleAttribute: root.getAttribute('style') ?? '',
    };
  });
}
