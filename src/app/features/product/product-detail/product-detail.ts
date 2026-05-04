import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { StorefrontAnalyticsService } from '../../../core/observability/storefront-analytics.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { StorefrontConfigService } from '../../../core/storefront/storefront-config.service';
import { Product } from '../models';
import { ProductCatalogService } from '../product-service';
import { ProductNotFound } from './product-not-found/product-not-found';
import { ProductCard } from '../../../shared/design-system/components/product-card/product-card';
import { MatChipsModule } from '@angular/material/chips';
import { ProductGallery } from "../../../shared/design-system/components/product-gallery/product-gallery";

@Component({
  selector: 'app-product-detail',
  imports: [ProductNotFound, ProductCard, MatChipsModule, ProductGallery],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(ProductCatalogService);
  private readonly params = toSignal(this.route.paramMap);
  private readonly analyticsService = inject(StorefrontAnalyticsService);
  protected readonly storefrontConfig = inject(StorefrontConfigService).config;

  protected readonly id = computed(() => this.params()?.get('id'));
  protected readonly productById = computed(() => this.service.products().find((product) => product.id === this.id()));


  constructor() {}

  ngOnInit() {
    console.log('id ',this.id, ' service :', this.service.products(), 'comparação ', this.service.products().find((product) => product.id === this.id()) )
  }
  protected readonly relatedProducts = computed(() => {
    const current = this.productById();
    if (!current) return [];
    return this.service.products()
      .filter((product) => product.id !== current.id)
      .slice(0, 6);
  });

  protected getProductImages(product: Product) {
    return product.media
      .filter(m => m.kind === 'image')
      .map(m => ({
        url: m.src,
        alt: m.alt
      }));
  }

  protected formatPrice(product: Product): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: product.price.currencyCode,
    }).format(product.price.amount);
  }

  protected formatRating(product: Product): string {
    return product.rating.toFixed(1);
  }

  protected formatReviewCount(product: Product): string {
    return product.reviewCount >= 1000
      ? `${(product.reviewCount / 1000).toFixed(1)}k`
      : `${product.reviewCount}`;
  }

  protected trackPrimaryCta(product: Product): void {
    this.analyticsService.track('primary_cta_clicked', {
      productId: product.id,
      productSlug: product.slug,
      productTitle: product.title,
      brandName: this.storefrontConfig().brand.name,
      channel: 'whatsapp',
    });
    this.analyticsService.track('whatsapp_clicked', {
      productId: product.id,
      productSlug: product.slug,
      productTitle: product.title,
      brandName: this.storefrontConfig().brand.name,
      channel: 'whatsapp',
    });
  }

  protected trackSecondaryCta(product: Product): void {
    this.analyticsService.track('secondary_cta_clicked', {
      productId: product.id,
      productSlug: product.slug,
      productTitle: product.title,
      brandName: this.storefrontConfig().brand.name,
      channel: 'instagram',
    });
    this.analyticsService.track('instagram_clicked', {
      productId: product.id,
      productSlug: product.slug,
      productTitle: product.title,
      brandName: this.storefrontConfig().brand.name,
      channel: 'instagram',
    });
  }
}
