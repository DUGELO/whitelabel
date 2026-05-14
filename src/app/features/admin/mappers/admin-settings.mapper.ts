import {
  AdminSettingsReadResult,
  AdminStorefrontSettingsDocument,
  AdminTenantDocument,
} from '../models/admin-firestore.models';

export function mapLegacyTenantToAdminSettings(
  tenant: AdminTenantDocument,
): AdminStorefrontSettingsDocument {
  const contactChannels = [
    tenant.whatsapp
      ? {
          type: 'whatsapp' as const,
          label: 'Atendimento no WhatsApp',
          url: tenant.whatsapp,
        }
      : null,
    tenant.instagram
      ? {
          type: 'instagram' as const,
          label: 'Instagram da loja',
          url: tenant.instagram,
        }
      : null,
  ].filter((channel): channel is NonNullable<typeof channel> => Boolean(channel));

  return {
    brand: {
      name: tenant.name,
      slug: tenant.slug,
      logoAlt: tenant.name,
      homeAriaLabel: `${tenant.name} home`,
    },
    theme: {
      preset: 'editorial-luxury',
      colors: {
        ...(tenant.primaryColor ? { brandPrimary: tenant.primaryColor } : {}),
        ...(tenant.secondaryColor ? { brandSecondary: tenant.secondaryColor } : {}),
      },
    },
    contactChannels,
    socialLinks: {
      instagramUrl: tenant.instagram ?? '',
      whatsappUrl: tenant.whatsapp ?? '',
    },
    catalog: {
      currencyCode: 'BRL',
    },
    primaryContactChannel: tenant.whatsapp ? 'whatsapp' : tenant.instagram ? 'instagram' : undefined,
  };
}

export function buildAdminSettingsReadResult(
  tenant: AdminTenantDocument,
  settings: AdminStorefrontSettingsDocument | null,
): AdminSettingsReadResult {
  if (settings) {
    return {
      tenant,
      settings,
      source: 'settings-main',
    };
  }

  return {
    tenant,
    settings: mapLegacyTenantToAdminSettings(tenant),
    source: 'legacy-tenant',
  };
}
