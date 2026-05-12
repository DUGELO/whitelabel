import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { StorefrontConfigService } from '../../../../core/storefront/storefront-config.service';
import { ProductCard } from './product-card';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;
  let storefrontConfig: StorefrontConfigService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    storefrontConfig = TestBed.inject(StorefrontConfigService);
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

  it('should apply the theme product card variant class from the active theme', async () => {
    const card = fixture.nativeElement.querySelector('.product-card');
    expect(card.classList.contains('product-card--editorial-minimal')).toBe(true);
  });

  it('should react to configured theme product card variant changes', async () => {
    storefrontConfig.config.update((config) => ({
      ...config,
      theme: {
        ...config.theme,
        variants: {
          ...config.theme.variants,
          productCard: 'quiet-luxury',
        },
      },
    }));
    fixture.detectChanges();
    await fixture.whenStable();

    const card = fixture.nativeElement.querySelector('.product-card');
    expect(card.classList.contains('product-card--quiet-luxury')).toBe(true);
  });
});
