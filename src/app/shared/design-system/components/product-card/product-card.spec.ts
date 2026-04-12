import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProductCard } from './product-card';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', {
      id: 1,
      title: 'Test product',
      slug: 'test-product',
      shortDescription: 'Short description',
      longDescription: 'Long description',
      imageUrl: 'https://example.com/product.jpg',
      imageAlt: 'Test product image',
      category: 'Main Course',
      tags: ['tag'],
      rating: 4.5,
      reviewCount: 10,
      highlights: ['Highlight'],
      media: [
        {
          src: 'https://example.com/product.jpg',
          alt: 'Test product image',
          kind: 'image',
        },
      ],
      price: {
        amount: 99,
        currencyCode: 'BRL',
      },
      actionLinks: {
        productUrl: '/products/1',
        instagramUrl: 'https://instagram.com/test',
        whatsappUrl: 'https://wa.me/5500000000000',
      },
    });
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply compact variant class', async () => {
    fixture.componentRef.setInput('variant', 'compact');
    fixture.detectChanges();
    await fixture.whenStable();

    const card = fixture.nativeElement.querySelector('.product-card');
    expect(card.classList.contains('product-card--compact')).toBe(true);
  });

  it('should apply side variant class', async () => {
    fixture.componentRef.setInput('variant', 'side');
    fixture.detectChanges();
    await fixture.whenStable();

    const card = fixture.nativeElement.querySelector('.product-card');
    expect(card.classList.contains('product-card--side')).toBe(true);
  });
});
