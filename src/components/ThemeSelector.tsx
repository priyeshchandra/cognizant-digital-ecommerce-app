import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Palette, Moon, Sun } from 'lucide-react';

interface ThemeSelectorProps {
  onThemeChange: (theme: string) => void;
}

export const ThemeSelector = ({ onThemeChange }: ThemeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const themes = [
    { name: 'Default', value: 'default', color: 'bg-primary' },
    { name: 'Ocean', value: 'ocean', color: 'bg-blue-600' },
    { name: 'Forest', value: 'forest', color: 'bg-green-600' },
    { name: 'Sunset', value: 'sunset', color: 'bg-orange-600' },
    { name: 'Royal', value: 'royal', color: 'bg-purple-600' },
  ];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Palette className="h-4 w-4" />
        Theme
      </Button>
      
      {isOpen && (
        <Card className="absolute right-0 top-12 z-50 p-4 min-w-[200px]">
          <h3 className="font-semibold mb-3">Choose Theme</h3>
          <div className="space-y-2">
            {themes.map((theme) => (
              <Button
                key={theme.value}
                variant="ghost"
                className="w-full justify-start gap-3"
                onClick={() => {
                  onThemeChange(theme.value);
                  setIsOpen(false);
                }}
              >
                <div className={`w-4 h-4 rounded-full ${theme.color}`} />
                {theme.name}
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};