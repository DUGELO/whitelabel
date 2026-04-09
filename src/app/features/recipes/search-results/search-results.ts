import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DifficultyLevel, RecipeModel } from '../models';
import { RecipeService, RecipeSortOption } from '../recipe-service';

@Component({
  selector: 'app-search-results',
  imports: [RouterLink],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
})
export class SearchResults {
  protected readonly recipeService = inject(RecipeService);

  protected readonly ingredientInput = signal('');
  protected readonly difficultyOptions: DifficultyLevel[] = ['Easy', 'Medium', 'Hard'];
  protected readonly sortOptions: Array<{ value: RecipeSortOption; label: string }> = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'quickest', label: 'Quickest' },
    { value: 'highest-rated', label: 'Highest Rated' },
  ];

  protected readonly results = this.recipeService.visibleRecipes;
  protected readonly selectedIngredients = this.recipeService.selectedIngredients;
  protected readonly availableIngredients = this.recipeService.availableIngredients;
  protected readonly selectedDifficulties = this.recipeService.selectedDifficulties;
  protected readonly maxCookTime = this.recipeService.maxCookTime;
  protected readonly selectedSort = this.recipeService.sortOption;

  protected readonly totalResultsLabel = computed(() => `${this.results().length} Results`);

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

  protected toggleFavorite(event: Event, recipeId: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.recipeService.toggleFavorite(recipeId);
  }

  protected setMaxCookTime(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.recipeService.setMaxCookTime(Number(input.value));
  }

  protected applyCookTimePreset(value: number): void {
    this.recipeService.applyCookTimePreset(value);
  }

  protected toggleDifficulty(difficulty: DifficultyLevel): void {
    this.recipeService.toggleDifficulty(difficulty);
  }

  protected updateIngredientInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.ingredientInput.set(input.value);
  }

  protected addIngredientFromInput(): void {
    const value = this.ingredientInput().trim();
    if (!value) {
      return;
    }

    this.recipeService.addIngredientFilter(value);
    this.ingredientInput.set('');
  }

  protected handleIngredientKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    this.addIngredientFromInput();
  }

  protected removeIngredient(ingredient: string): void {
    this.recipeService.removeIngredientFilter(ingredient);
  }

  protected setSortOption(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.recipeService.setSortOption(select.value as RecipeSortOption);
  }

  protected isDifficultySelected(difficulty: DifficultyLevel): boolean {
    return this.selectedDifficulties().includes(difficulty);
  }

  protected resetSearchExperience(): void {
    this.recipeService.clearSearchExperience();
  }
}
