import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSettingsReadResult } from '../models/admin-firestore.models';
import { AdminDashboard } from './admin-dashboard';

describe('AdminDashboard', () => {
  let fixture: ComponentFixture<AdminDashboard>;

  const settingsResult: AdminSettingsReadResult = {
    source: 'settings-main',
    tenant: {
      id: 'atelier-aurea',
      name: 'Atelier Aurea',
      slug: 'atelier-aurea',
      status: 'active',
    },
    settings: {
      brand: {
        name: 'Atelier Aurea',
        slug: 'atelier-aurea',
      },
      theme: {
        preset: 'editorial-luxury',
      },
      contactChannels: [],
      socialLinks: {
        instagramUrl: '',
        whatsappUrl: '',
      },
      catalog: {
        currencyCode: 'BRL',
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboard);
    fixture.componentRef.setInput('tenantId', 'atelier-aurea');
    fixture.componentRef.setInput('settingsResult', settingsResult);
    fixture.componentRef.setInput('productsCount', 3);
    fixture.componentRef.setInput('activeProductsCount', 2);
    fixture.detectChanges();
  });

  it('should render tenant overview from admin settings', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Atelier Aurea');
    expect(text).toContain('atelier-aurea');
    expect(text).toContain('3');
    expect(text).toContain('2');
    expect(text).toContain('Ativa');
    expect(text).toContain('Pendente');
    expect(text).toContain('3/5 passos');
    expect(text).toContain('Checklist de publicacao');
  });
});
