import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Star, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface HeroCarouselProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const HeroCarousel = ({ products, onProductClick, onAddToCart }: HeroCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Get top-rated products for hero section
  const heroProducts = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-play functionality
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="relative mb-8">
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {heroProducts.map((product, index) => (
            <CarouselItem key={product.id}>
              <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-primary rounded-full blur-3xl" />
                  <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent rounded-full blur-3xl" />
                </div>

                <div className="relative h-full flex flex-col md:flex-row items-center p-6 md:p-12">
                  {/* Content Side */}
                  <div className="flex-1 z-10 text-center md:text-left space-y-4">
                    <Badge variant="secondary" className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      Featured Product
                    </Badge>
                    
                    <h2 className="text-2xl md:text-4xl font-bold text-foreground">
                      {product.name}
                    </h2>
                    
                    <p className="text-muted-foreground max-w-md">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{product.rating}</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{product.reviews} reviews</span>
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                      <span className="text-3xl font-bold text-primary">
                        ${product.price}
                      </span>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => onProductClick(product)}
                          className="gap-2"
                        >
                          View Details
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => onAddToCart(product)}
                          className="gap-2"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>

                    {/* Color Options Preview */}
                    <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
                      <span className="text-sm text-muted-foreground">Available in:</span>
                      <div className="flex gap-1">
                        {product.colors.slice(0, 4).map((color) => (
                          <div
                            key={color}
                            className="w-5 h-5 rounded-full border border-border shadow-sm"
                            style={{
                              backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' :
                                color.toLowerCase() === 'black' ? '#1a1a1a' :
                                color.toLowerCase() === 'blue' ? '#3b82f6' :
                                color.toLowerCase() === 'gray' ? '#6b7280' :
                                color.toLowerCase() === 'navy' ? '#1e3a5f' :
                                color.toLowerCase() === 'khaki' ? '#c3b091' :
                                color.toLowerCase() === 'olive' ? '#808000' :
                                color.toLowerCase() === 'light blue' ? '#87ceeb' :
                                color.toLowerCase() === 'pink' ? '#ffc0cb' :
                                color.toLowerCase()
                            }}
                            title={color}
                          />
                        ))}
                        {product.colors.length > 4 && (
                          <span className="text-xs text-muted-foreground ml-1">
                            +{product.colors.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Image Side */}
                  <div className="flex-1 relative hidden md:flex items-center justify-center">
                    <div className="relative w-64 h-64 lg:w-80 lg:h-80">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl" />
                      <img
                        src={product.image}
                        alt={product.name}
                        className="relative w-full h-full object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="left-4 bg-background/80 backdrop-blur hover:bg-background" />
        <CarouselNext className="right-4 bg-background/80 backdrop-blur hover:bg-background" />
      </Carousel>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              current === index
                ? "bg-primary w-8"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
