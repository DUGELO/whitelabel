import { TestBed } from '@angular/core/testing';

import { ProductFirestoreService } from '../../core/firebase/product-firestore';
import { ProductCatalogService } from './product-service';

describe('ProductCatalogService', () => {
  let service: ProductCatalogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ProductFirestoreService,
          useValue: {
            getProducts: () =>
              Promise.resolve([
                {
                  id: 'produto-teste',
                  slug: 'produto-teste',
                  title: 'Produto teste',
                  description: 'Descricao teste',
                  price: 120,
                  images: [{ url: 'produto.jpg', alt: 'Produto teste' }],
                  rating: 5,
                  reviewCount: 12,
                },
              ]),
          },
        },
      ],
    });
    service = TestBed.inject(ProductCatalogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose mapped commercial products', async () => {
    await service.loadProducts('tenant-test');

    expect(service.products().length).toBeGreaterThan(0);
    expect(service.products()[0].price.currencyCode).toBe('BRL');
    expect(service.products()[0].title.length).toBeGreaterThan(0);
  });
});
