import { TestBed } from '@angular/core/testing';

import { StorefrontConfigService } from '../../storefront/storefront-config.service';
import { ThemeEngineService } from './theme-engine.service';

describe('ThemeEngineService', () => {
  let service: ThemeEngineService;
  let storefrontConfig: StorefrontConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeEngineService);
    storefrontConfig = TestBed.inject(StorefrontConfigService);
  });

  it('should expose the resolved active theme from storefront configuration', () => {
    expect(service.activeTheme().preset.id).toBe(storefrontConfig.config().theme.preset);
    expect(service.tokens().color.brandPrimary).toBe('#8a6a2d');
  });

  it('should apply semantic and legacy CSS variables at runtime', () => {
    service.initializeTheme();

    expect(document.documentElement.dataset['themePreset']).toBe('editorial-luxury');
    expect(document.documentElement.style.getPropertyValue('--color-brand-primary')).toBe(
      '#8a6a2d',
    );
    expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#8a6a2d');
    expect(document.documentElement.style.getPropertyValue('--motion-medium')).toBe('250ms');
  });
});
