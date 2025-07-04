
import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Play } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DemoConfig } from './DemoConfigEditor';

interface VideoSequenceEditorProps {
  form: UseFormReturn<DemoConfig>;
}

export const VideoSequenceEditor: React.FC<VideoSequenceEditorProps> = ({ form }) => {
  const { register, control, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'videoSequence'
  });

  const addSequenceItem = () => {
    append({
      clipName: '',
      duration: 0,
      keyPoints: {}
    });
  };

  const keyPointFields = [
    { key: 'keyActionTime', label: 'Key Action Time' },
    { key: 'typingStartTime', label: 'Typing Start Time' },
    { key: 'typingEndTime', label: 'Typing End Time' },
    { key: 'productImageClickTime', label: 'Product Image Click Time' },
    { key: 'logoClickTime', label: 'Logo Click Time' },
    { key: 'selectionEndTime', label: 'Selection End Time' },
    { key: 'createClickTime', label: 'Create Click Time' },
    { key: 'loadingClipStartTime', label: 'Loading Clip Start Time' },
    { key: 'loadingEndTime', label: 'Loading End Time' },
    { key: 'resultsAppearTime', label: 'Results Appear Time' },
    { key: 'resultsEndTime', label: 'Results End Time' }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            🎞️ Video Sequence
          </CardTitle>
          <CardDescription className="text-muted-foreground">Configure the order and timing of video clips</CardDescription>
        </CardHeader>
        <CardContent className="bg-background">
          <div className="space-y-4">
            <Accordion type="multiple" className="w-full">
              {fields.map((field, index) => {
                const clipName = watch(`videoSequence.${index}.clipName`);
                const duration = watch(`videoSequence.${index}.duration`);
                
                return (
                  <AccordionItem key={field.id} value={`item-${index}`} className="border rounded-lg border-border bg-background">
                    <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <Play className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">
                            {clipName || `Clip ${index + 1}`}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ({duration}s)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(index);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`clip-name-${index}`}>Clip Name</Label>
                            <Input
                              id={`clip-name-${index}`}
                              {...register(`videoSequence.${index}.clipName`)}
                              placeholder="e.g., 1_SelectUseCase"
                              className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`duration-${index}`} className="text-foreground">Duration (seconds)</Label>
                            <Input
                              id={`duration-${index}`}
                              type="number"
                              step="0.1"
                              {...register(`videoSequence.${index}.duration`, { valueAsNumber: true })}
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-base font-medium mb-3 block text-foreground">Key Points (seconds)</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {keyPointFields.map((kp) => (
                              <div key={kp.key}>
                                <Label htmlFor={`${kp.key}-${index}`} className="text-sm text-foreground">
                                  {kp.label}
                                </Label>
                                <Input
                                  id={`${kp.key}-${index}`}
                                  type="number"
                                  step="0.1"
                                  {...register(`videoSequence.${index}.keyPoints.${kp.key}` as any, { valueAsNumber: true })}
                                  placeholder="0.0"
                                  className="text-sm bg-muted border-border text-foreground placeholder:text-muted-foreground"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
            
            <Button
              type="button"
              variant="outline"
              onClick={addSequenceItem}
              className="w-full flex items-center gap-2 border-dashed border-2 py-8 hover:bg-muted border-border text-foreground"
            >
              <Plus className="w-4 h-4" />
              Add Video Sequence Item
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
