import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, UserCheck, Shirt } from 'lucide-react';
import { Product } from '@/types/product';
import maleAvatar from '@/assets/avatars/male-avatar.jpg';
import femaleAvatar from '@/assets/avatars/female-avatar.jpg';

interface AvatarDisplayProps {
  selectedProduct?: Product;
  onGenderChange: (gender: 'male' | 'female') => void;
}

export const AvatarDisplay = ({ selectedProduct, onGenderChange }: AvatarDisplayProps) => {
  const [currentGender, setCurrentGender] = useState<'male' | 'female'>('female');
  const [isChangingOutfit, setIsChangingOutfit] = useState(false);

  const handleGenderSwitch = (gender: 'male' | 'female') => {
    setCurrentGender(gender);
    onGenderChange(gender);
  };

  useEffect(() => {
    if (selectedProduct) {
      setIsChangingOutfit(true);
      // Simulate outfit change animation
      const timer = setTimeout(() => {
        setIsChangingOutfit(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedProduct]);

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shirt className="h-5 w-5" />
          Virtual Try-On
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Gender Selection */}
        <div className="flex gap-2">
          <Button
            variant={currentGender === 'male' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleGenderSwitch('male')}
            className="flex-1 gap-2"
          >
            <User className="h-4 w-4" />
            Male
          </Button>
          <Button
            variant={currentGender === 'female' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleGenderSwitch('female')}
            className="flex-1 gap-2"
          >
            <UserCheck className="h-4 w-4" />
            Female
          </Button>
        </div>

        {/* Avatar Display */}
        <div className="relative">
          <div className="aspect-[3/4] bg-gradient-to-br from-fashion-cream to-secondary rounded-lg overflow-hidden relative">
            <img
              src={currentGender === 'male' ? maleAvatar : femaleAvatar}
              alt={`${currentGender} avatar`}
              className={`w-full h-full object-cover transition-all duration-1000 ${
                isChangingOutfit ? 'scale-105 blur-sm' : 'scale-100 blur-0'
              }`}
            />
            
            {/* Outfit overlay effect */}
            {isChangingOutfit && (
              <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent animate-pulse" />
            )}
            
            {/* Current outfit indicator */}
            {selectedProduct && (
              <div className="absolute bottom-4 left-4 right-4">
                <Badge variant="secondary" className="w-full justify-center bg-white/90">
                  Wearing: {selectedProduct.name}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Avatar Info */}
        <div className="text-center space-y-2">
          <h3 className="font-semibold">
            {currentGender === 'male' ? 'Alex' : 'Emma'} - Virtual Model
          </h3>
          <p className="text-sm text-muted-foreground">
            {selectedProduct 
              ? `Trying on ${selectedProduct.category}` 
              : 'Select a product to see how it looks!'
            }
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            Save Look
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};