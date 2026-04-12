import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecipeModel } from '../models';
import { RecipeService } from '../product-service';
import { ProductCard } from '../../../shared/design-system/components/product-card/product-card';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  //SERVICES
  protected readonly recipeService = inject(RecipeService);

  // VIEW MODEL
  protected readonly featuredRecipe = computed(() => {
    const recipes = this.recipeService.recipes();
    return recipes[7] ?? null;
  });

  protected readonly quickPicks = computed(() => {
    const featured = this.featuredRecipe();
    return this.selectRecipes(this.recipeService.recipes(), 2, featured ? [featured.id] : []);
  });

  protected readonly popularRecipes = computed(() => {
    const featured = this.featuredRecipe();
    const excludeIds = new Set<number>();
    if (featured) {
      excludeIds.add(featured.id);
    }

    this.quickPicks().forEach((recipe) => excludeIds.add(recipe.id));
    return this.selectRecipes(this.recipeService.recipes(), 6, Array.from(excludeIds));
  });

  // HANDLERS
  protected toggleFavorite(event: Event, recipeId: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.recipeService.toggleFavorite(recipeId);
  }

  protected formatDuration(recipe: RecipeModel): string {
    return `${recipe.durationMinutes} mins`;
  }

  protected formatRating(recipe: RecipeModel): string {
    return recipe.rating.toFixed(1);
  }

  protected formatReviewCount(recipe: RecipeModel): string {
    if (recipe.reviewCount >= 1000) {
      return `${(recipe.reviewCount / 1000).toFixed(1)}k`;
    }

    return `${recipe.reviewCount}`;
  }

  private selectRecipes(recipes: RecipeModel[], amount: number, excludedIds: number[] = []): RecipeModel[] {
    const selected: RecipeModel[] = [];
    const seenIds = new Set<number>(excludedIds);
    const pool = [...recipes];

    for (const recipe of pool) {
      if (seenIds.has(recipe.id)) {
        continue;
      }

      seenIds.add(recipe.id);
      selected.push(recipe);

      if (selected.length === amount) {
        break;
      }
    }

    return selected;
  }
}
