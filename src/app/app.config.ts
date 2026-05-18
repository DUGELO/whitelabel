import {
  ApplicationConfig,
  Injector,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { StorefrontConfigService } from './core/storefront/storefront-config.service';
import { StorefrontRuntimeConfigService } from './core/storefront/storefront-runtime-config.service';
import { ThemeEngineService } from './core/theme/services/theme-engine.service';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAppInitializer(() => {
      const injector = inject(Injector);
      const storefrontConfig = inject(StorefrontConfigService);
      const runtimeConfig = inject(StorefrontRuntimeConfigService);

      return runtimeConfig.loadConfig().catch((error) => {
        console.warn('[app-config] Storefront runtime config fallback applied.', error);

        return storefrontConfig.config();
      }).then((config) => {
        storefrontConfig.applyRuntimeConfig(config);
        storefrontConfig.initializeBranding();
        injector.get(ThemeEngineService).initializeTheme();
      });
    })
  ]
};
