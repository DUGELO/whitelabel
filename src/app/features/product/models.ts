export type ProductCategory = string;

export interface ProductMedia {
  src: string;
  alt: string;
  kind: 'image';
}

export interface ProductPrice {
  amount: number;
  currencyCode: string;
  compareAtAmount?: number;
}

export interface ProductActionLinks {
  productUrl?: string;
  whatsappUrl: string;
  instagramUrl?: string;
}

export interface Product {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  imageUrl: string;
  imageAlt: string;
  category?: ProductCategory;
  tags: string[];
  rating: number;
  reviewCount: number;
  highlights: string[];
  media: ProductMedia[];
  price: ProductPrice;
  actionLinks: ProductActionLinks;
}

export type ProductSortOption = 'popular' | 'lowest-price' | 'highest-rated';