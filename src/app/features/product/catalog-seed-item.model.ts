export interface CatalogSeedItem {
  id: number;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  imgUrl: string;
  imageAlt?: string;
  price: number;
  compareAtPrice?: number;
  category?: string;
  tags?: string[];
  rating: number;
  reviewCount: number;
  highlights?: string[];
}
