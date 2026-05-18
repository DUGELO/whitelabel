import { WritableSignal, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { STOREFRONT_CONFIG, StorefrontConfig } from '../../storefront/storefront-config';
import { StorefrontConfigService } from '../../storefront/storefront-config.service';
import { StorefrontThemeConfig } from '../models/theme-config.types';
import { ResolvedTheme } from '../models/theme-runtime.types';
import { CssVariableThemeWriterService } from './css-variable-theme-writer.service';
import { ThemeEngineService } from './theme-engine.service';

describe('ThemeEngineService', () => {
  let service: ThemeEngineService;
  let storefrontConfig: {
    config: WritableSignal<StorefrontConfig>;
  };
  let themeWriter: {
    applyTheme: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    storefrontConfig = {
      config: signal(createStorefrontConfig()),
    };
    themeWriter = {
      applyTheme: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: StorefrontConfigService, useValue: storefrontConfig },
        { provide: CssVariableThemeWriterService, useValue: themeWriter },
      ],
    });

    service = TestBed.inject(ThemeEngineService);
    TestBed.tick();
    themeWriter.applyTheme.mockClear();
  });

  it('should expose resolved tokens and variants from the storefront theme config', () => {
    storefrontConfig.config.set(
      createStorefrontConfig({
        preset: 'modern-boutique',
        typographyPreset: 'modern-sans',
        colors: {
          brandPrimary: '#123456',
        },
        variants: {
          cta: 'quiet-link',
        },
      }),
    );

    expect(service.activeTheme().preset.id).toBe('modern-boutique');
    expect(service.tokens().color.brandPrimary).toBe('#123456');
    expect(service.tokens().color.backgroundCanvas).toBe('#f4f6f3');
    expect(service.tokens().typography.headingWeight).toBe('700');
    expect(service.variants().cta).toBe('quiet-link');
    expect(service.variants().productCard).toBe('boutique-clean');
  });

  it('should initialize the DOM writer with the current resolved theme', () => {
    service.initializeTheme();

    expect(themeWriter.applyTheme).toHaveBeenCalledTimes(1);
    expect(lastWrittenTheme().preset.id).toBe('editorial-luxury');
    expect(lastWrittenTheme().tokens.color.brandPrimary).toBe('#8a6a2d');
    expect(lastWrittenTheme().variants.cta).toBe('solid-premium');
  });

  it('should apply runtime tenant theme changes through the DOM writer', () => {
    storefrontConfig.config.set(
      createStorefrontConfig({
        preset: 'minimal-premium',
        colors: {
          brandPrimary: '#445566',
          brandPrimaryStrong: '#223344',
        },
        variants: {
          productCard: 'quiet-luxury',
        },
      }),
    );

    TestBed.tick();

    expect(themeWriter.applyTheme).toHaveBeenCalledTimes(1);
    expect(lastWrittenTheme().preset.id).toBe('minimal-premium');
    expect(lastWrittenTheme().tokens.color.brandPrimary).toBe('#445566');
    expect(lastWrittenTheme().tokens.color.brandPrimaryStrong).toBe('#223344');
    expect(lastWrittenTheme().variants.productCard).toBe('quiet-luxury');
  });

  it('should leave the latest runtime theme as the final write during rapid tenant switches', () => {
    storefrontConfig.config.set(
      createStorefrontConfig({
        preset: 'minimal-premium',
        colors: {
          brandPrimary: '#101010',
        },
      }),
    );
    storefrontConfig.config.set(
      createStorefrontConfig({
        preset: 'modern-boutique',
        colors: {
          brandPrimary: '#202020',
        },
      }),
    );

    TestBed.tick();

    expect(lastWrittenTheme().preset.id).toBe('modern-boutique');
    expect(lastWrittenTheme().tokens.color.brandPrimary).toBe('#202020');
    expect(service.activeTheme().preset.id).toBe('modern-boutique');
  });

  function lastWrittenTheme(): ResolvedTheme {
    return themeWriter.applyTheme.mock.calls.at(-1)?.[0] as ResolvedTheme;
  }
});

describe('ThemeEngineService with real DOM writer', () => {
  let service: ThemeEngineService;
  let storefrontConfig: StorefrontConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    clearRootThemeState();

    service = TestBed.inject(ThemeEngineService);
    storefrontConfig = TestBed.inject(StorefrontConfigService);
    TestBed.tick();
  });

  afterEach(() => {
    storefrontConfig.resetToDefaultConfig();
    clearRootThemeState();
  });

  it('should update document variables when runtime config changes after initialization', () => {
    service.initializeTheme();

    storefrontConfig.applyRuntimeConfig(
      createStorefrontConfig({
        preset: 'modern-boutique',
        colors: {
          brandPrimary: '#778899',
        },
      }),
    );
    TestBed.tick();

    expect(document.documentElement.dataset['themePreset']).toBe('modern-boutique');
    expect(document.documentElement.style.getPropertyValue('--color-brand-primary')).toBe(
      '#778899',
    );
    expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#778899');
    expect(document.documentElement.style.getPropertyValue('--color-background-canvas')).toBe(
      '#f4f6f3',
    );
  });

  it('should not let an earlier tenant update overwrite the final document theme', () => {
    storefrontConfig.applyRuntimeConfig(
      createStorefrontConfig({
        preset: 'minimal-premium',
        colors: {
          brandPrimary: '#111111',
        },
      }),
    );
    storefrontConfig.applyRuntimeConfig(
      createStorefrontConfig({
        preset: 'dark-elegance',
        colors: {
          brandPrimary: '#222222',
        },
      }),
    );

    TestBed.tick();

    expect(document.documentElement.dataset['themePreset']).toBe('dark-elegance');
    expect(document.documentElement.style.getPropertyValue('--color-brand-primary')).toBe(
      '#222222',
    );
    expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#222222');
    expect(document.documentElement.getAttribute('style')).not.toContain('#111111');
  });
});

function createStorefrontConfig(
  theme: StorefrontThemeConfig = STOREFRONT_CONFIG.theme,
): StorefrontConfig {
  return {
    ...STOREFRONT_CONFIG,
    theme,
  };
}

function clearRootThemeState(): void {
  const root = document.documentElement;

  root.removeAttribute('data-theme-preset');

  for (let index = root.style.length - 1; index >= 0; index--) {
    const propertyName = root.style.item(index);

    if (propertyName.startsWith('--')) {
      root.style.removeProperty(propertyName);
    }
  }
}
