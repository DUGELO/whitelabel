import { TestBed } from '@angular/core/testing';

import { StorefrontAnalyticsService } from './storefront-analytics.service';

describe('StorefrontAnalyticsService', () => {
  let service: StorefrontAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorefrontAnalyticsService);
  });

  it('should record generic analytics events', () => {
    service.track('product_clicked', { productId: 1, productTitle: 'Produto teste' });

    expect(service.events().length).toBe(1);
    expect(service.events()[0].name).toBe('product_clicked');
    expect(service.events()[0].payload.productId).toBe(1);
  });

  it('should deduplicate repeated search no results events', () => {
    service.trackSearchNoResults({ searchTerm: 'vestido', brandName: 'Catalog Flow' });
    service.trackSearchNoResults({ searchTerm: 'vestido', brandName: 'Catalog Flow' });

    expect(service.events().length).toBe(1);
    expect(service.events()[0].name).toBe('search_no_results');
  });
});