import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import { DemoTour } from './DemoTour';

export const DemoTourButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="gap-2 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 hover:border-primary/50 transition-all"
      >
        <PlayCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Demo Tour</span>
        <span className="text-xs text-muted-foreground">(60s)</span>
      </Button>

      <DemoTour isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
