import { Component, computed, effect, inject, signal } from '@angular/core';
import { StorefrontAnalyticsService } from '../../../core/observability/storefront-analytics.service';
import { ProductSortOption } from '../models';
import { ProductCatalogService } from '../product-service';
import { StorefrontConfigService } from '../../../core/storefront/storefront-config.service';
import { ProductCard } from '../../../shared/design-system/components/product-card/product-card';

@Component({
  selector: 'app-search-results',
  imports: [ProductCard],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
})
export class SearchResults {
  protected readonly productService = inject(ProductCatalogService);
  protected readonly storefrontConfig = inject(StorefrontConfigService).config;
  private readonly analyticsService = inject(StorefrontAnalyticsService);

  protected readonly mobileFiltersOpen = signal(false);
  protected readonly categoryOptions = this.productService.availableCategories;
  protected readonly sortOptions = computed(() => [
    { value: 'popular' as ProductSortOption, label: this.storefrontConfig().content.sortPopularLabel },
    { value: 'lowest-price' as ProductSortOption, label: this.storefrontConfig().content.sortLowestPriceLabel },
    { value: 'highest-rated' as ProductSortOption, label: this.storefrontConfig().content.sortHighestRatedLabel },
  ]);

  protected readonly results = this.productService.visibleProducts;
  protected readonly selectedCategories = this.productService.selectedCategories;
  protected readonly minPrice = this.productService.minPrice;
  protected readonly selectedSort = this.productService.sortOption;
  protected readonly priceRangeMin = computed(() => this.storefrontConfig().catalog.priceRangeMin);
  protected readonly priceRangeMax = computed(() => this.storefrontConfig().catalog.priceRangeMax);
  protected readonly pricePresetMidValue = computed(() => this.storefrontConfig().catalog.pricePresetMidValue);
  protected readonly pricePresetHighValue = computed(() => this.storefrontConfig().catalog.pricePresetHighValue);

  protected readonly totalResultsLabel = computed(() => `${this.results().length} ${this.storefrontConfig().content.resultsCountSuffix}`);

  protected readonly priceRangePercent = computed(() =>
    ((this.minPrice() - this.priceRangeMin()) / (this.priceRangeMax() - this.priceRangeMin())) * 100
  );

  protected readonly formattedPriceRangeMinLabel = computed(() => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: this.storefrontConfig().catalog.currencyCode,
    }).format(this.priceRangeMin());
  });

  protected readonly formattedPriceRangeMaxLabel = computed(() => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: this.storefrontConfig().catalog.currencyCode,
    }).format(this.priceRangeMax());
  });

  protected readonly formattedMinPrice = computed(() => {
    const value = this.minPrice();
    return value === this.priceRangeMin()
      ? this.storefrontConfig().content.pricePresetAllLabel
      : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: this.storefrontConfig().catalog.currencyCode }).format(value);
  });

  constructor() {
    effect(() => {
      const resultsCount = this.results().length;
      const searchTerm = this.productService.searchTerm().trim();
      const hasFilters = this.productService.hasActiveFilters();

      if (resultsCount === 0 && (searchTerm.length > 0 || hasFilters)) {
        this.analyticsService.trackSearchNoResults({
          brandName: this.storefrontConfig().brand.name,
          searchTerm,
          channel: 'search',
        });
      }
    });
  }

  protected setMinPrice(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.productService.setMinPrice(Number(input.value));
  }

  protected applyPricePreset(value: number): void {
    this.productService.applyPricePreset(value);
  }

  protected toggleCategory(category: string): void {
    this.productService.toggleCategory(category);
  }

  protected setSortOption(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.productService.setSortOption(select.value as ProductSortOption);
  }

  protected isCategorySelected(category: string): boolean {
    return this.selectedCategories().includes(category);
  }

  protected resetSearchExperience(): void {
    this.productService.clearSearchExperience();
  }

  protected toggleMobileFilters(): void {
    this.mobileFiltersOpen.update((open) => !open);
  }
}
