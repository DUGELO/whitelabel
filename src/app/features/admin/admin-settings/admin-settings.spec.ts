import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

import {
  AdminSettingsReadResult,
  AdminStorefrontSettingsDocument,
} from '../models/admin-firestore.models';
import { AdminFirestoreService } from '../services/admin-firestore.service';
import { AdminSettings } from './admin-settings';

describe('AdminSettings', () => {
  let fixture: ComponentFixture<AdminSettings>;
  let firestoreService: {
    saveStorefrontSettings: ReturnType<typeof vi.fn>;
  };

  const settings: AdminStorefrontSettingsDocument = {
    brand: {
      name: 'Atelier Aurea',
      slug: 'atelier-aurea',
    },
    theme: {
      preset: 'editorial-luxury',
      typographyPreset: 'editorial-serif',
    },
    contactChannels: [],
    socialLinks: {
      instagramUrl: 'https://instagram.com/atelieraurea',
      whatsappUrl: 'https://wa.me/5598984655819',
    },
    catalog: {
      currencyCode: 'BRL',
      defaultWhatsAppMessage: 'Ola! Tenho interesse em:',
    },
    primaryContactChannel: 'whatsapp',
  };

  const settingsResult: AdminSettingsReadResult = {
    source: 'legacy-tenant',
    tenant: {
      id: 'atelier-aurea',
      name: 'Atelier Aurea',
      slug: 'atelier-aurea',
    },
    settings,
  };

  beforeEach(async () => {
    firestoreService = {
      saveStorefrontSettings: vi
        .fn()
        .mockImplementation((_tenantId: string, savedSettings: AdminStorefrontSettingsDocument) =>
          Promise.resolve({
            ...settingsResult,
            source: 'settings-main',
            settings: savedSettings,
          }),
        ),
    };

    await TestBed.configureTestingModule({
      imports: [AdminSettings],
      providers: [{ provide: AdminFirestoreService, useValue: firestoreService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSettings);
    fixture.componentRef.setInput('tenantId', 'atelier-aurea');
    fixture.componentRef.setInput('settingsResult', settingsResult);
  });

  it('should save controlled storefront settings to Firestore service', async () => {
    fixture.componentRef.setInput('canEditSettings', true);
    fixture.detectChanges();

    updateInput(0, 'Atelier Aurora');
    submitForm();

    await fixture.whenStable();

    const savedSettings = firestoreService.saveStorefrontSettings.mock.calls[0][1] as
      AdminStorefrontSettingsDocument;

    expect(savedSettings).toEqual(
      expect.objectContaining({
        brand: expect.objectContaining({
          name: 'Atelier Aurora',
          slug: 'atelier-aurea',
        }),
        theme: {
          preset: 'editorial-luxury',
          typographyPreset: 'editorial-serif',
        },
        primaryContactChannel: 'whatsapp',
        socialLinks: expect.objectContaining({
          whatsappUrl: 'https://wa.me/5598984655819',
        }),
        catalog: expect.objectContaining({
          currencyCode: 'BRL',
          defaultWhatsAppMessage: 'Ola! Tenho interesse em:',
        }),
      }),
    );
    expect(savedSettings.theme.colors).toBeUndefined();
    expect(savedSettings.theme.variants).toBeUndefined();
  });

  it('should normalize phone-like WhatsApp input before saving', async () => {
    fixture.componentRef.setInput('canEditSettings', true);
    fixture.detectChanges();

    updateInputByName('whatsappUrl', '+55 (98) 98465-5819');
    submitForm();

    await fixture.whenStable();

    expect(firestoreService.saveStorefrontSettings).toHaveBeenCalledWith(
      'atelier-aurea',
      expect.objectContaining({
        socialLinks: expect.objectContaining({
          whatsappUrl: 'https://wa.me/5598984655819',
        }),
        contactChannels: [
          expect.objectContaining({
            type: 'whatsapp',
            url: 'https://wa.me/5598984655819',
          }),
          expect.objectContaining({
            type: 'instagram',
          }),
        ],
      }),
    );
  });

  it('should remove the unused public storefront URL from future saves', async () => {
    fixture.componentRef.setInput('settingsResult', {
      ...settingsResult,
      settings: {
        ...settings,
        catalog: {
          ...settings.catalog,
          baseProductUrl: 'https://loja.test/produtos',
        },
      },
    });
    fixture.componentRef.setInput('canEditSettings', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[name="baseProductUrl"]')).toBeNull();
    submitForm();

    await fixture.whenStable();

    const savedSettings = firestoreService.saveStorefrontSettings.mock.calls[0][1] as
      AdminStorefrontSettingsDocument;

    expect(savedSettings.catalog.baseProductUrl).toBeUndefined();
  });

  it('should save color overrides only after explicit customization', async () => {
    fixture.componentRef.setInput('canEditSettings', true);
    fixture.detectChanges();

    clickButtonByText('Personalizar cores');
    updateInputByName('brandPrimary', '#123456');
    submitForm();

    await fixture.whenStable();

    const savedSettings = firestoreService.saveStorefrontSettings.mock.calls[0][1] as
      AdminStorefrontSettingsDocument;

    expect(savedSettings.theme.colors).toEqual({ brandPrimary: '#123456' });
    expect(fixture.nativeElement.textContent).toContain('Personalizada');
  });

  it('should reset color overrides back to preset inheritance', async () => {
    fixture.componentRef.setInput('settingsResult', {
      ...settingsResult,
      settings: {
        ...settings,
        theme: {
          ...settings.theme,
          colors: {
            brandPrimary: '#123456',
          },
        },
      },
    });
    fixture.componentRef.setInput('canEditSettings', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Cores personalizadas');
    clickButtonByText('Usar cores do tema');
    submitForm();

    await fixture.whenStable();

    const savedSettings = firestoreService.saveStorefrontSettings.mock.calls[0][1] as
      AdminStorefrontSettingsDocument;

    expect(savedSettings.theme.colors).toBeUndefined();
  });

  it('should not carry old preset colors when theme preset changes without customization', async () => {
    fixture.componentRef.setInput('canEditSettings', true);
    fixture.detectChanges();

    changeSelectByName('themePreset', 'minimal-premium');
    submitForm();

    await fixture.whenStable();

    const savedSettings = firestoreService.saveStorefrontSettings.mock.calls[0][1] as
      AdminStorefrontSettingsDocument;

    expect(savedSettings.theme.preset).toBe('minimal-premium');
    expect(savedSettings.theme.colors).toBeUndefined();
    expect(savedSettings.theme.variants).toBeUndefined();
  });

  it('should save only product card variant overrides from the visible variant controls', async () => {
    fixture.componentRef.setInput('canEditSettings', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('select[name="heroVariant"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('select[name="productGridVariant"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('select[name="ctaVariant"]')).toBeNull();

    changeSelectByName('productCardVariant', 'quiet-luxury');
    submitForm();

    await fixture.whenStable();

    const savedSettings = firestoreService.saveStorefrontSettings.mock.calls[0][1] as
      AdminStorefrontSettingsDocument;

    expect(savedSettings.theme.variants).toEqual({ productCard: 'quiet-luxury' });
  });

  it('should block invalid brand asset paths before saving', async () => {
    fixture.componentRef.setInput('canEditSettings', true);
    fixture.detectChanges();

    updateInputByName('logoPath', 'javascript:alert(1)');
    submitForm();

    await fixture.whenStable();

    expect(firestoreService.saveStorefrontSettings).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('caminho de asset valido');
  });

  it('should save a canonical settings payload without unknown theme fields', async () => {
    fixture.componentRef.setInput('settingsResult', {
      ...settingsResult,
      settings: {
        ...(settings as AdminStorefrontSettingsDocument),
        customCss: 'body { display: none }',
        theme: {
          ...settings.theme,
          customCss: 'body { display: none }',
        },
        content: {
          heroEyebrow: 'Colecao segura',
          rogueLabel: 'nao salvar',
        },
        navigationLinks: [
          { label: 'Inicio', route: '/' },
          { label: 'Externo', route: 'https://example.com' },
        ],
        socialLinks: {
          ...settings.socialLinks,
          facebookUrl: 'javascript:alert(1)',
          youtubeUrl: 'https://youtube.com/loja',
        },
      } as AdminStorefrontSettingsDocument,
    });
    fixture.componentRef.setInput('canEditSettings', true);
    fixture.detectChanges();

    submitForm();

    await fixture.whenStable();

    const savedSettings = firestoreService.saveStorefrontSettings.mock.calls[0][1] as Record<
      string,
      unknown
    >;

    expect(savedSettings).not.toHaveProperty('customCss');
    expect(savedSettings['theme']).not.toHaveProperty('customCss');
    expect(savedSettings['content']).toEqual({ heroEyebrow: 'Colecao segura' });
    expect(savedSettings['navigationLinks']).toEqual([{ label: 'Inicio', route: '/' }]);
    expect(savedSettings['socialLinks']).not.toHaveProperty('facebookUrl');
    expect(savedSettings['socialLinks']).toHaveProperty('youtubeUrl', 'https://youtube.com/loja');
  });

  it('should render a settings preview from the current form', () => {
    fixture.componentRef.setInput('canEditSettings', true);
    fixture.detectChanges();

    updateInputByName('brandName', 'Atelier Aurora');

    expect(fixture.nativeElement.textContent).toContain('Atelier Aurora');
    expect(fixture.nativeElement.textContent).toContain('Editorial Luxury');
    expect(fixture.nativeElement.textContent).toContain('Cores do tema');
    expect(fixture.nativeElement.textContent).toContain('https://wa.me/5598984655819');
  });

  it('should block invalid settings before saving', async () => {
    fixture.componentRef.setInput('canEditSettings', true);
    fixture.detectChanges();

    updateInputByName('whatsappUrl', 'whatsapp-invalido');
    submitForm();

    await fixture.whenStable();

    expect(firestoreService.saveStorefrontSettings).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Informe WhatsApp com DDI');
  });

  it('should keep viewer role read-only', () => {
    fixture.componentRef.setInput('canEditSettings', false);
    fixture.detectChanges();

    const saveButton = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    expect(saveButton.disabled).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('apenas leitura');
  });

  function updateInput(index: number, value: string): void {
    const input = fixture.debugElement.queryAll(By.css('input'))[index]
      .nativeElement as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function updateInputByName(name: string, value: string): void {
    const input = fixture.debugElement.query(By.css(`input[name="${name}"]`))
      .nativeElement as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function changeSelectByName(name: string, value: string): void {
    const select = fixture.debugElement.query(By.css(`select[name="${name}"]`))
      .nativeElement as HTMLSelectElement;
    select.value = value;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  function clickButtonByText(text: string): void {
    const button = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find(
      (item): item is HTMLButtonElement => item.textContent?.trim() === text,
    );

    button?.click();
    fixture.detectChanges();
  }

  function submitForm(): void {
    const form = fixture.debugElement.query(By.css('form')).nativeElement as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }
});
