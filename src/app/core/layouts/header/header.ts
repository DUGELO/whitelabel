import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { StorefrontConfigService } from '../../storefront/storefront-config.service';
import { ProductCatalogService } from '../../../features/product/product-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly router = inject(Router);
  protected readonly storefrontConfig = inject(StorefrontConfigService).config;
  protected readonly catalogService = inject(ProductCatalogService);
  
  protected onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.catalogService.setSearchTerm(input.value);
  }

  protected preventSubmit(event: Event): void {
    event.preventDefault();
    void this.router.navigate(['/search']);
  }
}