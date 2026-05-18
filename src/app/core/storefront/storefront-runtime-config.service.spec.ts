import { TestBed } from '@angular/core/testing';

import { STOREFRONT_CONFIG } from './storefront-config';
import { StorefrontRuntimeConfigService } from './storefront-runtime-config.service';

describe('StorefrontRuntimeConfigService', () => {
  let service: StorefrontRuntimeConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorefrontRuntimeConfigService);
  });

  afterEach(() => {
    deleteE2ERuntimeOverrides();
  });

  it('should use the default storefront config without remote reads in local E2E runtime', async () => {
    const runtime = globalThis as typeof globalThis & {
      __WHITE_LABEL_E2E__?: boolean;
    };

    runtime.__WHITE_LABEL_E2E__ = true;

    await expect(service.loadConfig()).resolves.toEqual(STOREFRONT_CONFIG);
  });

  it('should use an explicitly seeded storefront config in local E2E runtime', async () => {
    const runtime = globalThis as typeof globalThis & {
      __WHITE_LABEL_E2E__?: boolean;
      __WHITE_LABEL_E2E_STOREFRONT_CONFIG__?: unknown;
    };
    const seededConfig = {
      ...STOREFRONT_CONFIG,
      tenantId: 'e2e-tenant',
      brand: {
        ...STOREFRONT_CONFIG.brand,
        name: 'Loja E2E',
      },
    };

    runtime.__WHITE_LABEL_E2E__ = true;
    runtime.__WHITE_LABEL_E2E_STOREFRONT_CONFIG__ = seededConfig;

    await expect(service.loadConfig()).resolves.toEqual(seededConfig);
  });
});

function deleteE2ERuntimeOverrides(): void {
  const runtime = globalThis as typeof globalThis & {
    __WHITE_LABEL_E2E__?: boolean;
    __WHITE_LABEL_E2E_STOREFRONT_CONFIG__?: unknown;
  };

  delete runtime.__WHITE_LABEL_E2E__;
  delete runtime.__WHITE_LABEL_E2E_STOREFRONT_CONFIG__;
}
