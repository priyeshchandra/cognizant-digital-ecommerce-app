import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { ProductFilter } from '@/components/ProductFilter';
import { RecommendationEngine } from '@/components/RecommendationEngine';
import { ThemeSelector } from '@/components/ThemeSelector';
import { AdvancedSearchPanel } from '@/components/AdvancedSearchPanel';
import { HeroCarousel } from '@/components/HeroCarousel';
import { products } from '@/data/products';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import { ParsedSearchQuery, filterProductsByNLP } from '@/lib/nlpSearchParser';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [nlpQuery, setNlpQuery] = useState<ParsedSearchQuery | null>(null);
  const [userGender, setUserGender] = useState<'male' | 'female'>('female');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [cartItems, setCartItems] = useState<Product[]>([]);

  // Filter products based on category, search, and NLP query
  useEffect(() => {
    let filtered = products;
    
    // Apply category filter only if not using NLP search
    if (selectedCategory !== 'all' && !nlpQuery) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Apply NLP-based filtering if we have a parsed query
    if (nlpQuery) {
      filtered = filterProductsByNLP(products, nlpQuery);
    } else if (searchQuery) {
      // Fallback to basic text search if no NLP query
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, nlpQuery]);

  const handleNLPSearch = (query: string, parsedQuery: ParsedSearchQuery) => {
    setSearchQuery(query);
    setNlpQuery(parsedQuery);
    
    // Reset category filter when using NLP search
    if (parsedQuery.categories.length > 0 || parsedQuery.colors.length > 0 || 
        parsedQuery.fits.length > 0 || query) {
      setSelectedCategory('all');
    }
    
    const filterCount = parsedQuery.categories.length + parsedQuery.colors.length + 
      parsedQuery.fits.length + (parsedQuery.sortBy ? 1 : 0);
    
    if (filterCount > 0 || query) {
      toast.success(`Found ${filterProductsByNLP(products, parsedQuery).length} products matching your criteria`);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    toast.success(`Selected ${product.name} for virtual try-on!`);
  };

  const handleTryOn = (product: Product) => {
    setSelectedProduct(product);
    toast.success(`Trying on ${product.name} on your avatar!`);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => [...prev, product]);
    toast.success(`${product.name} added to cart!`);
  };

  const handleThemeChange = (theme: string) => {
    const root = document.documentElement;
    
    switch (theme) {
      case 'ocean':
        root.style.setProperty('--primary', '220 70% 50%');
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        root.style.setProperty('--accent', '210 60% 60%');
        break;
      case 'forest':
        root.style.setProperty('--primary', '120 60% 40%');
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        root.style.setProperty('--accent', '110 50% 50%');
        break;
      case 'sunset':
        root.style.setProperty('--primary', '25 95% 53%');
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        root.style.setProperty('--accent', '35 85% 60%');
        break;
      case 'royal':
        root.style.setProperty('--primary', '270 70% 50%');
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        root.style.setProperty('--accent', '280 60% 60%');
        break;
      default:
        root.style.setProperty('--primary', '222.2 84% 4.9%');
        root.style.setProperty('--primary-foreground', '210 40% 98%');
        root.style.setProperty('--accent', '210 40% 96%');
    }
    
    toast.success(`Theme changed to ${theme}!`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                FashionAI
              </h1>
            </div>
            

            <div className="flex items-center gap-2">
              <ThemeSelector onThemeChange={handleThemeChange} />
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Cart ({cartItems.length})
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Carousel */}
      <section className="container mx-auto px-4 pt-6">
        <HeroCarousel
          products={products}
          onProductClick={handleProductSelect}
          onAddToCart={handleAddToCart}
        />
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ProductFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <RecommendationEngine
              onProductSelect={handleProductSelect}
              userGender={userGender}
            />
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-2">
            {/* NLP Search Panel */}
            <AdvancedSearchPanel 
              onSearch={handleNLPSearch}
              className="mb-6"
            />

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {selectedCategory === 'all' ? 'All Products' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
              </h2>
              <p className="text-muted-foreground">
                {filteredProducts.length} products found
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={handleProductSelect}
                  onTryOn={handleTryOn}
                  onAddToCart={handleAddToCart}
                  selected={selectedProduct?.id === product.id}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No products found matching your criteria.
                </p>
              </div>
            )}
          </div>

          {/* Avatar Panel */}
          <div className="lg:col-span-1">
            <AvatarDisplay
              selectedProduct={selectedProduct}
              onGenderChange={setUserGender}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
