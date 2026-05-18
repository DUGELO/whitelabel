import { Page, expect, test as base } from '@playwright/test';

import { createStorefrontConfig, seedE2ERuntime } from './support/e2e-runtime';

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

test.beforeEach(async ({ page }) => {
  await installStyleReader(page);
});

test('keeps storefront shell, hero and cards aligned to design-system semantic tokens', async ({
  page,
}) => {
  await seedE2ERuntime(page);
  await page.goto('/');

  const audit = await page.evaluate(() => {
    const read = createStyleReader();

    return {
      tokens: read.tokens([
        '--color-background',
        '--color-surface',
        '--color-surface-soft',
        '--color-border',
        '--color-primary',
        '--color-text-inverse',
        '--color-text-muted',
        '--color-price-positive',
        '--color-star',
      ]),
      body: read.styles('body', ['backgroundColor', 'color', 'fontFamily']),
      header: read.styles('.container-header', ['borderBottomColor']),
      search: read.styles('.header-shell .search', ['backgroundColor', 'borderColor']),
      searchButton: read.styles('.header-shell .search button', [
        'backgroundColor',
        'color',
        'borderRadius',
      ]),
      heroCard: read.styles('.feature-card', ['backgroundColor', 'borderColor']),
      heroEyebrow: read.styles('.feature-content .eyebrow', ['color']),
      heroCta: read.styles('.feature-content .view-button', ['backgroundColor', 'color']),
      productCard: read.styles('.product-card', ['backgroundColor']),
      productImage: read.styles('.product-card .image-wrap', ['backgroundColor']),
      productDescription: read.styles('.product-card .product-description', ['color']),
      currentPrice: read.styles('.product-card .current-price', ['color']),
      ratingStars: read.styles('.product-card .stars', ['color']),
    };
  });

  expect(audit.body.backgroundColor).toBe(audit.tokens['--color-background']);
  expect(audit.header.borderBottomColor).toBe(audit.tokens['--color-border']);
  expect(audit.search.backgroundColor).toBe(audit.tokens['--color-surface']);
  expect(audit.search.borderColor).toBe(audit.tokens['--color-border']);
  expect(audit.searchButton.backgroundColor).toBe(audit.tokens['--color-primary']);
  expect(audit.searchButton.color).toBe(audit.tokens['--color-text-inverse']);
  expect(audit.heroCard.backgroundColor).toBe(audit.tokens['--color-surface']);
  expect(audit.heroCard.borderColor).toBe(audit.tokens['--color-border']);
  expect(audit.heroEyebrow.color).toBe(audit.tokens['--color-text-muted']);
  expect(audit.heroCta.backgroundColor).toBe(audit.tokens['--color-primary']);
  expect(audit.heroCta.color).toBe(audit.tokens['--color-text-inverse']);
  expect(audit.productCard.backgroundColor).toBe(audit.tokens['--color-surface']);
  expect(audit.productImage.backgroundColor).toBe(audit.tokens['--color-surface-soft']);
  expect(audit.productDescription.color).toBe(audit.tokens['--color-text-muted']);
  expect(audit.currentPrice.color).toBe(audit.tokens['--color-price-positive']);
  expect(audit.ratingStars.color).toBe(audit.tokens['--color-star']);
  expect(audit.searchButton.borderRadius).toBe('999px');
});

for (const theme of [
  { preset: 'editorial-luxury' as const },
  { preset: 'dark-elegance' as const },
  {
    preset: 'modern-boutique' as const,
    colors: {
      brandPrimary: '#13579b',
      brandPrimaryStrong: '#0f315f',
      brandSecondary: '#2468ac',
      accent: '#abcdef',
    },
  },
]) {
  test(`keeps primary conversion CTAs on the primary brand token for ${theme.preset}`, async ({
    page,
  }) => {
    await seedE2ERuntime(page, createStorefrontConfig(theme));
    await page.goto('/products/ring-solitaire');

    const audit = await page.evaluate(() => {
      const read = createStyleReader();

      return {
        preset: document.documentElement.dataset['themePreset'],
        tokens: read.tokens([
          '--color-primary',
          '--color-secondary',
          '--color-text-inverse',
          '--color-border',
          '--color-text-main',
        ]),
        primaryCta: read.styles('.cta-primary', ['backgroundColor', 'color', 'borderRadius']),
        secondaryCta: read.styles('.cta-secondary', [
          'backgroundColor',
          'color',
          'borderColor',
          'borderRadius',
        ]),
        productPrice: read.styles('.product-price', ['color', 'fontFamily', 'fontWeight']),
      };
    });

    expect(audit.preset).toBe(theme.preset);
    expect(audit.primaryCta.backgroundColor).toBe(audit.tokens['--color-primary']);
    expect(audit.primaryCta.backgroundColor).not.toBe(audit.tokens['--color-secondary']);
    expect(audit.primaryCta.color).toBe(audit.tokens['--color-text-inverse']);
    expect(audit.primaryCta.borderRadius).toBe('999px');
    expect(audit.secondaryCta.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(audit.secondaryCta.color).toBe(audit.tokens['--color-text-main']);
    expect(audit.secondaryCta.borderColor).toBe(audit.tokens['--color-border']);
    expect(audit.productPrice.color).toBe(audit.tokens['--color-text-main']);
  });
}


test('keeps search filters and result surfaces mapped to the expected UI roles', async ({
  page,
}) => {
  await seedE2ERuntime(
    page,
    createStorefrontConfig({
      preset: 'modern-boutique',
      colors: {
        brandPrimary: '#13579b',
        brandPrimaryStrong: '#0f315f',
        brandSecondary: '#2468ac',
        accent: '#abcdef',
      },
    }),
  );
  await page.goto('/search');

  if (await page.locator('.mobile-filter-toggle').isVisible()) {
    await page.locator('.mobile-filter-toggle').click();
  }

  const midPriceChip = page.getByRole('button', { name: 'Acima de R$ 2.500', exact: true });

  await midPriceChip.click();
  await expect(midPriceChip).toHaveClass(/active/);
  await page.waitForTimeout(250);

  const audit = await page.evaluate(() => {
    const read = createStyleReader();

    return {
      tokens: read.tokens([
        '--color-background',
        '--color-surface',
        '--color-input-border',
        '--color-secondary',
        '--color-text-inverse',
        '--color-primary-dark',
        '--color-text-main',
      ]),
      sidebar: read.styles('.filters-sidebar', ['backgroundColor', 'borderRightColor']),
      resultsPanel: read.styles('.results-panel', ['backgroundColor']),
      searchInput: read.styles('.filter-group input[type="search"]', [
        'backgroundColor',
        'borderColor',
        'color',
      ]),
      activeChip: read.styles('.preset-chip.active', ['backgroundColor', 'borderColor', 'color']),
      activeChipDebug: {
        text: document.querySelector('.preset-chip.active')?.textContent?.trim(),
        className: document.querySelector('.preset-chip.active')?.className,
        style: document.querySelector('.preset-chip.active')?.getAttribute('style'),
      },
      resetLink: read.styles('.clear-filters-link', ['color', 'backgroundColor']),
    };
  });

  expect(audit.sidebar.backgroundColor).toBe(audit.tokens['--color-surface']);
  expect(audit.resultsPanel.backgroundColor).toBe(audit.tokens['--color-background']);
  expect(audit.searchInput.backgroundColor).toBe(audit.tokens['--color-surface']);
  expect(audit.searchInput.borderColor).toBe(audit.tokens['--color-input-border']);
  expect(audit.searchInput.color).toBe(audit.tokens['--color-text-main']);
  expect(audit.activeChipDebug).toEqual({
    text: 'Acima de R$ 2.500',
    className: 'preset-chip active',
    style: null,
  });
  expectRgbToBeClose(audit.activeChip.backgroundColor, audit.tokens['--color-secondary']);
  expectRgbToBeClose(audit.activeChip.borderColor, audit.tokens['--color-secondary']);
  expect(audit.activeChip.color).toBe(audit.tokens['--color-text-inverse']);
  expect(audit.resetLink.color).toBe(audit.tokens['--color-primary-dark']);
  expect(audit.resetLink.backgroundColor).toBe('rgba(0, 0, 0, 0)');
});

test('keeps tenant branding coherent when the logo is absent and brand name must carry identity', async ({
  page,
}) => {
  const config = createStorefrontConfig({
    preset: 'soft-fashion',
    typographyPreset: 'soft-serif',
  });

  config.brand = {
    ...config.brand,
    name: 'Maison Visual QA',
    logoPath: '',
    logoAlt: 'Maison Visual QA',
    homeAriaLabel: 'Maison Visual QA home',
    faviconPath: '',
  };

  await seedE2ERuntime(page, config);
  await page.goto('/products/ring-solitaire');

  await expect(page).toHaveTitle('Maison Visual QA');
  await expect(page.getByRole('link', { name: 'Maison Visual QA home' })).toBeVisible();
  await expect(page.getByText('Maison Visual QA').first()).toBeVisible();

  const audit = await page.evaluate(() => {
    const read = createStyleReader();

    return {
      tokens: read.tokens(['--color-text-main']),
      brandName: read.styles('.brand-name', ['fontFamily', 'fontWeight', 'color']),
      storeLogoCount: document.querySelectorAll('.store-logo').length,
      storeName: read.styles('.store-name', ['color', 'fontWeight']),
      storeInfoLogoBackground: document.querySelector('.store-logo')
        ? read.styles('.store-logo', ['backgroundColor'])
        : null,
    };
  });

  expect(audit.brandName.fontFamily).toContain('Plus Jakarta Sans');
  expect(audit.brandName.color).toBe(audit.tokens['--color-text-main']);
  expect(audit.brandName.fontWeight).toBe('800');
  expect(audit.storeLogoCount).toBe(0);
  expect(audit.storeName.color).toBe(audit.tokens['--color-text-main']);
  expect(audit.storeName.fontWeight).toBe('700');
  expect(audit.storeInfoLogoBackground).toBeNull();
});

async function installStyleReader(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.createStyleReader = () => {
      const normalizeColor = (value: string) => {
        const element = document.createElement('span');

        element.style.color = value;
        document.body.appendChild(element);

        const color = getComputedStyle(element).color;
        element.remove();

        return color;
      };

      const styles = (selector: string, properties: string[]) => {
        const element = document.querySelector(selector);

        if (!element) {
          throw new Error(`Visual audit selector was not found: ${selector}`);
        }

        const computed = getComputedStyle(element);

        return Object.fromEntries(
          properties.map((property) => [property, computed[property as keyof CSSStyleDeclaration]]),
        ) as Record<string, string>;
      };

      const tokens = (names: string[]) => {
        return Object.fromEntries(
          names.map((name) => [
            name,
            normalizeColor(getComputedStyle(document.documentElement).getPropertyValue(name).trim()),
          ]),
        ) as Record<string, string>;
      };

      return { styles, tokens };
    };
  });
}

declare global {
  interface Window {
    createStyleReader: () => {
      styles: (selector: string, properties: string[]) => Record<string, string>;
      tokens: (names: string[]) => Record<string, string>;
    };
  }
}

function expectRgbToBeClose(actual: string, expected: string, tolerance = 5): void {
  const actualChannels = readRgbChannels(actual);
  const expectedChannels = readRgbChannels(expected);

  expect(actualChannels, `Could not parse actual color ${actual}`).not.toBeNull();
  expect(expectedChannels, `Could not parse expected color ${expected}`).not.toBeNull();

  for (let index = 0; index < 3; index++) {
    expect(
      Math.abs(actualChannels![index] - expectedChannels![index]),
      `Expected ${actual} to be within ${tolerance} RGB points of ${expected}`,
    ).toBeLessThanOrEqual(tolerance);
  }
}

function readRgbChannels(value: string): [number, number, number] | null {
  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);

  return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null;
}
