import { UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { StorefrontConfigService } from '../../storefront/storefront-config.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, UpperCasePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly storefrontConfig = inject(StorefrontConfigService).config;
}
