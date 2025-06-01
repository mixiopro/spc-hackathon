import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, ExternalLink } from 'lucide-react';
import { DemoConfig } from './DemoConfigEditor';


interface AssetsEditorProps {
  form: UseFormReturn<DemoConfig>;
}

export const AssetsEditor: React.FC<AssetsEditorProps> = ({ form }) => {
  const { register, control, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'assets.videos'
  });

  const audioUrl = watch('assets.audio.backgroundMusic');

  const addVideo = () => {
    append({ name: '', url: '' });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            🎵 Background Audio
          </CardTitle>
          <CardDescription className="text-muted-foreground">Set the background music for your demo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label htmlFor="backgroundMusic" className="text-foreground">Background Music URL</Label>
            <div className="flex gap-2">
              <Input
                id="backgroundMusic"
                {...register('assets.audio.backgroundMusic')}
                placeholder="https://example.com/audio.mp3"
                className="flex-1 bg-muted border-border text-foreground placeholder:text-muted-foreground"
              />
              {audioUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(audioUrl, '_blank')}
                  className="flex items-center gap-1 bg-muted border-border text-foreground hover:bg-muted/80"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            🎬 Video Assets
          </CardTitle>
          <CardDescription className="text-muted-foreground">Manage your video clips for the demo sequence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg bg-muted border-border hover:bg-muted/80 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div>
                      <Label htmlFor={`video-name-${index}`} className="text-foreground">Video Name</Label>
                      <Input
                        id={`video-name-${index}`}
                        {...register(`assets.videos.${index}.name`)}
                        placeholder="e.g., 1_SelectUseCase"
                        className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`video-url-${index}`} className="text-foreground">Video URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`video-url-${index}`}
                          {...register(`assets.videos.${index}.url`)}
                          placeholder="https://example.com/video.mp4"
                          className="flex-1 bg-muted border-border text-foreground placeholder:text-muted-foreground"
                        />
                        {field.url && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(field.url, '_blank')}
                            className="flex items-center gap-1 bg-muted border-border text-foreground hover:bg-muted/80"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                    className="mt-6"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addVideo}
              className="w-full flex items-center gap-2 border-dashed border-2 border-border py-8 bg-background hover:bg-muted text-foreground"
            >
              <Plus className="w-4 h-4" />
              Add Video Asset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};