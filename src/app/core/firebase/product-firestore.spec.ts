import { TestBed } from '@angular/core/testing';

import { ProductFirestore } from './product-firestore';

describe('ProductFirestore', () => {
  let service: ProductFirestore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductFirestore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
