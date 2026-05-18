import { Component, computed, input } from '@angular/core';

import { THEME_PRESETS_BY_ID } from '../../../core/theme/presets';
import { AdminSettingsReadResult, AdminTenantId } from '../models/admin-firestore.models';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard {
  readonly tenantId = input.required<AdminTenantId>();
  readonly settingsResult = input.required<AdminSettingsReadResult>();
  readonly productsCount = input.required<number>();
  readonly activeProductsCount = input.required<number>();

  protected readonly settings = computed(() => this.settingsResult().settings);
  protected readonly tenant = computed(() => this.settingsResult().tenant);
  protected readonly settingsSourceLabel = computed(() =>
    this.settingsResult().source === 'settings-main' ? 'Configurada' : 'Precisa revisar',
  );
  protected readonly tenantStatusLabel = computed(() => {
    const status = this.tenant().status;

    if (status === 'active') {
      return 'Ativa';
    }

    if (status === 'inactive') {
      return 'Inativa';
    }

    if (status === 'suspended') {
      return 'Suspensa';
    }

    return 'Sem status';
  });
  protected readonly themePresetLabel = computed(() => {
    const preset = this.settings().theme.preset;

    return THEME_PRESETS_BY_ID[preset]?.name ?? preset;
  });
  protected readonly storefrontPreviewUrl = computed(
    () => `/?tenantId=${encodeURIComponent(this.tenantId())}`,
  );
  protected readonly primaryContactLabel = computed(() => {
    const settings = this.settings();
    const primaryContactChannel = settings.primaryContactChannel;

    if (primaryContactChannel === 'whatsapp') {
      return 'WhatsApp';
    }

    if (primaryContactChannel === 'instagram') {
      return 'Instagram';
    }

    if (settings.socialLinks.whatsappUrl && !settings.socialLinks.instagramUrl) {
      return 'WhatsApp';
    }

    if (settings.socialLinks.instagramUrl && !settings.socialLinks.whatsappUrl) {
      return 'Instagram';
    }

    if (settings.socialLinks.whatsappUrl || settings.socialLinks.instagramUrl) {
      return 'Escolher principal';
    }

    return 'Pendente';
  });
  protected readonly brandInitials = computed(() => {
    const words = this.settings().brand.name
      .split(/\s+/)
      .map((word) => word.trim())
      .filter(Boolean);

    return words
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('') || 'WL';
  });
  protected readonly heroStatusLabel = computed(() => {
    const checklist = this.publishChecklist();
    const hasBlockingIssue = checklist.some((item) => !item.complete);

    return hasBlockingIssue ? 'Preparando publicacao' : 'Pronta para revisar';
  });
  protected readonly heroStatusDescription = computed(() => {
    if (!this.hasSavedSettings()) {
      return 'Comece pela identidade da loja e salve a configuracao principal.';
    }

    if (!this.hasSalesContact()) {
      return 'Adicione um canal de venda para liberar os botoes de conversao.';
    }

    if (this.activeProductsCount() === 0) {
      return 'Ative ao menos um produto antes de divulgar a vitrine.';
    }

    return 'Abra a vitrine publica e confira a experiencia final do cliente.';
  });
  protected readonly hasSavedSettings = computed(() => this.settingsResult().source === 'settings-main');
  protected readonly hasSalesContact = computed(() => {
    const settings = this.settings();

    return Boolean(settings.socialLinks.whatsappUrl) || Boolean(settings.socialLinks.instagramUrl);
  });
  protected readonly publishChecklist = computed(() => {
    const settings = this.settings();
    const hasSavedSettings = this.hasSavedSettings();
    const hasSalesContact = this.hasSalesContact();
    const hasActiveProducts = this.activeProductsCount() > 0;

    return [
      {
        label: 'Identidade da loja',
        description: hasSavedSettings
          ? `${settings.brand.name} esta salva para a vitrine.`
          : 'Revise nome, slogan, descricao e imagens antes de publicar.',
        complete: hasSavedSettings,
      },
      {
        label: 'Contato de venda',
        description: hasSalesContact
          ? `Contato principal: ${this.primaryContactLabel()}`
          : 'Adicione WhatsApp ou Instagram.',
        complete: hasSalesContact,
      },
      {
        label: 'Aparencia da vitrine',
        description: hasSavedSettings
          ? `${this.themePresetLabel()} esta aplicado.`
          : 'Escolha o modelo visual e salve a loja.',
        complete: hasSavedSettings,
      },
      {
        label: 'Produtos visiveis',
        description:
          hasActiveProducts
            ? `${this.activeProductsCount()} produto(s) visiveis na vitrine.`
            : 'Ative ao menos um produto para publicar a loja.',
        complete: hasActiveProducts,
      },
      {
        label: 'Revisao final',
        description: 'Abra a vitrine publica e confirme marca, tema, produtos e botoes de venda.',
        complete: hasSavedSettings && hasSalesContact && hasActiveProducts,
      },
    ];
  });
  protected readonly publishProgressLabel = computed(() => {
    const checklist = this.publishChecklist();
    const completed = checklist.filter((item) => item.complete).length;

    return `${completed}/${checklist.length} passos`;
  });
  protected readonly publishProgressValue = computed(() => {
    const checklist = this.publishChecklist();
    const completed = checklist.filter((item) => item.complete).length;

    return Math.round((completed / checklist.length) * 100);
  });
  protected readonly publishProgressPercent = computed(() => {
    return `${this.publishProgressValue()}%`;
  });
}
