export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type RecipeCategory = 'Main Course' | 'Salad' | 'Bowl' | 'Pasta' | 'Curry' | 'Steak' | 'Stir-Fry';

export type Cuisine = 'Italian' | 'Mediterranean' | 'American' | 'Thai' | 'Asian' | 'Fusion';

export interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeModel {
  id: number;
  slug: string;
  name: string;
  description: string;
  imgUrl: string;
  imageAlt?: string;
  isFavorite: boolean;
  ingredients: Ingredient[];
  durationMinutes: number;
  prepMinutes?: number;
  cookMinutes?: number;
  servings?: number;
  calories?: number;
  difficulty: DifficultyLevel;
  category?: RecipeCategory;
  cuisine?: Cuisine;
  tags?: string[];
  rating: number;
  reviewCount: number;
  steps?: string[];
  tips?: string;
  featured?: boolean;
}

export type Recipe = RecipeModel;