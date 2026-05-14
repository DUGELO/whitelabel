import {
  ContactChannel,
  StorefrontCatalogConfig,
  StorefrontContentConfig,
  StorefrontNavigationLink,
  StorefrontSocialLinksConfig,
} from '../../../core/storefront/storefront-config';
import { StorefrontThemeConfig } from '../../../core/theme/models/theme-config.types';

export type AdminTenantId = string;
export type AdminTenantStatus = 'active' | 'inactive' | 'suspended';
export type AdminTenantRole = 'admin' | 'owner' | 'editor' | 'viewer';
export type AdminSettingsSource = 'settings-main' | 'legacy-tenant';

export interface AdminTenantLegacyFields {
  primaryColor?: string;
  secondaryColor?: string;
  instagram?: string;
  whatsapp?: string;
}

export interface AdminTenantDocument extends AdminTenantLegacyFields {
  id: AdminTenantId;
  name: string;
  slug: string;
  status?: AdminTenantStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AdminTenantUserDocument {
  uid: string;
  email: string;
  role: AdminTenantRole;
  active?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AdminProductImage {
  url: string;
  alt?: string;
  order?: number;
  kind?: 'image';
}

export interface AdminProductDocument {
  id: string;
  active: boolean;
  tenantId: AdminTenantId;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  price: number;
  compareAtPrice?: number;
  category?: string;
  tags: string[];
  highlights: string[];
  images: AdminProductImage[];
  rating: number;
  reviewCount: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AdminBrandSettings {
  name: string;
  slug: string;
  logoPath?: string;
  logoAlt?: string;
  homeAriaLabel?: string;
  faviconPath?: string;
  tagline?: string;
  description?: string;
  notFoundImagePath?: string;
}

export interface AdminStorefrontSettingsDocument {
  brand: AdminBrandSettings;
  theme: StorefrontThemeConfig;
  content?: Partial<StorefrontContentConfig>;
  contactChannels: ContactChannel[];
  navigationLinks?: StorefrontNavigationLink[];
  socialLinks: StorefrontSocialLinksConfig;
  catalog: Partial<StorefrontCatalogConfig>;
  primaryContactChannel?: 'whatsapp' | 'instagram';
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AdminSettingsReadResult {
  tenant: AdminTenantDocument;
  settings: AdminStorefrontSettingsDocument;
  source: AdminSettingsSource;
}
