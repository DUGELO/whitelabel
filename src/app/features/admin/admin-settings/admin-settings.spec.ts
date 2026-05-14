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
      colors: {
        brandPrimary: '#8a6a2d',
        brandPrimaryStrong: '#5f4617',
        brandSecondary: '#b99668',
        accent: '#e5d3b1',
      },
      variants: {
        hero: 'immersive',
        productCard: 'editorial-minimal',
        productGrid: 'editorial-grid',
        cta: 'solid-premium',
      },
    },
    contactChannels: [],
    socialLinks: {
      instagramUrl: 'https://instagram.com/atelieraurea',
      whatsappUrl: 'https://wa.me/5598984655819',
    },
    catalog: {
      currencyCode: 'BRL',
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
      saveStorefrontSettings: vi.fn().mockImplementation(
        (_tenantId: string, savedSettings: AdminStorefrontSettingsDocument) =>
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

    expect(firestoreService.saveStorefrontSettings).toHaveBeenCalledWith(
      'atelier-aurea',
      expect.objectContaining({
        brand: expect.objectContaining({
          name: 'Atelier Aurora',
          slug: 'atelier-aurea',
        }),
        theme: expect.objectContaining({
          preset: 'editorial-luxury',
          typographyPreset: 'editorial-serif',
          colors: expect.objectContaining({
            brandPrimary: '#8a6a2d',
          }),
          variants: expect.objectContaining({
            productCard: 'editorial-minimal',
          }),
        }),
        primaryContactChannel: 'whatsapp',
        socialLinks: expect.objectContaining({
          whatsappUrl: 'https://wa.me/5598984655819',
        }),
      }),
    );
  });

  it('should keep viewer role read-only', () => {
    fixture.componentRef.setInput('canEditSettings', false);
    fixture.detectChanges();

    const saveButton = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;

    expect(saveButton.disabled).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('apenas leitura');
  });

  function updateInput(index: number, value: string): void {
    const input = fixture.debugElement.queryAll(By.css('input'))[index].nativeElement as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function submitForm(): void {
    const form = fixture.debugElement.query(By.css('form')).nativeElement as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }
});
