import { Component, computed, inject } from '@angular/core';
import { StorefrontConfigService } from './core/storefront/storefront-config.service';
import { MainLayout } from "./core/layouts/main-layout/main-layout";

@Component({
  selector: 'app-root',
  imports: [MainLayout],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly storefrontConfig = inject(StorefrontConfigService).config;
  protected readonly title = computed(() => this.storefrontConfig().brand.name);
}
