import { Injectable, computed, effect, inject } from '@angular/core';

import { StorefrontConfigService } from '../../storefront/storefront-config.service';
import { resolveThemeTokens } from '../resolvers/resolve-theme-tokens';
import { CssVariableThemeWriterService } from './css-variable-theme-writer.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeEngineService {
  private readonly storefrontConfigService = inject(StorefrontConfigService);
  private readonly themeWriter = inject(CssVariableThemeWriterService);

  readonly themeConfig = computed(() => this.storefrontConfigService.config().theme);
  readonly activeTheme = computed(() => resolveThemeTokens(this.themeConfig()));
  readonly tokens = computed(() => this.activeTheme().tokens);
  readonly variants = computed(() => this.activeTheme().variants);

  constructor() {
    effect(() => {
      this.themeWriter.applyTheme(this.activeTheme());
    });
  }

  initializeTheme(): void {
    this.themeWriter.applyTheme(this.activeTheme());
  }
}
