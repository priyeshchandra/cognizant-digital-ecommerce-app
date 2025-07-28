import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, X } from 'lucide-react';

interface ProductFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const ProductFilter = ({ selectedCategory, onCategoryChange }: ProductFilterProps) => {
  const categories = [
    { id: 'all', name: 'All Products', icon: '👕' },
    { id: 'jeans', name: 'Jeans', icon: '👖' },
    { id: 'shirts', name: 'Shirts', icon: '👔' },
    { id: 'shorts', name: 'Shorts', icon: '🩳' },
    { id: 'shoes', name: 'Shoes', icon: '👟' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'ghost'}
            className="w-full justify-start gap-3"
            onClick={() => onCategoryChange(category.id)}
          >
            <span className="text-lg">{category.icon}</span>
            {category.name}
            {selectedCategory === category.id && (
              <Badge variant="secondary" className="ml-auto">
                Active
              </Badge>
            )}
          </Button>
        ))}
        
        {selectedCategory !== 'all' && (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 mt-4"
            onClick={() => onCategoryChange('all')}
          >
            <X className="h-4 w-4" />
            Clear Filter
          </Button>
        )}
      </CardContent>
    </Card>
  );
};