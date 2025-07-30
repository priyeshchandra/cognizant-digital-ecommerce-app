import { Product } from '@/types/product';
import jeans1 from '@/assets/products/jeans-1.jpg';
import shirt1 from '@/assets/products/shirt-1.jpg';
import shorts1 from '@/assets/products/shorts-1.jpg';
import shoes1 from '@/assets/products/shoes-1.jpg';
import blackJeans1 from '@/assets/products/black-jeans-1.jpg';

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Blue Jeans',
    category: 'jeans',
    price: 89.99,
    image: jeans1,
    colors: ['Blue', 'Black', 'Gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Premium denim jeans with perfect fit and comfort.',
    rating: 4.5,
    reviews: 128
  },
  {
    id: '2',
    name: 'Cotton Casual Shirt',
    category: 'shirts',
    price: 49.99,
    image: shirt1,
    colors: ['White', 'Blue', 'Gray', 'Black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Comfortable cotton shirt perfect for any occasion.',
    rating: 4.3,
    reviews: 94
  },
  {
    id: '3',
    name: 'Summer Cargo Shorts',
    category: 'shorts',
    price: 39.99,
    image: shorts1,
    colors: ['Khaki', 'Navy', 'Black', 'Olive'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Breathable cargo shorts with multiple pockets.',
    rating: 4.2,
    reviews: 67
  },
  {
    id: '4',
    name: 'Urban Sneakers',
    category: 'shoes',
    price: 79.99,
    image: shoes1,
    colors: ['White', 'Black', 'Gray', 'Navy'],
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    description: 'Comfortable sneakers for everyday wear.',
    rating: 4.6,
    reviews: 156
  },
  {
    id: '5',
    name: 'Slim Fit Black Jeans',
    category: 'jeans',
    price: 94.99,
    image: blackJeans1,
    colors: ['Black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Modern slim fit black jeans with stretch comfort.',
    rating: 4.4,
    reviews: 89
  },
  {
    id: '6',
    name: 'Formal Dress Shirt',
    category: 'shirts',
    price: 69.99,
    image: shirt1,
    colors: ['White', 'Light Blue', 'Pink', 'Gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Professional dress shirt for business occasions.',
    rating: 4.7,
    reviews: 203
  }
];

export const getProductsByCategory = (category: string) => {
  return products.filter(product => product.category === category);
};

export const getRecommendedProducts = (userId: string, limit: number = 4) => {
  // Simulate AI-based recommendations
  return products.slice(0, limit);
};