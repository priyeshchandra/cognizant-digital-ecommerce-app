import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, UserCheck, Shirt } from 'lucide-react';
import { Product } from '@/types/product';
import maleAvatar from '@/assets/avatars/stylish-male-model.jpg';
import femaleAvatar from '@/assets/avatars/stylish-female-model.jpg';
import maleShirtAvatar from '@/assets/avatars/male-model-shirt.jpg';
import femaleShirtAvatar from '@/assets/avatars/female-model-shirt.jpg';
import maleJeansAvatar from '@/assets/avatars/male-model-jeans.jpg';
import femaleJeansAvatar from '@/assets/avatars/female-model-jeans.jpg';
import maleShortsAvatar from '@/assets/avatars/male-model-shorts.jpg';
import femaleShortsAvatar from '@/assets/avatars/female-model-shorts.jpg';
import maleShoesAvatar from '@/assets/avatars/male-model-shoes.jpg';
import femaleShoesAvatar from '@/assets/avatars/female-model-shoes.jpg';
import maleClassicJeansAvatar from '@/assets/avatars/male-model-classic-jeans.jpg';
import femaleClassicJeansAvatar from '@/assets/avatars/female-model-classic-jeans.jpg';
import maleSlimJeansAvatar from '@/assets/avatars/male-model-slim-jeans.jpg';
import femaleSlimJeansAvatar from '@/assets/avatars/female-model-slim-jeans.jpg';

interface AvatarDisplayProps {
  selectedProduct?: Product;
  onGenderChange: (gender: 'male' | 'female') => void;
}

export const AvatarDisplay = ({ selectedProduct, onGenderChange }: AvatarDisplayProps) => {
  const [currentGender, setCurrentGender] = useState<'male' | 'female'>('female');
  const [isChangingOutfit, setIsChangingOutfit] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const handleGenderSwitch = (gender: 'male' | 'female') => {
    setCurrentGender(gender);
    onGenderChange(gender);
  };

  const getAvatarImage = () => {
    if (!selectedProduct) {
      return currentGender === 'male' ? maleAvatar : femaleAvatar;
    }

    const category = selectedProduct.category;
    if (currentGender === 'male') {
      switch (category) {
        case 'shirts': return maleShirtAvatar;
        case 'jeans': 
          return selectedProduct.name.toLowerCase().includes('slim') 
            ? maleSlimJeansAvatar 
            : maleClassicJeansAvatar;
        case 'shorts': return maleShortsAvatar;
        case 'shoes': return maleShoesAvatar;
        default: return maleAvatar;
      }
    } else {
      switch (category) {
        case 'shirts': return femaleShirtAvatar;
        case 'jeans': 
          return selectedProduct.name.toLowerCase().includes('slim') 
            ? femaleSlimJeansAvatar 
            : femaleClassicJeansAvatar;
        case 'shorts': return femaleShortsAvatar;
        case 'shoes': return femaleShoesAvatar;
        default: return femaleAvatar;
      }
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      setIsChangingOutfit(true);
      setIsScanning(true);
      setScanProgress(0);
      
      // Simulate scanning progress
      const scanInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(scanInterval);
            setIsScanning(false);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      
      // Complete outfit change
      const timer = setTimeout(() => {
        setIsChangingOutfit(false);
        setScanProgress(0);
      }, 3000);
      
      return () => {
        clearTimeout(timer);
        clearInterval(scanInterval);
      };
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
              src={getAvatarImage()}
              alt={`${currentGender} avatar`}
              className={`w-full h-full object-cover transition-all duration-1000 ${
                isChangingOutfit ? 'scale-105 blur-sm' : 'scale-100 blur-0'
              }`}
            />
            
            {/* Scanning Progress Bar */}
            {isScanning && (
              <div className="absolute inset-0">
                <div 
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-80 transition-all duration-100 ease-linear"
                  style={{ 
                    top: `${scanProgress}%`,
                    transform: 'translateY(-50%)',
                    boxShadow: '0 0 10px rgba(var(--primary), 0.5)'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent animate-pulse" />
              </div>
            )}
            
            {/* Outfit overlay effect */}
            {isChangingOutfit && !isScanning && (
              <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent animate-pulse" />
            )}
            
            {/* Current outfit indicator */}
            {selectedProduct && (
              <div className="absolute bottom-4 left-4 right-4">
                <Badge variant="secondary" className="w-full justify-center bg-white/90">
                  {isScanning ? `Applying ${selectedProduct.name}... ${scanProgress}%` : `Wearing: ${selectedProduct.name}`}
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