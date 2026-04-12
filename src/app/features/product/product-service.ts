import { Injectable, computed, signal } from '@angular/core';
import { Recipe } from './models';
import { DifficultyLevel, RecipeModel } from './models';
import { MOCK_RECIPES } from './mock-recipes';

export type RecipeSortOption = 'popular' | 'quickest' | 'highest-rated';

const DEFAULT_MAX_COOK_TIME = 120;

@Injectable({
  providedIn: 'root',
})
export class RecipeService {

  // STATE
  readonly recipes = signal<Recipe[]>(MOCK_RECIPES);

  readonly searchTerm = signal('');
  readonly maxCookTime = signal(DEFAULT_MAX_COOK_TIME);
  readonly selectedDifficulties = signal<DifficultyLevel[]>([]);
  readonly selectedIngredients = signal<string[]>([]);
  readonly sortOption = signal<RecipeSortOption>('popular');

  readonly availableIngredients = computed(() => {
    return Array.from(
      new Set(
        this.recipes()
          .flatMap((recipe) => recipe.ingredients.map((ingredient) => ingredient.name))
          .sort((left, right) => left.localeCompare(right))
      )
    );
  });

  readonly hasActiveFilters = computed(() => {
    return this.maxCookTime() < DEFAULT_MAX_COOK_TIME
      || this.selectedDifficulties().length > 0
      || this.selectedIngredients().length > 0;
  });

  readonly isSearchView = computed(() => {
    return this.searchTerm().trim().length > 0 || this.hasActiveFilters();
  });

  readonly filteredRecipes = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const maxCookTime = this.maxCookTime();
    const selectedDifficulties = this.selectedDifficulties();
    const selectedIngredients = this.selectedIngredients().map((ingredient) => ingredient.toLowerCase());

    return this.recipes().filter((recipe) => {
      const matchesTerm = !term
        || recipe.name.toLowerCase().includes(term)
        || recipe.description.toLowerCase().includes(term)
        || recipe.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(term));

      const matchesCookTime = recipe.durationMinutes <= maxCookTime;
      const matchesDifficulty = selectedDifficulties.length === 0 || selectedDifficulties.includes(recipe.difficulty);
      const matchesIngredients = selectedIngredients.length === 0 || selectedIngredients.every((selectedIngredient) => {
        return recipe.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(selectedIngredient));
      });

      return matchesTerm && matchesCookTime && matchesDifficulty && matchesIngredients;
    });
  });

  readonly visibleRecipes = computed(() => {
    const recipes = [...this.filteredRecipes()];
    const sortOption = this.sortOption();

    if (sortOption === 'quickest') {
      return recipes.sort((left, right) => left.durationMinutes - right.durationMinutes);
    }

    if (sortOption === 'highest-rated') {
      return recipes.sort((left, right) => right.rating - left.rating || right.reviewCount - left.reviewCount);
    }

    return recipes.sort((left, right) => right.reviewCount - left.reviewCount || right.rating - left.rating);
  });

  readonly servings = signal(1);


  // HANDLERS
  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  setMaxCookTime(value: number): void {
    this.maxCookTime.set(value);
  }

  toggleDifficulty(difficulty: DifficultyLevel): void {
    this.selectedDifficulties.update((difficulties) => {
      if (difficulties.includes(difficulty)) {
        return difficulties.filter((item) => item !== difficulty);
      }

      return [...difficulties, difficulty];
    });
  }

  addIngredientFilter(ingredient: string): void {
    const normalizedIngredient = ingredient.trim();
    if (!normalizedIngredient) {
      return;
    }

    this.selectedIngredients.update((ingredients) => {
      if (ingredients.some((item) => item.toLowerCase() === normalizedIngredient.toLowerCase())) {
        return ingredients;
      }

      return [...ingredients, normalizedIngredient];
    });
  }

  removeIngredientFilter(ingredient: string): void {
    this.selectedIngredients.update((ingredients) => ingredients.filter((item) => item !== ingredient));
  }

  setSortOption(option: RecipeSortOption): void {
    this.sortOption.set(option);
  }

  applyCookTimePreset(value: number): void {
    this.maxCookTime.set(value);
  }

  clearSearchExperience(): void {
    this.searchTerm.set('');
    this.maxCookTime.set(DEFAULT_MAX_COOK_TIME);
    this.selectedDifficulties.set([]);
    this.selectedIngredients.set([]);
    this.sortOption.set('popular');
  }

  increaseServings(): void {
    this.servings.update(s => s + 1);
  }

  decreaseServings(): void {
    this.servings.update(s => Math.max(1, s - 1));
  }

  toggleFavorite(recipeId: number): void {
    this.recipes.update((recipes) => {
      return recipes.map((recipe) => {
        if (recipe.id !== recipeId) {
          return recipe;
        }

        return {
          ...recipe,
          isFavorite: !recipe.isFavorite,
        };
      });
    });
  }
  
}
