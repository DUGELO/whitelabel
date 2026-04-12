import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { RecipeService } from '../../../features/product/product-service';
import { AuthService } from '../../auth/auth.service';
import { AuthModalService } from '../../auth/auth-modal/auth-modal.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatMenuModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly authService = inject(AuthService);
  private readonly authModalService = inject(AuthModalService);
  private readonly router = inject(Router);
  protected readonly recipeService = inject(RecipeService);

  protected readonly user = this.authService.user$;
  protected readonly isAuthenticated = this.authService.isAuthenticated$;

  protected readonly initials = computed(() => {
    const name = this.user()?.name?.trim();
    if (!name) return '';
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });

  protected logout(): void {
    this.authService.logout();
  }

  protected openLogin(): void {
    this.authModalService.openLogin().subscribe();
  }

  protected openRegister(): void {
    this.authModalService.openRegister().subscribe();
  }

  protected onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.recipeService.setSearchTerm(input.value);
  }

  protected preventSubmit(event: Event): void {
    event.preventDefault();
    void this.router.navigate(['/search']);
  }
}