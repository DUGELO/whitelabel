import { Product } from './models';

export function mapToProduct(data: any): Product {
  const images = data.images ?? [];

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    shortDescription: data.description,
    longDescription: data.longDescription ?? data.description,

    imageUrl: images[0]?.url,
    imageAlt: images[0]?.alt ?? data.title,

    category: data.category,
    tags: data.tags ?? [],
    rating: data.rating ?? 0,
    reviewCount: data.reviewCount ?? 0,

    highlights: data.highlights ?? [],

    media: images.map((img: any) => ({
      src: img.url,
      alt: img.alt ?? data.title,
      kind: 'image' as const
    })),

    price: {
      amount: data.price,
      compareAtAmount: data.compareAtPrice,
      currencyCode: 'BRL' // fixo por enquanto
    },

    actionLinks: {
      productUrl: `/produto/${data.slug}`,
      instagramUrl: undefined,
      whatsappUrl: ''
    },
  };
}