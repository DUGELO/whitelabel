import { TestBed } from '@angular/core/testing';

import { ProductFirestoreService } from './product-firestore';

describe('ProductFirestoreService', () => {
  let service: ProductFirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductFirestoreService);
  });

  afterEach(() => {
    deleteE2ERuntimeOverrides();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return locally seeded products when the localhost E2E runtime is enabled', async () => {
    const runtime = globalThis as typeof globalThis & {
      __WHITE_LABEL_E2E__?: boolean;
      __WHITE_LABEL_E2E_PRODUCTS__?: unknown;
    };

    runtime.__WHITE_LABEL_E2E__ = true;
    runtime.__WHITE_LABEL_E2E_PRODUCTS__ = [
      { id: 'product-1', title: 'Produto seguro' },
      { title: 'sem id' },
      null,
    ];

    await expect(service.getProducts('whitelabel')).resolves.toEqual([
      { id: 'product-1', title: 'Produto seguro' },
    ]);
  });
});

function deleteE2ERuntimeOverrides(): void {
  const runtime = globalThis as typeof globalThis & {
    __WHITE_LABEL_E2E__?: boolean;
    __WHITE_LABEL_E2E_PRODUCTS__?: unknown;
  };

  delete runtime.__WHITE_LABEL_E2E__;
  delete runtime.__WHITE_LABEL_E2E_PRODUCTS__;
}
