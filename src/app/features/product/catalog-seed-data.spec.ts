import { LOCAL_PRODUCT_CATALOG } from './local-product-catalog.seed';

describe('LOCAL_PRODUCT_CATALOG dataset integrity', () => {

  it('should have at least 30 catalog items', () => {
    expect(LOCAL_PRODUCT_CATALOG.length).toBeGreaterThanOrEqual(30);
  });

  it('should have unique catalog IDs', () => {
    const ids = LOCAL_PRODUCT_CATALOG.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have unique slugs', () => {
    const slugs = LOCAL_PRODUCT_CATALOG.map((item) => item.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('should have unique item names', () => {
    const names = LOCAL_PRODUCT_CATALOG.map((item) => item.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('should have varied ratings (not all the same)', () => {
    const ratings = new Set(LOCAL_PRODUCT_CATALOG.map((item) => item.rating));
    expect(ratings.size).toBeGreaterThan(1);
  });

  it('should have varied prices (not all the same)', () => {
    const prices = new Set(LOCAL_PRODUCT_CATALOG.map((item) => item.price));
    expect(prices.size).toBeGreaterThan(2);
  });

  it('should have valid ratings between 1 and 5', () => {
    for (const item of LOCAL_PRODUCT_CATALOG) {
      expect(item.rating).toBeGreaterThanOrEqual(1);
      expect(item.rating).toBeLessThanOrEqual(5);
    }
  });

  it('should have positive prices', () => {
    for (const item of LOCAL_PRODUCT_CATALOG) {
      expect(item.price).toBeGreaterThan(0);
    }
  });

  it('should keep compare-at prices above current price when present', () => {
    for (const item of LOCAL_PRODUCT_CATALOG) {
      if (item.compareAtPrice !== undefined) {
        expect(item.compareAtPrice).toBeGreaterThan(item.price);
      }
    }
  });

  it('should have non-empty required string fields', () => {
    for (const item of LOCAL_PRODUCT_CATALOG) {
      expect(item.name.trim().length).toBeGreaterThan(0);
      expect(item.slug.trim().length).toBeGreaterThan(0);
      expect(item.description.trim().length).toBeGreaterThan(0);
      expect(item.imgUrl.trim().length).toBeGreaterThan(0);
    }
  });

  it('should have slugs in valid kebab-case format', () => {
    const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    for (const item of LOCAL_PRODUCT_CATALOG) {
      expect(item.slug).toMatch(slugPattern);
    }
  });

  it('should keep optional highlights capped at five items', () => {
    for (const item of LOCAL_PRODUCT_CATALOG) {
      expect((item.highlights ?? []).length).toBeLessThanOrEqual(5);
    }
  });

  it('should have positive review counts', () => {
    for (const item of LOCAL_PRODUCT_CATALOG) {
      expect(item.reviewCount).toBeGreaterThan(0);
    }
  });
});
