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
