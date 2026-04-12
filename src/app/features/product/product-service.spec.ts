import { TestBed } from '@angular/core/testing';

import { ProductCatalogService } from './product-service';

describe('ProductCatalogService', () => {
  let service: ProductCatalogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductCatalogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose mapped commercial products', () => {
    expect(service.products().length).toBeGreaterThan(0);
    expect(service.products()[0].price.currencyCode).toBe('BRL');
    expect(service.products()[0].title.length).toBeGreaterThan(0);
  });
});
