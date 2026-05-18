import { expect, test as base } from '@playwright/test';

import { seedE2ERuntime } from './support/e2e-runtime';

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
  await seedE2ERuntime(page);
});

test('applies storefront theme variables and renders the seeded catalog', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('data-theme-preset', 'editorial-luxury');
  await expect(page.locator('.feature-card h1')).toHaveText('Anel Solitario Aurora');
  await expect(page.getByRole('heading', { name: 'Produtos em destaque' })).toBeVisible();
  await expect(page.locator('app-product-card .product-card')).toHaveCount(3);

  const themeState = await page.evaluate(() => {
    const root = document.documentElement;
    const style = getComputedStyle(root);

    return {
      brandPrimary: style.getPropertyValue('--color-brand-primary').trim(),
      legacyPrimary: style.getPropertyValue('--color-primary').trim(),
      motionMedium: style.getPropertyValue('--motion-medium').trim(),
      styleAttribute: root.getAttribute('style') ?? '',
    };
  });

  expect(themeState.brandPrimary).toBe('#8a6a2d');
  expect(themeState.legacyPrimary).toBe('#8a6a2d');
  expect(themeState.motionMedium).toBe('250ms');
  expect(themeState.styleAttribute).not.toContain('undefined');
  expect(themeState.styleAttribute).not.toContain('null');
  await expect(page.locator('.product-card').first()).toHaveClass(/product-card--editorial-minimal/);
});

test('keeps product detail conversion links and related products working', async ({ page }) => {
  await page.goto('/products/ring-solitaire');

  await expect(page.getByRole('heading', { name: 'Anel Solitario Aurora' })).toBeVisible();
  await expect(page.locator('.product-price')).toContainText(/R\$\s*3\.500,00/);
  await expect(page.getByText('Diamante certificado')).toBeVisible();

  const whatsappHref = await page
    .getByRole('link', { name: /Comprar no WhatsApp/ })
    .getAttribute('href');
  const whatsappUrl = new URL(whatsappHref ?? '');

  expect(whatsappUrl.origin + whatsappUrl.pathname).toBe('https://wa.me/5598984655819');
  expect(whatsappUrl.searchParams.get('text')).toBe(
    'Ola! Tenho interesse neste produto: Anel Solitario Aurora',
  );
  await expect(page.getByRole('heading', { name: 'Outros produtos da loja' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Pulseira Tennis Luz', exact: true })).toBeVisible();
});

test('filters, sorts and resets search results without losing theme state', async ({ page }) => {
  await page.goto('/search');

  await expect(page.locator('.results-toolbar h2')).toHaveText('4 produtos');

  if (await page.locator('.mobile-filter-toggle').isVisible()) {
    await page.locator('.mobile-filter-toggle').click();
  }

  await page.getByRole('searchbox', { name: /Buscar por nome/ }).fill('pulseira');

  await expect(page.locator('.results-toolbar h2')).toHaveText('1 produtos');
  await expect(page.getByRole('link', { name: 'Pulseira Tennis Luz', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Anel Solitario Aurora', exact: true })).toHaveCount(
    0,
  );

  await page.locator('.preset-chip', { hasText: 'Todos' }).click();
  await page.locator('.clear-filters-link').click();

  await expect(page.locator('.results-toolbar h2')).toHaveText('4 produtos');
  await expect(page.locator('html')).toHaveAttribute('data-theme-preset', 'editorial-luxury');
});

test('renders safe product-not-found recovery instead of a broken detail page', async ({ page }) => {
  await page.goto('/products/produto-inexistente');

  await expect(page.getByRole('heading', { name: 'Este produto nao esta disponivel na vitrine.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explorar produtos' })).toHaveAttribute('href', '/');

  await page.getByRole('link', { name: 'Explorar produtos' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.locator('.feature-card h1')).toHaveText('Anel Solitario Aurora');
});
