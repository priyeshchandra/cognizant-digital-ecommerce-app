import { Mic, AlertCircle, Waves } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface VoiceTranscriptDisplayProps {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  className?: string;
}

export function VoiceTranscriptDisplay({
  isListening,
  transcript,
  interimTranscript,
  error,
  className,
}: VoiceTranscriptDisplayProps) {
  if (error) {
    return (
      <Alert variant="destructive" className={cn("mt-2", className)}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!isListening && !transcript && !interimTranscript) {
    return null;
  }

  return (
    <div
      className={cn(
        "mt-2 p-3 rounded-lg border transition-all duration-300",
        isListening 
          ? "bg-primary/5 border-primary/30 shadow-sm" 
          : "bg-muted/50 border-border",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex-shrink-0 p-1.5 rounded-full",
          isListening ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
        )}>
          {isListening ? (
            <Waves className="h-4 w-4 animate-pulse" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          {isListening && !transcript && !interimTranscript && (
            <p className="text-sm text-muted-foreground animate-pulse">
              Listening... Speak your search query
            </p>
          )}
          
          {(transcript || interimTranscript) && (
            <p className="text-sm">
              <span className="text-foreground">{transcript}</span>
              {interimTranscript && (
                <span className="text-muted-foreground italic">
                  {transcript ? ' ' : ''}{interimTranscript}
                </span>
              )}
            </p>
          )}
        </div>
      </div>
      
      {isListening && (
        <div className="flex gap-1 mt-2 ml-9">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-primary rounded-full animate-pulse"
              style={{
                height: `${8 + Math.random() * 12}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.5s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
