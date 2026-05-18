import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { ResolvedTheme } from '../models/theme-runtime.types';
import { resolveThemeTokens } from '../resolvers/resolve-theme-tokens';
import { buildThemeCssVariables } from '../tokens/theme-css-vars';
import { CssVariableThemeWriterService } from './css-variable-theme-writer.service';

describe('CssVariableThemeWriterService', () => {
  let service: CssVariableThemeWriterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CssVariableThemeWriterService);
    clearRootThemeState();
  });

  afterEach(() => {
    clearRootThemeState();
  });

  it('should write semantic, legacy and typography variables to the document root', () => {
    const theme = resolveThemeTokens({
      preset: 'modern-boutique',
      colors: {
        brandPrimary: '#123456',
        accent: '#abcdef',
      },
      typographyPreset: 'modern-sans',
    });

    service.applyTheme(theme);

    const root = document.documentElement;

    expect(root.dataset['themePreset']).toBe('modern-boutique');
    expect(root.style.getPropertyValue('--color-brand-primary')).toBe('#123456');
    expect(root.style.getPropertyValue('--color-primary')).toBe('#123456');
    expect(root.style.getPropertyValue('--color-accent')).toBe('#abcdef');
    expect(root.style.getPropertyValue('--font-heading')).toContain('Plus Jakarta Sans');
    expect(root.style.getPropertyValue('--spacing-2xl')).toBe('40px');
    expect(root.style.getPropertyValue('--motion-medium')).toBe('250ms');
  });

  it('should replace old theme values when a different tenant theme is applied', () => {
    service.applyTheme(
      resolveThemeTokens({
        preset: 'editorial-luxury',
        colors: {
          brandPrimary: '#111111',
          brandSecondary: '#222222',
        },
      }),
    );

    service.applyTheme(
      resolveThemeTokens({
        preset: 'modern-boutique',
        colors: {
          brandPrimary: '#333333',
          brandSecondary: '#444444',
        },
      }),
    );

    const root = document.documentElement;

    expect(root.dataset['themePreset']).toBe('modern-boutique');
    expect(root.style.getPropertyValue('--color-brand-primary')).toBe('#333333');
    expect(root.style.getPropertyValue('--color-primary')).toBe('#333333');
    expect(root.style.getPropertyValue('--color-brand-secondary')).toBe('#444444');
    expect(root.style.getPropertyValue('--color-secondary')).toBe('#444444');
    expect(root.getAttribute('style')).not.toContain('#111111');
    expect(root.getAttribute('style')).not.toContain('#222222');
  });

  it('should be idempotent when the same theme is applied repeatedly', () => {
    const theme = resolveThemeTokens({ preset: 'editorial-luxury' });
    const expectedVariableCount = Object.keys(buildThemeCssVariables(theme)).length;

    service.applyTheme(theme);
    service.applyTheme(theme);

    const appliedVariableNames = getRootCssVariableNames();

    expect(appliedVariableNames).toHaveLength(expectedVariableCount);
    expect(new Set(appliedVariableNames).size).toBe(expectedVariableCount);
    expect(document.documentElement.dataset['themePreset']).toBe('editorial-luxury');
  });

  it('should remove invalid runtime variable values instead of writing strings or preserving stale values', () => {
    service.applyTheme(
      resolveThemeTokens({
        preset: 'editorial-luxury',
        colors: {
          brandPrimary: '#515151',
          accent: '#616161',
        },
      }),
    );

    const invalidTheme = withCorruptedColorTokens(resolveThemeTokens({ preset: 'editorial-luxury' }));

    service.applyTheme(invalidTheme);

    const root = document.documentElement;

    expect(root.style.getPropertyValue('--color-brand-primary')).toBe('');
    expect(root.style.getPropertyValue('--color-primary')).toBe('');
    expect(root.style.getPropertyValue('--color-accent')).toBe('');
    expect(root.getAttribute('style')).not.toContain('undefined');
    expect(root.getAttribute('style')).not.toContain('null');
    expect(root.getAttribute('style')).not.toContain('#515151');
    expect(root.getAttribute('style')).not.toContain('#616161');
  });

  it('should no-op when the injected document has no root element', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DOCUMENT,
          useValue: { documentElement: null },
        },
      ],
    });

    const writer = TestBed.inject(CssVariableThemeWriterService);

    expect(() =>
      writer.applyTheme(resolveThemeTokens({ preset: 'editorial-luxury' })),
    ).not.toThrow();
  });
});

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

function getRootCssVariableNames(): string[] {
  const style = document.documentElement.style;
  const names: string[] = [];

  for (let index = 0; index < style.length; index++) {
    const propertyName = style.item(index);

    if (propertyName.startsWith('--')) {
      names.push(propertyName);
    }
  }

  return names;
}

function withCorruptedColorTokens(theme: ResolvedTheme): ResolvedTheme {
  return {
    ...theme,
    tokens: {
      ...theme.tokens,
      color: {
        ...theme.tokens.color,
        brandPrimary: undefined as unknown as string,
        accent: null as unknown as string,
      },
    },
  };
}
