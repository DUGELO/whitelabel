import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';

import { AdminAuthenticatedUser, AdminTenantAccess } from '../models/admin-auth.models';
import { AdminSettingsReadResult } from '../models/admin-firestore.models';
import { AdminAuthService } from '../services/admin-auth.service';
import { AdminFirestoreService } from '../services/admin-firestore.service';
import { AdminTenantContextService } from '../services/admin-tenant-context.service';
import { AdminShell } from './admin-shell';

describe('AdminShell', () => {
  let fixture: ComponentFixture<AdminShell>;
  let firestoreService: {
    getStorefrontSettings: ReturnType<typeof vi.fn>;
    getProducts: ReturnType<typeof vi.fn>;
    createProduct: ReturnType<typeof vi.fn>;
    updateProduct: ReturnType<typeof vi.fn>;
    setProductActive: ReturnType<typeof vi.fn>;
  };
  let authService: {
    user: ReturnType<typeof signal<AdminAuthenticatedUser | null>>;
    tenantAccess: ReturnType<typeof signal<AdminTenantAccess | null>>;
    ensureTenantAccess: ReturnType<typeof vi.fn>;
    signOutAdmin: ReturnType<typeof vi.fn>;
  };

  const settingsResult: AdminSettingsReadResult = {
    source: 'legacy-tenant',
    tenant: {
      id: 'atelier-aurea',
      name: 'Atelier Aurea',
      slug: 'atelier-aurea',
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
    globalThis.localStorage?.clear();

    const user: AdminAuthenticatedUser = {
      uid: 'uid-1',
      email: 'owner@atelier.test',
      displayName: null,
    };
    const access: AdminTenantAccess = {
      tenantId: 'atelier-aurea',
      uid: user.uid,
      email: user.email,
      role: 'owner',
      tenantUser: {
        uid: user.uid,
        email: user.email ?? '',
        role: 'owner',
        active: true,
      },
    };

    authService = {
      user: signal(user),
      tenantAccess: signal(access),
      ensureTenantAccess: vi.fn().mockResolvedValue(access),
      signOutAdmin: vi.fn().mockResolvedValue(undefined),
    };

    firestoreService = {
      getStorefrontSettings: vi.fn().mockResolvedValue(settingsResult),
      getProducts: vi.fn().mockResolvedValue([
        {
          id: 'product-1',
          active: true,
          tenantId: 'atelier-aurea',
          title: 'Produto',
          slug: 'produto',
          description: 'Descricao',
          price: 100,
          tags: [],
          highlights: [],
          images: [],
          rating: 5,
          reviewCount: 1,
        },
      ]),
      createProduct: vi.fn(),
      updateProduct: vi.fn(),
      setProductActive: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AdminShell],
      providers: [
        AdminTenantContextService,
        { provide: AdminAuthService, useValue: authService },
        { provide: AdminFirestoreService, useValue: firestoreService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({}),
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('should wait for an explicit tenantId before reading Firestore', () => {
    fixture = TestBed.createComponent(AdminShell);
    fixture.detectChanges();

    expect(firestoreService.getStorefrontSettings).not.toHaveBeenCalled();
    expect(firestoreService.getProducts).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Informe o ID da loja');
  });

  it('should bootstrap tenant context from query param', async () => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: {
        snapshot: {
          queryParamMap: convertToParamMap({ tenantId: 'atelier-aurea' }),
        },
      },
    });

    fixture = TestBed.createComponent(AdminShell);
    fixture.detectChanges();
    await fixture.whenStable();
    await Promise.resolve();
    await Promise.resolve();
    fixture.detectChanges();

    const tenantContext = TestBed.inject(AdminTenantContextService);

    expect(tenantContext.requireTenantId()).toBe('atelier-aurea');
    expect(authService.ensureTenantAccess).toHaveBeenCalledWith('atelier-aurea');
    expect(firestoreService.getStorefrontSettings).toHaveBeenCalledWith('atelier-aurea');
    expect(fixture.nativeElement.textContent).toContain('Atelier Aurea');
  });

  it('should block tenant loading when the authenticated user has no tenant link', async () => {
    authService.ensureTenantAccess.mockResolvedValue(null);

    TestBed.overrideProvider(ActivatedRoute, {
      useValue: {
        snapshot: {
          queryParamMap: convertToParamMap({ tenantId: 'atelier-aurea' }),
        },
      },
    });

    fixture = TestBed.createComponent(AdminShell);
    fixture.detectChanges();
    await fixture.whenStable();
    await Promise.resolve();
    await Promise.resolve();
    fixture.detectChanges();

    expect(firestoreService.getStorefrontSettings).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Seu usuario nao tem acesso');
  });

  it('should render product management after tenant bootstrap', async () => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: {
        snapshot: {
          queryParamMap: convertToParamMap({ tenantId: 'atelier-aurea' }),
        },
      },
    });

    fixture = TestBed.createComponent(AdminShell);
    fixture.detectChanges();
    await fixture.whenStable();
    await Promise.resolve();
    await Promise.resolve();
    fixture.detectChanges();

    clickNavButton('Produtos');

    expect(fixture.nativeElement.textContent).toContain('Produtos da loja');
    expect(fixture.nativeElement.textContent).toContain('Produto');
  });

  function clickNavButton(label: string): void {
    const button = Array.from(fixture.nativeElement.querySelectorAll('nav button')).find((item) =>
      (item as HTMLButtonElement).textContent?.includes(label),
    ) as HTMLButtonElement;

    button.click();
    fixture.detectChanges();
  }
});
