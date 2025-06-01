
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { DemoConfig } from './DemoConfigEditor';

interface ThemeEditorProps {
  form: UseFormReturn<DemoConfig>;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ form }) => {
  const { register, watch, setValue } = form;
  const themeValues = watch('theme');

  const formatLabel = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  const ColorInput = ({ label, name, value }: { label: string; name: string; value: string }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="flex gap-2 items-center">
        <div
          className="w-10 h-10 rounded-md border-2 border-border shadow-sm"
          style={{ backgroundColor: value }}
        />
        <Input
          {...register(name as any)}
          className="flex-1 bg-muted border-border text-foreground placeholder:text-muted-foreground"
          placeholder="#000000"
        />
      </div>
    </div>
  );

  const SliderInput = ({ 
    label, 
    name, 
    value, 
    min = 0, 
    max = 10, 
    step = 0.1 
  }: { 
    label: string; 
    name: string; 
    value: number; 
    min?: number; 
    max?: number; 
    step?: number; 
  }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
          {value}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => setValue(name as any, values[0])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Color Palette</CardTitle>
          <CardDescription className="text-muted-foreground">Customize the visual appearance of your demo</CardDescription>
        </CardHeader>
        <CardContent className="bg-background">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(themeValues.colors).map(([key, value]) => (
              <ColorInput 
                key={key}
                label={formatLabel(key)} 
                name={`theme.colors.${key}`} 
                value={value as string} 
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Animation Timing</CardTitle>
          <CardDescription className="text-muted-foreground">Fine-tune animation durations and timing</CardDescription>
        </CardHeader>
        <CardContent className="bg-background">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(themeValues.animation).map(([key, value]) => (
              <SliderInput
                key={key}
                label={formatLabel(key)}
                name={`theme.animation.${key}`}
                value={value as number}
                min={0}
                max={key.includes('Duration') || key.includes('Pause') || key.includes('Wait') ? 5 : 10}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Audio Settings</CardTitle>
          </CardHeader>
          <CardContent className="bg-background">
            {Object.entries(themeValues.audio).map(([key, value]) => (
              <SliderInput
                key={key}
                label={formatLabel(key)}
                name={`theme.audio.${key}`}
                value={value as number}
                min={0}
                max={1}
              />
            ))}
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Layout Settings</CardTitle>
          </CardHeader>
          <CardContent className="bg-background">
            <div className="space-y-4">
              {Object.entries(themeValues.layout).map(([key, value]) => (
                <SliderInput
                  key={key}
                  label={formatLabel(key)}
                  name={`theme.layout.${key}`}
                  value={value as number}
                  min={1}
                  max={12}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
