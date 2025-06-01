import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { FormState } from '../v2/main-content';


interface AssetsEditorProps {
  form: UseFormReturn<FormState>;
}

export const AssetsEditor: React.FC<AssetsEditorProps> = ({ form }) => {
  const { register, control, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'config.assets.videos'
  });

  const audioUrl = watch('config.assets.audio.backgroundMusic');

  const addVideo = () => {
    append({ name: '', url: '' });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
            🎵 Background Audio
          </CardTitle>
          <CardDescription className="text-slate-400">Set the background music for your demo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label htmlFor="backgroundMusic" className="text-slate-200">Background Music URL</Label>
            <div className="flex gap-2">
              <Input
                id="backgroundMusic"
                {...register('config.assets.audio.backgroundMusic')}
                placeholder="https://example.com/audio.mp3"
                className="flex-1 bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
              />
              {audioUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(audioUrl, '_blank')}
                  className="flex items-center gap-1 bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
            🎬 Video Assets
          </CardTitle>
          <CardDescription className="text-slate-400">Manage your video clips for the demo sequence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg bg-slate-700 border-slate-600 hover:bg-slate-600 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div>
                      <Label htmlFor={`video-name-${index}`} className="text-slate-200">Video Name</Label>
                      <Input
                        id={`video-name-${index}`}
                        {...register(`config.assets.videos.${index}.name`)}
                        placeholder="e.g., 1_SelectUseCase"
                        className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`video-url-${index}`} className="text-slate-200">Video URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`video-url-${index}`}
                          {...register(`config.assets.videos.${index}.url`)}
                          placeholder="https://example.com/video.mp4"
                          className="flex-1 bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                        />
                        {field.url && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(field.url, '_blank')}
                            className="flex items-center gap-1 bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
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
              className="w-full flex items-center gap-2 border-dashed border-2 border-slate-500 py-8 bg-slate-800 hover:bg-slate-700 text-slate-200"
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