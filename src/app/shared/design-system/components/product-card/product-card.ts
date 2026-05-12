import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { StorefrontAnalyticsService } from '../../../../core/observability/storefront-analytics.service';
import { StorefrontConfigService } from '../../../../core/storefront/storefront-config.service';
import { ThemeEngineService } from '../../../../core/theme/services/theme-engine.service';
import { Product } from '../../../../features/product/models';

type ProductCardLayoutVariant = 'default' | 'compact' | 'side';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  private readonly analyticsService = inject(StorefrontAnalyticsService);
  private readonly themeEngine = inject(ThemeEngineService);
  protected readonly storefrontConfig = inject(StorefrontConfigService).config;
  product = input.required<Product>();
  variant = input<ProductCardLayoutVariant>('default');
  protected readonly themeVariant = computed(() => this.themeEngine.variants().productCard);

  protected formatPrice(product: Product): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: product.price.currencyCode,
    }).format(product.price.amount);
  }

  protected formatCompareAtPrice(product: Product): string {
    if (!product.price.compareAtAmount) {
      return '';
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: product.price.currencyCode,
    }).format(product.price.compareAtAmount);
  }

  protected trackProductClick(product: Product): void {
    this.analyticsService.track('product_clicked', {
      productId: product.id,
      productSlug: product.slug,
      productTitle: product.title,
      channel: 'card',
    });
  }
}
