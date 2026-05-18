import { STOREFRONT_CONFIG, StorefrontConfig } from '../../core/storefront/storefront-config';
import { normalizeWhatsappUrl } from '../../core/storefront/storefront-runtime-config.mapper';
import { Product } from './models';

export function mapToProduct(data: any, storefrontConfig: StorefrontConfig = STOREFRONT_CONFIG): Product {
  const images = data.images ?? [];
  const title = data.title ?? '';

  return {
    id: data.id,
    slug: data.slug,
    title,
    shortDescription: data.description,
    longDescription: data.longDescription ?? data.description,

    imageUrl: images[0]?.url,
    imageAlt: images[0]?.alt ?? title,

    category: data.category,
    tags: data.tags ?? [],
    rating: data.rating ?? 0,
    reviewCount: data.reviewCount ?? 0,

    highlights: data.highlights ?? [],

    media: images.map((img: any) => ({
      src: img.url,
      alt: img.alt ?? title,
      kind: 'image' as const
    })),

    price: {
      amount: data.price,
      compareAtAmount: data.compareAtPrice,
      currencyCode: storefrontConfig.catalog.currencyCode,
    },

    actionLinks: {
      productUrl: `/products/${data.id}`,
      instagramUrl: storefrontConfig.socialLinks.instagramUrl || undefined,
      whatsappUrl: buildWhatsappProductUrl(storefrontConfig, title),
    },
  };
}

function buildWhatsappProductUrl(storefrontConfig: StorefrontConfig, productTitle: string): string {
  const whatsappUrl = normalizeWhatsappUrl(storefrontConfig.socialLinks.whatsappUrl);

  if (!whatsappUrl) {
    return '';
  }

  try {
    const url = new URL(whatsappUrl);
    const message = `${storefrontConfig.catalog.defaultWhatsAppMessage} ${productTitle}`.trim();

    if (message) {
      url.searchParams.set('text', message);
    }

    return url.toString();
  } catch {
    return whatsappUrl;
  }
}
