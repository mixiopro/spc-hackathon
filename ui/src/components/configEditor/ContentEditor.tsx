
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { FormState } from '../v2/main-content';


interface ContentEditorProps {
  form: UseFormReturn<FormState>;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ form }) => {
  const { register, control, watch } = form;
  const contentValues = watch('config.content');
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'config.content.overlays.loadingSteps'
  });

  const addLoadingStep = () => {
    append({ name: '' });
  };

  const formatLabel = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
            🎬 Intro Text
          </CardTitle>
          <CardDescription className="text-slate-400">Configure the introductory text lines</CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-800">
          <div className="space-y-4">
            {Object.entries(contentValues.intro).map(([key, value], index) => (
              <div key={key}>
                <Label htmlFor={`intro-${key}`} className="text-slate-200">{formatLabel(key)}</Label>
                <Input
                  id={`intro-${key}`}
                  {...register(`content.intro.${key}` as any)}
                  placeholder={`${formatLabel(key)} of intro`}
                  className="text-lg font-semibold bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
            💭 Overlay Content
          </CardTitle>
          <CardDescription className="text-slate-400">Configure overlay text and loading messages</CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-800">
          <div className="space-y-6">
            {Object.entries(contentValues.overlays).map(([key, value]) => {
              if (key === 'loadingSteps') return null;
              
              return (
                <div key={key}>
                  <Label htmlFor={key} className="text-slate-200">{formatLabel(key)}</Label>
                  <Input
                    id={key}
                    {...register(`content.overlays.${key}` as any)}
                    placeholder={`Text for ${formatLabel(key).toLowerCase()}`}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
              );
            })}

            <div>
              <Label className="text-base font-medium mb-3 block text-slate-200">Loading Steps</Label>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <Input
                        {...register(`config.content.overlays.loadingSteps.${index}.name`)}
                        placeholder={`Loading step ${index + 1}`}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addLoadingStep}
                  className="w-full flex items-center gap-2 border-dashed border-2 bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
                >
                  <Plus className="w-4 h-4" />
                  Add Loading Step
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
