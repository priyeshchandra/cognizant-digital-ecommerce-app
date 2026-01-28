import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipForward, 
  X, 
  Mic, 
  Search, 
  SlidersHorizontal,
  Sparkles,
  User,
  Palette,
  ChevronRight
} from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  icon: React.ReactNode;
  highlight: string; // CSS selector or area to highlight
  phase: 'nlp-search' | 'other-features';
}

const demoSteps: DemoStep[] = [
  // NLP Search Phase (40 seconds total)
  {
    id: 'intro',
    title: 'Welcome to FashionAI',
    description: 'Experience the future of fashion shopping with AI-powered features. Let\'s take a quick tour!',
    duration: 5,
    icon: <Sparkles className="h-6 w-6" />,
    highlight: 'header',
    phase: 'nlp-search'
  },
  {
    id: 'voice-search',
    title: 'Voice-Powered Search',
    description: 'Click the microphone button and speak naturally. Say things like "Show me blue slim fit jeans under $100"',
    duration: 10,
    icon: <Mic className="h-6 w-6" />,
    highlight: 'voice-button',
    phase: 'nlp-search'
  },
  {
    id: 'nlp-understanding',
    title: 'Natural Language Understanding',
    description: 'Our AI understands your intent - parsing colors, fits, categories, and price ranges from everyday language.',
    duration: 10,
    icon: <Search className="h-6 w-6" />,
    highlight: 'search-panel',
    phase: 'nlp-search'
  },
  {
    id: 'real-time-transcription',
    title: 'Real-Time Transcription',
    description: 'Watch your words appear as you speak. The system transcribes and processes your query instantly.',
    duration: 8,
    icon: <Mic className="h-6 w-6 text-destructive" />,
    highlight: 'transcript',
    phase: 'nlp-search'
  },
  {
    id: 'advanced-filters',
    title: 'Smart Filtering',
    description: 'Results automatically filter by category, color, fit, and price - all extracted from your natural query.',
    duration: 7,
    icon: <SlidersHorizontal className="h-6 w-6" />,
    highlight: 'filters',
    phase: 'nlp-search'
  },
  // Other Features Phase (20 seconds total)
  {
    id: 'ai-recommendations',
    title: 'AI Product Recommendations',
    description: 'Get personalized suggestions with match percentages. Our AI analyzes your preferences to find perfect fits.',
    duration: 6,
    icon: <Sparkles className="h-6 w-6" />,
    highlight: 'recommendations',
    phase: 'other-features'
  },
  {
    id: 'virtual-tryon',
    title: 'Virtual Try-On',
    description: 'See how clothes look on realistic avatars. Switch between body types for inclusive visualization.',
    duration: 7,
    icon: <User className="h-6 w-6" />,
    highlight: 'avatar',
    phase: 'other-features'
  },
  {
    id: 'themes',
    title: 'Personalized Themes',
    description: 'Customize your experience with dynamic themes - Ocean, Forest, Sunset, or Royal. Make it yours!',
    duration: 7,
    icon: <Palette className="h-6 w-6" />,
    highlight: 'theme-selector',
    phase: 'other-features'
  }
];

interface DemoTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoTour = ({ isOpen, onClose }: DemoTourProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [stepProgress, setStepProgress] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);

  const currentStep = demoSteps[currentStepIndex];
  const totalDuration = demoSteps.reduce((sum, step) => sum + step.duration, 0);
  const nlpDuration = demoSteps.filter(s => s.phase === 'nlp-search').reduce((sum, step) => sum + step.duration, 0);

  const nextStep = useCallback(() => {
    if (currentStepIndex < demoSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setStepProgress(0);
    } else {
      setIsPlaying(false);
      onClose();
    }
  }, [currentStepIndex, onClose]);

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying || !isOpen) return;

    const interval = setInterval(() => {
      setStepProgress(prev => {
        const newProgress = prev + (100 / (currentStep.duration * 10));
        if (newProgress >= 100) {
          nextStep();
          return 0;
        }
        return newProgress;
      });
      setTotalElapsed(prev => prev + 0.1);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, isOpen, currentStep.duration, nextStep]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setStepProgress(0);
      setTotalElapsed(0);
      setIsPlaying(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const phaseProgress = currentStep.phase === 'nlp-search' 
    ? (totalElapsed / nlpDuration) * 100
    : ((totalElapsed - nlpDuration) / (totalDuration - nlpDuration)) * 100;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-50 animate-fade-in" />

      {/* Demo Panel */}
      <Card className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl p-6 animate-scale-in shadow-2xl border-primary/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 text-primary animate-pulse">
              {currentStep.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg">{currentStep.title}</h3>
              <p className="text-xs text-muted-foreground">
                Step {currentStepIndex + 1} of {demoSteps.length}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {currentStep.description}
        </p>

        {/* Phase Indicator */}
        <div className="flex gap-2 mb-4">
          <div 
            className={`flex-1 rounded-full h-2 transition-all ${
              currentStep.phase === 'nlp-search' ? 'bg-primary' : 'bg-primary/30'
            }`}
          >
            <div 
              className="h-full bg-primary rounded-full transition-all"
              style={{ 
                width: currentStep.phase === 'nlp-search' ? `${Math.min(phaseProgress, 100)}%` : '100%',
                opacity: currentStep.phase === 'nlp-search' ? 1 : 0.3
              }}
            />
          </div>
          <div 
            className={`flex-[0.5] rounded-full h-2 transition-all ${
              currentStep.phase === 'other-features' ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <div 
              className="h-full bg-primary rounded-full transition-all"
              style={{ 
                width: currentStep.phase === 'other-features' ? `${Math.min(phaseProgress, 100)}%` : '0%'
              }}
            />
          </div>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground mb-4">
          <span className={currentStep.phase === 'nlp-search' ? 'text-primary font-medium' : ''}>
            🎤 NLP Voice Search (40s)
          </span>
          <span className={currentStep.phase === 'other-features' ? 'text-primary font-medium' : ''}>
            ✨ Other Features (20s)
          </span>
        </div>

        {/* Step Progress */}
        <Progress value={stepProgress} className="h-1 mb-4" />

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={nextStep}
              disabled={currentStepIndex >= demoSteps.length - 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            {formatTime(totalElapsed)} / {formatTime(totalDuration)}
          </div>

          <Button onClick={nextStep} className="gap-2">
            {currentStepIndex < demoSteps.length - 1 ? (
              <>Next <ChevronRight className="h-4 w-4" /></>
            ) : (
              'Finish Tour'
            )}
          </Button>
        </div>

        {/* Step Dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {demoSteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => {
                setCurrentStepIndex(index);
                setStepProgress(0);
                // Calculate elapsed time up to this step
                const elapsed = demoSteps.slice(0, index).reduce((sum, s) => sum + s.duration, 0);
                setTotalElapsed(elapsed);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStepIndex 
                  ? 'bg-primary w-6' 
                  : index < currentStepIndex 
                    ? 'bg-primary/50' 
                    : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </Card>

      {/* Highlight Pointer */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="flex flex-col items-center animate-bounce">
          <div className="w-4 h-4 border-2 border-primary rounded-full bg-primary/30" />
          <div className="w-0.5 h-8 bg-primary/50" />
        </div>
      </div>
    </>
  );
};
