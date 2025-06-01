
import React from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { AssetsEditor } from './AsssetsEditor';
import { ContentEditor } from './ContentEditor';
import { ThemeEditor } from './ThemeEditor';
import { VideoSequenceEditor } from './VideoSequenceEditor';
import { FormState } from '../v2/main-content';


export type VideoKeyPoints = {
  keyActionTime?: number;
  typingStartTime?: number;
  typingEndTime?: number;
  productImageClickTime?: number;
  logoClickTime?: number;
  selectionEndTime?: number;
  createClickTime?: number;
  loadingClipStartTime?: number;
  loadingEndTime?: number;
  resultsAppearTime?: number;
  resultsEndTime?: number;
};

export type VideoSequenceItem = {
  clipName: string;
  duration: number;
  keyPoints: VideoKeyPoints;
};

export type DemoConfig = {
  theme: {
    colors: {
      white: string;
      black: string;
      background: string;
      primaryHighlight: string;
      secondaryHighlight: string;
      overlayText: string;
      overlayShadow: string;
    };
    animation: {
      crossFadeDuration: number;
      keyActionPause: number;
      defaultEndWait: number;
      introTextDuration: number;
      introHoldDuration: number;
      overlayFadeDuration: number;
      loadingOverlayTotalDisplayTime: number;
    };
    audio: {
      initialVolume: number;
    };
    layout: {
      introFontSizeLarge: number;
      introFontSizeSmall: number;
      overlayTextSize: number;
      loadingTextSize: number;
    };
  };
  assets: {
    videos: Array<{
      name: string;
      url: string;
    }>;
    audio: {
      backgroundMusic: string;
    };
  };
  content: {
    intro: {
      line1: string;
      line2: string;
      line3: string;
    };
    overlays: {
      typingPrompt: string;
      loadingSteps: Array<{ name: string }>;
    };
  };
  videoSequence: VideoSequenceItem[];
};

export const defaultConfig: DemoConfig = {
  theme: {
    colors: {
      white: "#ffffff",
      black: "#000000",
      background: "#141414",
      primaryHighlight: "#EC4899",
      secondaryHighlight: "#6366F1",
      overlayText: "#FFFFFF",
      overlayShadow: "rgba(0, 0, 0, 0.6)"
    },
    animation: {
      crossFadeDuration: 0.2,
      keyActionPause: 0.3,
      defaultEndWait: 1.0,
      introTextDuration: 1.0,
      introHoldDuration: 1.5,
      overlayFadeDuration: 0.3,
      loadingOverlayTotalDisplayTime: 4.0
    },
    audio: {
      initialVolume: 0.8
    },
    layout: {
      introFontSizeLarge: 6,
      introFontSizeSmall: 4,
      overlayTextSize: 2.5,
      loadingTextSize: 3.5
    }
  },
  assets: {
    videos: [
      {
        name: "1_SelectUseCase",
        url: "https://cdn.hailuoai.video/moss/prod/2025-04-14-02/video/1744569199352948383-video_watermark_91649947e6f3c7217cfa15b58d55f81e_367894563442290696.mp4"
      },
      {
        name: "3_TypePrompt",
        url: "https://cdn.hailuoai.video/moss/prod/2025-04-14-02/video/1744569570610635749-video_watermark_a9df87d5e024d6cda3d4ef933ef8efab_367896144397115393.mp4"
      }
    ],
    audio: {
      backgroundMusic: "https://storage.googleapis.com/revideo-assets/dark-mystery-trailer-taking-our-time-131566.mp3"
    }
  },
  content: {
    intro: {
      line1: "Create",
      line2: "Stunning Product Videos",
      line3: "with AI"
    },
    overlays: {
      typingPrompt: "Crafting the perfect prompt...",
      loadingSteps: [
        { name: "Understanding" },
        { name: "Analyzing" }
      ]
    }
  },
  videoSequence: [
    {
      clipName: "1_SelectUseCase",
      duration: 2.0,
      keyPoints: {
        keyActionTime: 1.5
      }
    }
  ]
};

interface DemoConfigEditorProps {
  initialConfig?: DemoConfig;
  onSave?: (config: DemoConfig) => void;
  form?: UseFormReturn<FormState>;
}

export const DemoConfigEditor: React.FC<DemoConfigEditorProps> = ({
  initialConfig = defaultConfig,
  onSave,
  form: externalForm
}) => {
  const form = externalForm || useForm<FormState>({
    defaultValues: {
      config: initialConfig,
      code: ""
    }
  });

  const handleSave = (data: FormState) => {
    console.log('Saving configuration:', data);
    toast({
      title: "Configuration Saved",
      description: "Your demo configuration has been successfully updated.",
    });
    onSave?.(data.config);
  };

  const handleExport = () => {
    const data = form.getValues();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'demo-config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Configuration Exported",
      description: "Configuration file has been downloaded.",
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-slate-800 border-slate-700 shadow-2xl">
          {/* <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-t-lg border-b border-gray-600">
            <CardTitle className="text-3xl font-bold text-white">Demo Configuration Editor</CardTitle>
            <CardDescription className="text-gray-300">
              Configure your video demo settings with real-time preview
            </CardDescription>
          </CardHeader> */}
          
          <CardContent className="p-0 bg-slate-800">
            <form onSubmit={form.handleSubmit(handleSave)}>
              <Tabs defaultValue="theme" className="w-full">
                <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-slate-700 bg-slate-800">
                  <TabsTrigger value="theme" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400">Theme</TabsTrigger>
                  <TabsTrigger value="assets" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400">Assets</TabsTrigger>
                  <TabsTrigger value="content" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400">Content</TabsTrigger>
                  <TabsTrigger value="sequence" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400">Video Sequence</TabsTrigger>
                </TabsList>
                
                <div className="p-6 bg-slate-800">
                  <TabsContent value="theme" className="mt-0">
                    <ThemeEditor form={form} />
                  </TabsContent>
                  
                  <TabsContent value="assets" className="mt-0">
                    <AssetsEditor form={form} />
                  </TabsContent>
                  
                  <TabsContent value="content" className="mt-0">
                    <ContentEditor form={form} />
                  </TabsContent>
                  
                  <TabsContent value="sequence" className="mt-0">
                    <VideoSequenceEditor form={form} />
                  </TabsContent>
                </div>
              </Tabs>
              
              <div className="flex justify-between items-center p-6 bg-slate-700 border-t border-slate-600">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleExport}
                  className="flex items-center gap-2 bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
                >
                  <span>📥</span> Export JSON
                </Button>
                
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => form.reset()}
                    className="bg-slate-600 text-white hover:bg-slate-500"
                  >
                    Reset
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Save Configuration
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

