import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { StorefrontConfigService } from './core/storefront/storefront-config.service';
import { ThemeEngineService } from './core/theme/services/theme-engine.service';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAppInitializer(() => {
      const storefrontConfig = inject(StorefrontConfigService);
      const themeEngine = inject(ThemeEngineService);

      storefrontConfig.initializeBranding();
      themeEngine.initializeTheme();
    })
  ]
};
