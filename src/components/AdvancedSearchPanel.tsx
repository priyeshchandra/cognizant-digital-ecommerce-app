import { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, Filter, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  ParsedSearchQuery, 
  parseNaturalLanguageQuery, 
  getSearchSuggestions,
  getActiveFilters 
} from '@/lib/nlpSearchParser';
import { cn } from '@/lib/utils';

interface AdvancedSearchPanelProps {
  onSearch: (query: string, parsedQuery: ParsedSearchQuery) => void;
  className?: string;
}

const categories = ['jeans', 'shirts', 'shorts', 'shoes'];
const colors = ['blue', 'black', 'white', 'gray', 'khaki', 'olive', 'navy', 'pink'];
const fits = ['slim', 'regular', 'relaxed', 'modern'];

export function AdvancedSearchPanel({ onSearch, className }: AdvancedSearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [parsedQuery, setParsedQuery] = useState<ParsedSearchQuery | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Advanced filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFits, setSelectedFits] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150]);
  const [sortBy, setSortBy] = useState<ParsedSearchQuery['sortBy']>();

  useEffect(() => {
    if (searchQuery.length > 0) {
      const parsed = parseNaturalLanguageQuery(searchQuery);
      setParsedQuery(parsed);
      setSuggestions(getSearchSuggestions(searchQuery));
    } else {
      setParsedQuery(null);
      setSuggestions(getSearchSuggestions(''));
    }
  }, [searchQuery]);

  const handleSearch = () => {
    let finalQuery: ParsedSearchQuery;
    
    if (searchQuery) {
      finalQuery = parseNaturalLanguageQuery(searchQuery);
    } else {
      finalQuery = {
        categories: selectedCategories,
        colors: selectedColors,
        fits: selectedFits,
        priceRange: { min: priceRange[0], max: priceRange[1] },
        keywords: [],
        sortBy,
      };
    }
    
    // Merge with manual selections if any
    if (selectedCategories.length > 0 && !searchQuery) {
      finalQuery.categories = selectedCategories;
    }
    if (selectedColors.length > 0 && !searchQuery) {
      finalQuery.colors = selectedColors;
    }
    if (selectedFits.length > 0 && !searchQuery) {
      finalQuery.fits = selectedFits;
    }
    if (sortBy && !searchQuery) {
      finalQuery.sortBy = sortBy;
    }
    
    onSearch(searchQuery, finalQuery);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    const parsed = parseNaturalLanguageQuery(suggestion);
    onSearch(suggestion, parsed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setParsedQuery(null);
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedFits([]);
    setPriceRange([0, 150]);
    setSortBy(undefined);
    onSearch('', {
      categories: [],
      colors: [],
      fits: [],
      priceRange: {},
      keywords: [],
    });
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const toggleFit = (fit: string) => {
    setSelectedFits(prev => 
      prev.includes(fit) 
        ? prev.filter(f => f !== fit)
        : [...prev, fit]
    );
  };

  const activeFilters = parsedQuery ? getActiveFilters(parsedQuery) : [];
  const hasActiveFilters = activeFilters.length > 0 || selectedCategories.length > 0 || 
    selectedColors.length > 0 || selectedFits.length > 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Search Bar */}
      <div className="relative">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary h-4 w-4" />
            <Input
              ref={inputRef}
              placeholder="Try: 'blue slim jeans under $100' or 'casual shirts top rated'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-10 h-12 text-base border-primary/20 focus:border-primary"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button onClick={handleSearch} className="h-12 px-6">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* AI-Powered Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden">
            <div className="p-2 border-b border-border bg-muted/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lightbulb className="h-3 w-3" />
                <span>Try natural language queries</span>
              </div>
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center gap-3 text-sm"
                onMouseDown={() => handleSuggestionClick(suggestion)}
              >
                <Search className="h-4 w-4 text-muted-foreground" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Parsed Query Preview */}
      {parsedQuery && activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted-foreground">Detected:</span>
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {filter}
            </Badge>
          ))}
        </div>
      )}

      {/* Advanced Filters Toggle */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Advanced Filters</span>
              {hasActiveFilters && !showAdvanced && (
                <Badge variant="default" className="ml-2">Active</Badge>
              )}
            </div>
            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-4 space-y-6 p-4 border border-border rounded-lg bg-muted/20">
          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Categories</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategories.includes(category) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Colors</Label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <Button
                  key={color}
                  variant={selectedColors.includes(color) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleColor(color)}
                  className="capitalize gap-2"
                >
                  <div 
                    className="w-3 h-3 rounded-full border border-border" 
                    style={{ 
                      backgroundColor: color === 'white' ? '#f5f5f5' : 
                        color === 'khaki' ? '#c3b091' :
                        color === 'olive' ? '#808000' :
                        color === 'navy' ? '#000080' : color 
                    }} 
                  />
                  {color}
                </Button>
              ))}
            </div>
          </div>

          {/* Fits */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Fit Style</Label>
            <div className="flex flex-wrap gap-2">
              {fits.map(fit => (
                <Button
                  key={fit}
                  variant={selectedFits.includes(fit) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFit(fit)}
                  className="capitalize"
                >
                  {fit}
                </Button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Price Range</Label>
              <span className="text-sm text-muted-foreground">
                ${priceRange[0]} - ${priceRange[1]}
              </span>
            </div>
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              max={150}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          {/* Sort By */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Sort By</Label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'price-low' as const, label: 'Price: Low to High' },
                { value: 'price-high' as const, label: 'Price: High to Low' },
                { value: 'rating' as const, label: 'Top Rated' },
                { value: 'reviews' as const, label: 'Most Popular' },
              ].map(option => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(sortBy === option.value ? undefined : option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSearch} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={clearSearch}>
              Clear All
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
