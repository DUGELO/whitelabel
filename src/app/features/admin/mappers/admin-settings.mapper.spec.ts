import { mapLegacyTenantToAdminSettings } from './admin-settings.mapper';

describe('mapLegacyTenantToAdminSettings', () => {
  it('should build target settings from legacy tenant fields', () => {
    const settings = mapLegacyTenantToAdminSettings({
      id: 'whitelabel',
      name: 'Atelier Aurea',
      slug: 'atelier-aurea',
      primaryColor: '#8a6a2d',
      secondaryColor: '#b99668',
      instagram: 'https://instagram.com/atelieraurea',
      whatsapp: 'https://wa.me/5598984655819',
    });

    expect(settings.brand.name).toBe('Atelier Aurea');
    expect(settings.theme.preset).toBe('editorial-luxury');
    expect(settings.theme.colors?.brandPrimary).toBe('#8a6a2d');
    expect(settings.socialLinks.whatsappUrl).toBe('https://wa.me/5598984655819');
    expect(settings.contactChannels.length).toBe(2);
    expect(settings.primaryContactChannel).toBe('whatsapp');
  });
});
