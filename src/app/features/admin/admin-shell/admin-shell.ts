import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AdminDashboard } from '../admin-dashboard/admin-dashboard';
import { AdminSettingsReadResult, AdminTenantId } from '../models/admin-firestore.models';
import { AdminAuthService } from '../services/admin-auth.service';
import { AdminFirestoreService } from '../services/admin-firestore.service';
import { AdminTenantContextService } from '../services/admin-tenant-context.service';

@Component({
  selector: 'app-admin-shell',
  imports: [AdminDashboard],
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
  protected readonly productsCount = signal(0);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly tenantId = computed(() => this.tenantContext.tenantId());
  protected readonly userLabel = computed(() => {
    const user = this.adminAuth.user();

    return user?.email ?? user?.uid ?? 'sem sessao';
  });
  protected readonly roleLabel = computed(() => this.adminAuth.tenantAccess()?.role ?? 'sem acesso');
  protected readonly canSubmitTenant = computed(() => {
    return this.tenantInput().trim().length > 0 && !this.isLoading();
  });

  protected readonly navItems = [
    { label: 'Dashboard', state: 'active' },
    { label: 'Configuracoes', state: 'soon' },
    { label: 'Produtos', state: 'soon' },
    { label: 'Midia', state: 'soon' },
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

  protected async handleSignOut(): Promise<void> {
    const tenantId = this.tenantInput().trim();

    await this.adminAuth.signOutAdmin();
    this.tenantContext.clearTenantId();
    await this.router.navigate(['/admin/login'], {
      queryParams: tenantId ? { tenantId } : undefined,
    });
  }

  protected async loadTenant(tenantId: AdminTenantId): Promise<void> {
    const normalizedTenantId = tenantId.trim();

    if (!normalizedTenantId) {
      this.errorMessage.set('Informe um tenantId para carregar o admin.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.settingsResult.set(null);
    this.productsCount.set(0);

    try {
      const access = await this.adminAuth.ensureTenantAccess(normalizedTenantId);

      if (!access) {
        this.tenantContext.clearTenantId();
        this.errorMessage.set('Seu usuario nao tem acesso a este tenant.');
        return;
      }

      this.tenantContext.setTenantId(normalizedTenantId);

      const [settingsResult, products] = await Promise.all([
        this.adminFirestore.getStorefrontSettings(normalizedTenantId),
        this.adminFirestore.getProducts(normalizedTenantId),
      ]);

      if (!settingsResult) {
        this.tenantContext.clearTenantId();
        this.errorMessage.set('Tenant nao encontrado no Firestore.');
        return;
      }

      this.settingsResult.set(settingsResult);
      this.productsCount.set(products.length);
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

    return 'Nao foi possivel carregar o tenant agora.';
  }
}
