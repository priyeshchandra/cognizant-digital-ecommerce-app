export interface Product {
  id: string;
  name: string;
  category: 'jeans' | 'shirts' | 'shorts' | 'shoes';
  price: number;
  image: string;
  hoverImage?: string;
  colors: string[];
  sizes: string[];
  description: string;
  rating: number;
  reviews: number;
}

export interface Avatar {
  id: string;
  gender: 'male' | 'female';
  image: string;
  outfit?: {
    productId: string;
    category: string;
  };
}

export interface User {
  id: string;
  preferences: {
    style: string[];
    colors: string[];
    brands: string[];
    size: string;
  };
  purchaseHistory: string[];
  demographics: {
    age: number;
    gender: string;
  };
}