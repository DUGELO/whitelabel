import { Component, computed, effect, inject } from '@angular/core';
import { StorefrontAnalyticsService } from '../../../core/observability/storefront-analytics.service';
import { RouterLink } from '@angular/router';
import { StorefrontConfigService } from '../../../core/storefront/storefront-config.service';
import { Product } from '../models';
import { ProductCatalogService } from '../product-service';
import { ProductCard } from '../../../shared/design-system/components/product-card/product-card';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  protected readonly storefrontConfig = inject(StorefrontConfigService).config;
  protected readonly catalogService = inject(ProductCatalogService);
  private readonly analyticsService = inject(StorefrontAnalyticsService);
  private hasTrackedCatalogLoad = false;

  constructor() {
    effect(() => {
      if (!this.hasTrackedCatalogLoad && this.catalogService.products().length > 0) {
        this.hasTrackedCatalogLoad = true;
        this.catalogService.trackCatalogLoaded();
      }
    });
  }

  protected readonly heroProduct = computed(() => {
    return this.catalogService.products()[0] ?? null;
  });

  protected readonly quickPicks = computed(() => {
    const hero = this.heroProduct();
    return this.selectProducts(this.catalogService.products(), 2, hero ? [hero.id] : []);
  });

  protected readonly popularProducts = computed(() => {
    const hero = this.heroProduct();
    const excludeIds = new Set<number>();
    if (hero) {
      excludeIds.add(hero.id);
    }

    this.quickPicks().forEach((product) => excludeIds.add(product.id));
    return this.selectProducts(this.catalogService.products(), 5, Array.from(excludeIds));
  });

  protected trackProductClick(product: Product, channel: 'hero' | 'quick-pick' | 'popular'): void {
    this.analyticsService.track('product_clicked', {
      productId: product.id,
      productSlug: product.slug,
      productTitle: product.title,
      brandName: this.storefrontConfig().brand.name,
      channel,
    });
  }

  private selectProducts(products: Product[], amount: number, excludedIds: number[] = []): Product[] {
    const selected: Product[] = [];
    const seenIds = new Set<number>(excludedIds);
    const pool = [...products];

    for (const product of pool) {
      if (seenIds.has(product.id)) {
        continue;
      }

      seenIds.add(product.id);
      selected.push(product);

      if (selected.length === amount) {
        break;
      }
    }

    return selected;
  }
}
