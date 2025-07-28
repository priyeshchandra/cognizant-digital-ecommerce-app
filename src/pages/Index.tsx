import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/ProductCard';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { ProductFilter } from '@/components/ProductFilter';
import { RecommendationEngine } from '@/components/RecommendationEngine';
import { ThemeSelector } from '@/components/ThemeSelector';
import { products } from '@/data/products';
import { Product } from '@/types/product';
import { toast } from 'sonner';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [userGender, setUserGender] = useState<'male' | 'female'>('female');
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Filter products based on category and search
  useEffect(() => {
    let filtered = products;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    toast.success(`Selected ${product.name} for virtual try-on!`);
  };

  const handleTryOn = (product: Product) => {
    setSelectedProduct(product);
    toast.success(`Trying on ${product.name} on your avatar!`);
  };

  const handleThemeChange = (theme: string) => {
    toast.success(`Theme changed to ${theme}!`);
    // Here you would implement actual theme switching logic
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
            
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeSelector onThemeChange={handleThemeChange} />
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Cart (0)
              </Button>
            </div>
          </div>
        </div>
      </header>

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
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {selectedCategory === 'all' ? 'All Products' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
              </h2>
              <p className="text-muted-foreground">
                Discover our latest collection of premium fashion items
              </p>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={handleProductSelect}
                  onTryOn={handleTryOn}
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
