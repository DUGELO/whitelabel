import { MOCK_RECIPES } from './mock-recipes';
import { RecipeModel } from './models';

describe('MOCK_RECIPES dataset integrity', () => {

  it('should have at least 30 recipes', () => {
    expect(MOCK_RECIPES.length).toBeGreaterThanOrEqual(30);
  });

  it('should have unique recipe IDs', () => {
    const ids = MOCK_RECIPES.map(r => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have unique slugs', () => {
    const slugs = MOCK_RECIPES.map(r => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('should have unique recipe names', () => {
    const names = MOCK_RECIPES.map(r => r.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('should have globally unique ingredient IDs', () => {
    const allIngredientIds = MOCK_RECIPES.flatMap(r => r.ingredients.map(i => i.id));
    expect(new Set(allIngredientIds).size).toBe(allIngredientIds.length);
  });

  it('should have at least one recipe for each difficulty level', () => {
    const difficulties = new Set(MOCK_RECIPES.map(r => r.difficulty));
    expect(difficulties.has('Easy')).toBe(true);
    expect(difficulties.has('Medium')).toBe(true);
    expect(difficulties.has('Hard')).toBe(true);
  });

  it('should have varied ratings (not all the same)', () => {
    const ratings = new Set(MOCK_RECIPES.map(r => r.rating));
    expect(ratings.size).toBeGreaterThan(1);
  });

  it('should have varied durations (not all the same)', () => {
    const durations = new Set(MOCK_RECIPES.map(r => r.durationMinutes));
    expect(durations.size).toBeGreaterThan(2);
  });

  it('should have valid ratings between 1 and 5', () => {
    for (const recipe of MOCK_RECIPES) {
      expect(recipe.rating).toBeGreaterThanOrEqual(1);
      expect(recipe.rating).toBeLessThanOrEqual(5);
    }
  });

  it('should have positive durations', () => {
    for (const recipe of MOCK_RECIPES) {
      expect(recipe.durationMinutes).toBeGreaterThan(0);
    }
  });

  it('should have at least one ingredient per recipe', () => {
    for (const recipe of MOCK_RECIPES) {
      expect(recipe.ingredients.length).toBeGreaterThan(0);
    }
  });

  it('should have non-empty required string fields', () => {
    for (const recipe of MOCK_RECIPES) {
      expect(recipe.name.trim().length).toBeGreaterThan(0);
      expect(recipe.slug.trim().length).toBeGreaterThan(0);
      expect(recipe.description.trim().length).toBeGreaterThan(0);
      expect(recipe.imgUrl.trim().length).toBeGreaterThan(0);
    }
  });

  it('should have slugs in valid kebab-case format', () => {
    const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    for (const recipe of MOCK_RECIPES) {
      expect(recipe.slug).toMatch(slugPattern);
    }
  });

  it('should have steps and tips for all recipes', () => {
    for (const recipe of MOCK_RECIPES) {
      expect(recipe.steps?.length).toBeGreaterThan(0);
      expect(recipe.tips?.trim().length).toBeGreaterThan(0);
    }
  });

  it('should have positive review counts', () => {
    for (const recipe of MOCK_RECIPES) {
      expect(recipe.reviewCount).toBeGreaterThan(0);
    }
  });
});
