import { Injectable, computed, inject, signal } from '@angular/core';
import { StorefrontAnalyticsService } from '../../core/observability/storefront-analytics.service';
import { StorefrontConfigService } from '../../core/storefront/storefront-config.service';
import { mapCatalogSeedToProducts } from './product-catalog.mapper';
import { Product, ProductSortOption } from './models';

@Injectable({
  providedIn: 'root',
})
export class ProductCatalogService {
  private readonly storefrontConfigService = inject(StorefrontConfigService);
  private readonly analyticsService = inject(StorefrontAnalyticsService);
  private readonly storefrontConfig = this.storefrontConfigService.config;
  private readonly defaultMinPrice = this.storefrontConfig().catalog.priceRangeMin;

  // STATE
  readonly products = signal<Product[]>(mapCatalogSeedToProducts(this.storefrontConfig().productCatalog, this.storefrontConfig()));

  readonly searchTerm = signal('');
  readonly minPrice = signal(this.defaultMinPrice);
  readonly selectedCategories = signal<string[]>([]);
  readonly sortOption = signal<ProductSortOption>('popular');

  readonly availableCategories = computed(() => {
    return Array.from(
      new Set(
        this.products()
          .flatMap((product) => product.category ? [product.category] : [])
          .sort((left, right) => left.localeCompare(right))
      )
    );
  });

  readonly hasActiveFilters = computed(() => {
    return this.minPrice() > this.defaultMinPrice
      || this.selectedCategories().length > 0;
  });

  readonly isSearchView = computed(() => {
    return this.searchTerm().trim().length > 0 || this.hasActiveFilters();
  });

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const minPrice = this.minPrice();
    const selectedCategories = this.selectedCategories();

    return this.products().filter((product) => {
      const matchesTerm = !term
        || product.title.toLowerCase().includes(term)
        || product.shortDescription.toLowerCase().includes(term)
        || product.tags.some((tag) => tag.toLowerCase().includes(term));

      const matchesPrice = product.price.amount >= minPrice;
      const matchesCategory = selectedCategories.length === 0
        || (product.category ? selectedCategories.includes(product.category) : false);

      return matchesTerm && matchesPrice && matchesCategory;
    });
  });

  readonly visibleProducts = computed(() => {
    const products = [...this.filteredProducts()];
    const sortOption = this.sortOption();

    if (sortOption === 'lowest-price') {
      return products.sort((left, right) => left.price.amount - right.price.amount);
    }

    if (sortOption === 'highest-rated') {
      return products.sort((left, right) => right.rating - left.rating || right.reviewCount - left.reviewCount);
    }

    return products.sort((left, right) => right.reviewCount - left.reviewCount || right.rating - left.rating);
  });


  // HANDLERS
  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  setMinPrice(value: number): void {
    this.minPrice.set(value);
  }

  toggleCategory(category: string): void {
    this.selectedCategories.update((categories) => {
      if (categories.includes(category)) {
        return categories.filter((item) => item !== category);
      }

      return [...categories, category];
    });
  }

  setSortOption(option: ProductSortOption): void {
    this.sortOption.set(option);
  }

  applyPricePreset(value: number): void {
    this.minPrice.set(value);
  }

  clearSearchExperience(): void {
    this.searchTerm.set('');
    this.minPrice.set(this.defaultMinPrice);
    this.selectedCategories.set([]);
    this.sortOption.set('popular');
  }

  trackCatalogLoaded(): void {
    this.analyticsService.track('catalog_loaded', {
      brandName: this.storefrontConfig().brand.name,
    });
  }

  trackCatalogLoadError(): void {
    this.analyticsService.track('catalog_load_error', {
      brandName: this.storefrontConfig().brand.name,
    });
  }
}
