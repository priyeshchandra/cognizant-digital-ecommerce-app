import { Product } from '@/types/product';

export interface ParsedSearchQuery {
  categories: string[];
  colors: string[];
  fits: string[];
  priceRange: { min?: number; max?: number };
  keywords: string[];
  sortBy?: 'price-low' | 'price-high' | 'rating' | 'reviews';
}

// Color synonyms and variations
const colorMappings: Record<string, string[]> = {
  'blue': ['blue', 'navy', 'light blue', 'dark blue', 'azure', 'cobalt', 'indigo'],
  'black': ['black', 'dark', 'ebony', 'jet'],
  'white': ['white', 'cream', 'ivory', 'off-white'],
  'gray': ['gray', 'grey', 'charcoal', 'silver', 'slate'],
  'khaki': ['khaki', 'tan', 'beige', 'sand'],
  'olive': ['olive', 'army', 'military green'],
  'pink': ['pink', 'rose', 'blush'],
  'navy': ['navy', 'nautical', 'maritime'],
};

// Fit types and synonyms
const fitMappings: Record<string, string[]> = {
  'slim': ['slim', 'skinny', 'fitted', 'tight', 'narrow', 'tapered'],
  'regular': ['regular', 'standard', 'normal', 'classic'],
  'relaxed': ['relaxed', 'loose', 'comfortable', 'baggy', 'wide'],
  'modern': ['modern', 'contemporary', 'urban', 'trendy'],
};

// Category synonyms
const categoryMappings: Record<string, string[]> = {
  'jeans': ['jeans', 'denim', 'pants', 'trousers'],
  'shirts': ['shirts', 'shirt', 'top', 'tops', 'blouse', 'tee', 't-shirt'],
  'shorts': ['shorts', 'short pants', 'bermudas', 'cargo shorts'],
  'shoes': ['shoes', 'sneakers', 'footwear', 'kicks', 'trainers'],
};

// Price indicator keywords
const priceKeywords: Record<string, { min?: number; max?: number }> = {
  cheap: { max: 50 },
  affordable: { max: 60 },
  budget: { max: 50 },
  expensive: { min: 80 },
  premium: { min: 70 },
  luxury: { min: 90 },
  mid: { min: 40, max: 70 },
  moderate: { min: 40, max: 70 },
};

// Sort keywords
const sortKeywords: Record<string, ParsedSearchQuery['sortBy']> = {
  'cheapest': 'price-low',
  'lowest price': 'price-low',
  'most expensive': 'price-high',
  'highest price': 'price-high',
  'best rated': 'rating',
  'top rated': 'rating',
  'highest rated': 'rating',
  'most reviewed': 'reviews',
  'popular': 'reviews',
  'most popular': 'reviews',
};

export function parseNaturalLanguageQuery(query: string): ParsedSearchQuery {
  const normalizedQuery = query.toLowerCase().trim();
  
  const result: ParsedSearchQuery = {
    categories: [],
    colors: [],
    fits: [],
    priceRange: {},
    keywords: [],
  };

  // Extract categories
  for (const [category, synonyms] of Object.entries(categoryMappings)) {
    if (synonyms.some(syn => normalizedQuery.includes(syn))) {
      result.categories.push(category);
    }
  }

  // Extract colors
  for (const [color, synonyms] of Object.entries(colorMappings)) {
    if (synonyms.some(syn => normalizedQuery.includes(syn))) {
      result.colors.push(color);
    }
  }

  // Extract fits
  for (const [fit, synonyms] of Object.entries(fitMappings)) {
    if (synonyms.some(syn => normalizedQuery.includes(syn))) {
      result.fits.push(fit);
    }
  }

  // Extract price range
  for (const [keyword, range] of Object.entries(priceKeywords)) {
    if (normalizedQuery.includes(keyword)) {
      if (range.max !== undefined) result.priceRange.max = range.max;
      if (range.min !== undefined) result.priceRange.min = range.min;
    }
  }

  // Extract price from "under $X" or "below $X" patterns
  const underPriceMatch = normalizedQuery.match(/(?:under|below|less than|max|maximum)\s*\$?(\d+)/);
  if (underPriceMatch) {
    result.priceRange.max = parseInt(underPriceMatch[1]);
  }

  // Extract price from "over $X" or "above $X" patterns
  const overPriceMatch = normalizedQuery.match(/(?:over|above|more than|min|minimum)\s*\$?(\d+)/);
  if (overPriceMatch) {
    result.priceRange.min = parseInt(overPriceMatch[1]);
  }

  // Extract price range "between $X and $Y"
  const rangeMatch = normalizedQuery.match(/between\s*\$?(\d+)\s*(?:and|to|-)\s*\$?(\d+)/);
  if (rangeMatch) {
    result.priceRange.min = parseInt(rangeMatch[1]);
    result.priceRange.max = parseInt(rangeMatch[2]);
  }

  // Extract sort preference
  for (const [keyword, sortType] of Object.entries(sortKeywords)) {
    if (normalizedQuery.includes(keyword)) {
      result.sortBy = sortType;
    }
  }

  // Extract remaining keywords for basic text search
  const words = normalizedQuery.split(/\s+/).filter(word => 
    word.length > 2 && 
    !['show', 'me', 'the', 'find', 'get', 'with', 'and', 'for', 'that', 'are', 'have', 'has'].includes(word)
  );
  result.keywords = words;

  return result;
}

export function filterProductsByNLP(products: Product[], parsedQuery: ParsedSearchQuery): Product[] {
  let filtered = [...products];

  // Filter by category
  if (parsedQuery.categories.length > 0) {
    filtered = filtered.filter(product => 
      parsedQuery.categories.includes(product.category)
    );
  }

  // Filter by color
  if (parsedQuery.colors.length > 0) {
    filtered = filtered.filter(product => 
      product.colors.some(productColor => 
        parsedQuery.colors.some(searchColor => 
          productColor.toLowerCase().includes(searchColor) ||
          searchColor.includes(productColor.toLowerCase())
        )
      )
    );
  }

  // Filter by fit (check in name and description)
  if (parsedQuery.fits.length > 0) {
    filtered = filtered.filter(product => {
      const productText = `${product.name} ${product.description}`.toLowerCase();
      return parsedQuery.fits.some(fit => productText.includes(fit));
    });
  }

  // Filter by price range
  if (parsedQuery.priceRange.min !== undefined) {
    filtered = filtered.filter(product => product.price >= parsedQuery.priceRange.min!);
  }
  if (parsedQuery.priceRange.max !== undefined) {
    filtered = filtered.filter(product => product.price <= parsedQuery.priceRange.max!);
  }

  // Filter by keywords (in name and description)
  if (parsedQuery.keywords.length > 0) {
    filtered = filtered.filter(product => {
      const productText = `${product.name} ${product.description}`.toLowerCase();
      return parsedQuery.keywords.some(keyword => productText.includes(keyword));
    });
  }

  // Sort results
  if (parsedQuery.sortBy) {
    switch (parsedQuery.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
    }
  }

  return filtered;
}

export function getSearchSuggestions(query: string): string[] {
  const suggestions = [
    "blue jeans with slim fit",
    "casual shirts under $50",
    "black sneakers top rated",
    "summer shorts in khaki",
    "premium denim jeans",
    "comfortable shoes for everyday",
    "formal white shirt",
    "cargo shorts olive color",
  ];

  if (!query) return suggestions.slice(0, 4);

  return suggestions.filter(s => 
    s.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);
}

export function getActiveFilters(parsedQuery: ParsedSearchQuery): string[] {
  const filters: string[] = [];
  
  if (parsedQuery.categories.length > 0) {
    filters.push(...parsedQuery.categories.map(c => `Category: ${c}`));
  }
  if (parsedQuery.colors.length > 0) {
    filters.push(...parsedQuery.colors.map(c => `Color: ${c}`));
  }
  if (parsedQuery.fits.length > 0) {
    filters.push(...parsedQuery.fits.map(f => `Fit: ${f}`));
  }
  if (parsedQuery.priceRange.min !== undefined || parsedQuery.priceRange.max !== undefined) {
    const min = parsedQuery.priceRange.min ?? 0;
    const max = parsedQuery.priceRange.max ?? '∞';
    filters.push(`Price: $${min} - $${max}`);
  }
  if (parsedQuery.sortBy) {
    const sortLabels = {
      'price-low': 'Lowest Price',
      'price-high': 'Highest Price',
      'rating': 'Top Rated',
      'reviews': 'Most Popular',
    };
    filters.push(`Sort: ${sortLabels[parsedQuery.sortBy]}`);
  }

  return filters;
}
