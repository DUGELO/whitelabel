import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { StorefrontConfigService } from '../../../../core/storefront/storefront-config.service';
import { ContactChannel } from '../../../../core/storefront/storefront-config';

@Component({
  selector: 'app-floating-contact-cta',
  templateUrl: './floating-contact-cta.html',
  styleUrl: './floating-contact-cta.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingContactCta {
  private readonly storefrontConfig = inject(StorefrontConfigService).config;

  protected readonly activeChannel = computed<ContactChannel | null>(() => {
    const config = this.storefrontConfig();
    const channels = config.contactChannels;
    const preferred = config.primaryContactChannel;

    if (preferred) {
      return channels.find((c) => c.type === preferred) ?? null;
    }

    return (
      channels.find((c) => c.type === 'whatsapp') ??
      channels.find((c) => c.type === 'instagram') ??
      null
    );
  });
}
