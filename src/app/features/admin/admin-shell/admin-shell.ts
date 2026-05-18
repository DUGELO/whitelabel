import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AdminDashboard } from '../admin-dashboard/admin-dashboard';
import { AdminProducts } from '../admin-products/admin-products';
import { AdminSettings } from '../admin-settings/admin-settings';
import {
  AdminProductDocument,
  AdminSettingsReadResult,
  AdminTenantId,
} from '../models/admin-firestore.models';
import { AdminAuthService } from '../services/admin-auth.service';
import { AdminFirestoreService } from '../services/admin-firestore.service';
import { AdminTenantContextService } from '../services/admin-tenant-context.service';

type AdminSectionId = 'dashboard' | 'settings' | 'products';

@Component({
  selector: 'app-admin-shell',
  imports: [AdminDashboard, AdminProducts, AdminSettings],
  templateUrl: './admin-shell.html',
  styleUrl: './admin-shell.scss',
})
export class AdminShell {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly adminAuth = inject(AdminAuthService);
  private readonly adminFirestore = inject(AdminFirestoreService);
  private readonly tenantContext = inject(AdminTenantContextService);

  protected readonly tenantInput = signal('');
  protected readonly settingsResult = signal<AdminSettingsReadResult | null>(null);
  protected readonly products = signal<AdminProductDocument[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly activeSection = signal<AdminSectionId>(
    this.resolveSectionId(this.route.snapshot.queryParamMap.get('section')),
  );

  protected readonly tenantId = computed(() => this.tenantContext.tenantId());
  protected readonly activeStoreName = computed(
    () => this.settingsResult()?.settings.brand.name ?? 'Painel da loja',
  );
  protected readonly userLabel = computed(() => {
    const user = this.adminAuth.user();

    return user?.email ?? user?.uid ?? 'sem sessao';
  });
  protected readonly roleLabel = computed(() => this.adminAuth.tenantAccess()?.role ?? 'sem acesso');
  protected readonly canManageTenantContent = computed(() => {
    const role = this.adminAuth.tenantAccess()?.role;

    return role === 'admin' || role === 'owner' || role === 'editor';
  });
  protected readonly productsCount = computed(() => this.products().length);
  protected readonly activeProductsCount = computed(
    () => this.products().filter((product) => product.active).length,
  );
  protected readonly productsCurrencyCode = computed(
    () => this.settingsResult()?.settings.catalog.currencyCode ?? 'BRL',
  );
  protected readonly canSubmitTenant = computed(() => {
    return this.tenantInput().trim().length > 0 && !this.isLoading();
  });

  protected readonly navItems = [
    { id: 'dashboard', label: 'Inicio', disabled: false },
    { id: 'settings', label: 'Loja', disabled: false },
    { id: 'products', label: 'Produtos', disabled: false },
  ] as const;

  constructor() {
    this.bootstrapTenantContext();
  }

  protected onTenantInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.tenantInput.set(input.value);
  }

  protected handleTenantSubmit(event: Event): void {
    event.preventDefault();
    void this.loadTenant(this.tenantInput());
  }

  protected setActiveSection(section: AdminSectionId): void {
    this.activeSection.set(section);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  protected handleSettingsSaved(settingsResult: AdminSettingsReadResult): void {
    this.settingsResult.set(settingsResult);
  }

  protected handleProductChanged(product: AdminProductDocument): void {
    this.products.update((products) => {
      const existingIndex = products.findIndex((item) => item.id === product.id);

      if (existingIndex === -1) {
        return [...products, product];
      }

      return products.map((item) => (item.id === product.id ? product : item));
    });
  }

  protected async handleSignOut(): Promise<void> {
    const tenantId = this.tenantInput().trim();

    await this.adminAuth.signOutAdmin();
    this.tenantContext.clearTenantId();
    this.tenantContext.clearStoredTenantId();
    await this.router.navigate(['/admin/login'], {
      queryParams: tenantId ? { tenantId } : undefined,
    });
  }

  protected async loadTenant(tenantId: AdminTenantId): Promise<void> {
    const normalizedTenantId = tenantId.trim();

    if (!normalizedTenantId) {
      this.errorMessage.set('Informe o ID da loja para carregar o painel.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.settingsResult.set(null);
    this.products.set([]);

    try {
      const access = await this.adminAuth.ensureTenantAccess(normalizedTenantId);

      if (!access) {
        this.tenantContext.clearTenantId();
        this.errorMessage.set('Seu usuario nao tem acesso a esta loja.');
        return;
      }

      this.tenantContext.setTenantId(normalizedTenantId);

      const [settingsResult, products] = await Promise.all([
        this.adminFirestore.getStorefrontSettings(normalizedTenantId),
        this.adminFirestore.getProducts(normalizedTenantId),
      ]);

      if (!settingsResult) {
        this.tenantContext.clearTenantId();
        this.errorMessage.set('Loja nao encontrada.');
        return;
      }

      this.settingsResult.set(settingsResult);
      this.products.set(products);
      this.tenantContext.storeTenantId(normalizedTenantId);
    } catch (error) {
      this.tenantContext.clearTenantId();
      this.errorMessage.set(this.resolveErrorMessage(error));
    } finally {
      this.isLoading.set(false);
    }
  }

  private bootstrapTenantContext(): void {
    const queryTenantId = this.route.snapshot.queryParamMap.get('tenantId');
    const tenantId = this.tenantContext.resolveTenantId(queryTenantId);

    if (!tenantId) {
      return;
    }

    this.tenantInput.set(tenantId);
    void this.loadTenant(tenantId);
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'Nao foi possivel carregar a loja agora.';
  }

  private resolveSectionId(section: string | null): AdminSectionId {
    return section === 'settings' || section === 'products' ? section : 'dashboard';
  }
}
