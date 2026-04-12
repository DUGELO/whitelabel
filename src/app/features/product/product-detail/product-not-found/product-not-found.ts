import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { StorefrontConfigService } from '../../../../core/storefront/storefront-config.service';

@Component({
  selector: 'app-product-not-found',
  imports: [RouterLink],
  templateUrl: './product-not-found.html',
  styleUrl: './product-not-found.scss',
})
export class ProductNotFound {
  protected readonly storefrontConfig = inject(StorefrontConfigService).config;
}
