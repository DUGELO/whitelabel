import { Component, computed, input } from '@angular/core';

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

  protected readonly settings = computed(() => this.settingsResult().settings);
  protected readonly tenant = computed(() => this.settingsResult().tenant);
  protected readonly settingsSourceLabel = computed(() =>
    this.settingsResult().source === 'settings-main' ? 'settings/main' : 'tenant legado',
  );
  protected readonly primaryContactLabel = computed(() => {
    const primaryContactChannel = this.settings().primaryContactChannel;

    if (!primaryContactChannel) {
      return 'Pendente';
    }

    return primaryContactChannel === 'whatsapp' ? 'WhatsApp' : 'Instagram';
  });
}
