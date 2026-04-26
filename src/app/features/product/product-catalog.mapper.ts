import { StorefrontConfig } from '../../core/storefront/storefront-config';
import { CatalogSeedItem } from './catalog-seed-item.model';
import { Product } from './models';

export function mapCatalogSeedToProducts(source: CatalogSeedItem[], config: StorefrontConfig): Product[] {
  return source.map((item) => {
    const encodedMessage = encodeURIComponent(`${config.catalog.defaultWhatsAppMessage} ${item.name}`);

    return {
      id: item.id,
      slug: item.slug,
      title: item.name,
      shortDescription: item.description,
      longDescription: item.longDescription ?? item.description,
      imageUrl: item.imgUrl,
      imageAlt: item.imageAlt ?? item.name,
      category: item.category,
      tags: item.tags ?? [],
      rating: item.rating,
      reviewCount: item.reviewCount,
      highlights: item.highlights ?? [item.category].filter((v): v is string => Boolean(v)).slice(0, 5),
      media: [
        {
          src: item.imgUrl,
          alt: item.imageAlt ?? item.name,
          kind: 'image' as const,
        },
        ...(item.gallery ?? []).map(img => ({
          src: img.url,
          alt: img.alt ?? item.name,
          kind: 'image' as const
        }))
      ],
      price: {
        amount: item.price,
        compareAtAmount: item.compareAtPrice,
        currencyCode: config.catalog.currencyCode,
      },
      actionLinks: {
        productUrl: `${config.catalog.baseProductUrl}/${item.slug}`,
        instagramUrl: config.socialLinks.instagramUrl || undefined,
        whatsappUrl: config.socialLinks.whatsappUrl
          ? `${config.socialLinks.whatsappUrl}${config.socialLinks.whatsappUrl.includes('?') ? '&' : '?'}text=${encodedMessage}`
          : '',
      },
    };
  });
}