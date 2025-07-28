import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Camera, User } from 'lucide-react';
import { Product } from '@/types/product';
import { products } from '@/data/products';

interface RecommendationEngineProps {
  onProductSelect: (product: Product) => void;
  userGender: 'male' | 'female';
}

export const RecommendationEngine = ({ onProductSelect, userGender }: RecommendationEngineProps) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisType, setAnalysisType] = useState<'preference' | 'facial' | null>(null);

  const generatePersonalizedRecommendations = () => {
    setIsAnalyzing(true);
    setAnalysisType('preference');
    
    // Simulate AI-based recommendation algorithm
    setTimeout(() => {
      const personalizedProducts = products
        .slice(0, 3)
        .map(product => ({
          ...product,
          recommendationScore: Math.floor(Math.random() * 30) + 70 // 70-99% match
        }));
      
      setRecommendations(personalizedProducts);
      setIsAnalyzing(false);
    }, 2000);
  };

  const startFacialAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisType('facial');
    
    try {
      // Simulate facial recognition analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate recommendations based on "facial analysis"
      const facialRecommendations = products
        .slice(2, 5)
        .map(product => ({
          ...product,
          recommendationScore: Math.floor(Math.random() * 25) + 75, // 75-99% match
          facialMatch: true
        }));
      
      setRecommendations(facialRecommendations);
    } catch (error) {
      console.error('Facial analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    // Auto-generate basic recommendations on component mount
    generatePersonalizedRecommendations();
  }, [userGender]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Analysis Controls */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generatePersonalizedRecommendations}
            disabled={isAnalyzing}
            className="flex-1 gap-2"
          >
            <User className="h-4 w-4" />
            Analyze Style
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={startFacialAnalysis}
            disabled={isAnalyzing}
            className="flex-1 gap-2"
          >
            <Camera className="h-4 w-4" />
            Face Scan
          </Button>
        </div>

        {/* Analysis Status */}
        {isAnalyzing && (
          <div className="text-center py-4">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full mb-2" />
            <p className="text-sm text-muted-foreground">
              {analysisType === 'facial' 
                ? 'Analyzing facial features for best matches...' 
                : 'Processing your style preferences...'
              }
            </p>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && !isAnalyzing && (
          <div className="space-y-3">
            <h4 className="font-medium">
              Recommended for you
              {analysisType === 'facial' && (
                <Badge variant="secondary" className="ml-2">AI Matched</Badge>
              )}
            </h4>
            
            {recommendations.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onProductSelect(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm truncate">{product.name}</h5>
                  <p className="text-xs text-muted-foreground">${product.price}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    {(product as any).recommendationScore}% match
                  </Badge>
                  {(product as any).facialMatch && (
                    <Badge variant="secondary" className="text-xs ml-1">
                      Face Match
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommendation Stats */}
        <div className="text-center text-xs text-muted-foreground pt-2 border-t">
          AI-powered recommendations based on {userGender} preferences
          {analysisType === 'facial' && ' and facial analysis'}
        </div>
      </CardContent>
    </Card>
  );
};