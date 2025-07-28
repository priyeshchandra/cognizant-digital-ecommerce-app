import { useState } from 'react';
import { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onTryOn: (product: Product) => void;
  selected?: boolean;
}

export const ProductCard = ({ product, onSelect, onTryOn, selected }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-product overflow-hidden",
        selected && "ring-2 ring-accent"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(product)}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay buttons */}
        <div className={cn(
          "absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 flex items-center justify-center gap-2",
          isHovered && "opacity-100"
        )}>
          <Button
            size="sm"
            variant="secondary"
            className="gap-2"
            onClick={(e) => {
              e.stopPropagation();
              onTryOn(product);
            }}
          >
            <Eye className="h-4 w-4" />
            Try On
          </Button>
          <Button
            size="sm"
            variant="default"
            className="gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>

        {/* Wishlist button */}
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 p-2 hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
        >
          <Heart 
            className={cn(
              "h-4 w-4 transition-colors",
              isLiked ? "fill-red-500 text-red-500" : "text-white"
            )} 
          />
        </Button>

        {/* Category badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2 capitalize"
        >
          {product.category}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviews} reviews)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">${product.price}</span>
          <div className="flex gap-1">
            {product.colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-muted-foreground ml-1">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};