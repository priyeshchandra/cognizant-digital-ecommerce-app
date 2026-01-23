import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface VoiceSearchButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onStart: () => void;
  onStop: () => void;
  className?: string;
}

export function VoiceSearchButton({
  isListening,
  isSupported,
  onStart,
  onStop,
  className,
}: VoiceSearchButtonProps) {
  if (!isSupported) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled
              className={cn("h-8 w-8 p-0 opacity-50", className)}
            >
              <MicOff className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voice search not supported in this browser</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isListening ? "destructive" : "ghost"}
            size="sm"
            onClick={isListening ? onStop : onStart}
            className={cn(
              "h-8 w-8 p-0 transition-all duration-200",
              isListening && "animate-pulse shadow-lg shadow-destructive/30",
              className
            )}
          >
            {isListening ? (
              <div className="relative">
                <Mic className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-white animate-ping" />
              </div>
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isListening ? 'Stop listening' : 'Search by voice'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
