import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { RecipeModel } from '../models';
import { RecipeService } from '../product-service';
import { ProductList } from '../product-list/product-list';
import { ProductNotFound } from './product-not-found/product-not-found';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, ProductNotFound, ProductList],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(RecipeService);
  private readonly params = toSignal(this.route.paramMap);

  protected readonly id = computed(() => Number(this.params()?.get('id')));
  protected readonly recipeById = computed(() => this.service.recipes().find(r => r.id === this.id()));
  protected readonly servings = this.service.servings;

  protected readonly adjustedIngredients = computed(() => {
    const r = this.recipeById();
    const s = this.servings();
    return r?.ingredients.map(ing => ({
      ...ing,
      quantity: Math.round(ing.quantity * s * 100) / 100,
    })) ?? [];
  });

  protected readonly relatedRecipes = computed(() => {
    const current = this.recipeById();
    if (!current) return [];
    return this.service.recipes()
      .filter(r => r.id !== current.id)
      .slice(0, 4);
  });

  protected formatDuration(recipe: RecipeModel): string {
    return `${recipe.durationMinutes} mins`;
  }

  protected formatRating(recipe: RecipeModel): string {
    return recipe.rating.toFixed(1);
  }

  protected formatReviewCount(recipe: RecipeModel): string {
    return recipe.reviewCount >= 1000
      ? `${(recipe.reviewCount / 1000).toFixed(1)}k`
      : `${recipe.reviewCount}`;
  }

  protected formatIngredient(ing: { quantity: number; unit: string; name: string }): string {
    return ing.unit === 'each'
      ? `${ing.quantity} ${ing.name}`
      : `${ing.quantity} ${ing.unit} ${ing.name}`;
  }

  protected increaseServings(): void {
    this.service.increaseServings();
  }

  protected decreaseServings(): void {
    this.service.decreaseServings();
  }

  protected toggleFavorite(): void {
    const id = this.id();
    if (id) this.service.toggleFavorite(id);
  }

  protected toggleRelatedFavorite(event: Event, recipeId: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.service.toggleFavorite(recipeId);
  }
}
