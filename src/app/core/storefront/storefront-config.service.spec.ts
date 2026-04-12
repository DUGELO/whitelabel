import { TestBed } from '@angular/core/testing';

import { StorefrontConfigService } from './storefront-config.service';

describe('StorefrontConfigService', () => {
  let service: StorefrontConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorefrontConfigService);
  });

  it('should expose the storefront configuration', () => {
    expect(service.config().brand.name).toBe('Catalog Flow');
    expect(service.config().content.primaryCtaLabel).toBe('Comprar no WhatsApp');
    expect(service.config().contactChannels.length).toBeGreaterThan(0);
  });

  it('should apply branding tokens to the document', () => {
    service.initializeBranding();

    expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe(service.config().theme.primaryColor);
    expect(document.title).toBe(service.config().brand.name);

    const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
    expect(favicon?.href).toContain(service.config().brand.faviconPath);
  });
});