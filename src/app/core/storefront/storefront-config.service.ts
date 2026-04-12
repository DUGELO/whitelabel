import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

import { STOREFRONT_CONFIG, StorefrontConfig } from './storefront-config';

@Injectable({
  providedIn: 'root',
})
export class StorefrontConfigService {
  private readonly document = inject(DOCUMENT);
  readonly config = signal<StorefrontConfig>(STOREFRONT_CONFIG);

  initializeBranding(): void {
    const config = this.config();
    const rootStyle = this.document.documentElement.style;

    rootStyle.setProperty('--color-primary', config.theme.primaryColor);
    rootStyle.setProperty('--color-primary-dark', config.theme.primaryColorDark);
    rootStyle.setProperty('--color-secondary', config.theme.secondaryColor);
    rootStyle.setProperty('--color-background', config.theme.backgroundColor);
    rootStyle.setProperty('--color-surface', config.theme.surfaceColor);
    rootStyle.setProperty('--color-surface-soft', config.theme.surfaceSoftColor);
    rootStyle.setProperty('--color-text-main', config.theme.textMainColor);
    rootStyle.setProperty('--color-text-muted', config.theme.textMutedColor);
    rootStyle.setProperty('--color-border', config.theme.borderColor);
    rootStyle.setProperty('--color-star', config.theme.starColor);
    this.document.title = config.brand.name;

    let faviconElement = this.document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
    if (!faviconElement) {
      faviconElement = this.document.createElement('link');
      faviconElement.rel = 'icon';
      this.document.head.appendChild(faviconElement);
    }

    faviconElement.href = config.brand.faviconPath;
  }
}