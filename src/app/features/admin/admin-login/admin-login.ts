import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AdminTenantId } from '../models/admin-firestore.models';
import { AdminAuthService } from '../services/admin-auth.service';
import { AdminTenantContextService } from '../services/admin-tenant-context.service';

@Component({
  selector: 'app-admin-login',
  imports: [],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
})
export class AdminLogin {
  protected readonly adminAuth = inject(AdminAuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tenantContext = inject(AdminTenantContextService);

  protected readonly emailInput = signal('');
  protected readonly passwordInput = signal('');
  protected readonly tenantInput = signal('');
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly user = this.adminAuth.user;
  protected readonly canSubmit = computed(() => {
    const hasTenant = this.tenantInput().trim().length > 0;
    const hasSession = this.user() !== null;
    const hasCredentials = this.emailInput().trim().length > 0 && this.passwordInput().length > 0;

    return hasTenant && !this.isLoading() && (hasSession || hasCredentials);
  });

  constructor() {
    const tenantId = this.tenantContext.resolveTenantId(
      this.route.snapshot.queryParamMap.get('tenantId'),
    );

    if (tenantId) {
      this.tenantInput.set(tenantId);
    }

    const reason = this.route.snapshot.queryParamMap.get('reason');

    if (reason === 'access-denied') {
      this.errorMessage.set('Seu usuario nao tem acesso a esta loja.');
    } else if (reason === 'tenant-required') {
      this.errorMessage.set('Informe o ID da loja para continuar.');
    }
  }

  protected onEmailInput(event: Event): void {
    this.emailInput.set(this.readInputValue(event));
  }

  protected onPasswordInput(event: Event): void {
    this.passwordInput.set(this.readInputValue(event));
  }

  protected onTenantInput(event: Event): void {
    this.tenantInput.set(this.readInputValue(event));
  }

  protected handleSubmit(event: Event): void {
    event.preventDefault();
    void this.authenticate();
  }

  protected async handleSignOut(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      await this.adminAuth.signOutAdmin();
      this.tenantContext.clearTenantId();
      this.tenantContext.clearStoredTenantId();
    } finally {
      this.isLoading.set(false);
    }
  }

  private async authenticate(): Promise<void> {
    const tenantId = this.tenantInput().trim();

    if (!tenantId) {
      this.errorMessage.set('Informe o ID da loja para continuar.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      if (!this.user()) {
        await this.adminAuth.signIn(this.emailInput(), this.passwordInput());
      }

      const access = await this.adminAuth.validateTenantAccess(tenantId);

      if (!access) {
        this.errorMessage.set('Seu usuario nao tem acesso a esta loja.');
        return;
      }

      this.tenantContext.setTenantId(tenantId);
      this.tenantContext.storeTenantId(tenantId);
      await this.router.navigateByUrl(this.resolveRedirectUrl(tenantId));
    } catch (error) {
      this.errorMessage.set(this.resolveErrorMessage(error));
    } finally {
      this.isLoading.set(false);
    }
  }

  private resolveRedirectUrl(tenantId: AdminTenantId): string {
    return `/admin?tenantId=${encodeURIComponent(tenantId)}`;
  }

  private readInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'Nao foi possivel autenticar agora.';
  }
}
